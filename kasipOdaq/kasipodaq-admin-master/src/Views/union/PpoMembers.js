import React, {Component} from 'react';
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import Search from "../../fragments/search";
import {withRouter} from 'react-router-dom'

import {ReactComponent as ProfileIcon} from '../../assets/icons/profile.svg'
import {ReactComponent as RejectIcon} from '../../assets/icons/remove.svg'
import {ReactComponent as StarIcon} from '../../assets/icons/star.svg'
import {inject, observer} from "mobx-react";
import Preloader from "../../fragments/preloader/Preloader";
import {NotificationContainer, NotificationManager} from "react-notifications";
import {ReactComponent as CloseIcon} from "../../assets/icons/cross.svg";
import Modal from "react-modal";

class PpoMembers extends Component {

    constructor(props) {
        super(props);

        this.state = {
            preloader: true,
            deleteMemberDialog: false,
            memberId: null,
        }

        this.deleteRef = React.createRef()

        this.loadPage = this.loadPage.bind(this)
        this.deleteMemberDialog = this.deleteMemberDialog.bind(this)
        this.excludeMember = this.excludeMember.bind(this)
        this.prevPage = this.prevPage.bind(this)
        this.nextPage = this.nextPage.bind(this)
        this.searchMembers = this.searchMembers.bind(this)
    }

    loadPage(){
        if (this.props.match.params.id != 'undefined'){
            this.props.unionStore.loadMembersPpo(this.props.match.params.id, null, (data) => {
                this.setState({ preloader: false })

            }, response => {
                if (Array.isArray(response.data)) {
                    response.data.forEach(error => {
                        this.setState({ preloader: false })
                        NotificationManager.error(error.message)
                    })
                } else {
                    this.setState({ preloader: false })
                    NotificationManager.error(response.data.message)
                }
                if (response.status == 401){
                    this.setState({ preloader: false })
                    this.props.history.push('/')
                }
            })
        }else{
            this.props.unionStore.loadMembersPpo(this.props.userStore.profile.union.resource_id, null, (data) => {
                this.setState({ preloader: false })

            }, response => {
                if (Array.isArray(response.data)) {
                    response.data.forEach(error => {
                        this.setState({ preloader: false })
                        NotificationManager.error(error.message)
                    })
                } else {
                    this.setState({ preloader: false })
                    NotificationManager.error(response.data.message)
                }
                if (response.status == 401){
                    this.setState({ preloader: false })
                    this.props.history.push('/')
                }
            })
        }
    }

    componentDidMount() {
        this.loadPage()
    }

    deleteMemberDialog(event){

        this.setState({
            deleteMemberDialog: true
        })

        let ev = event.target.dataset.id

        if (ev == undefined) {
            let id = event.target.parentNode.dataset.id
            this.setState({
                memberId: id
            })
        }else{
            let id = event.target.dataset.id
            this.setState({
                memberId: id
            })
        }

    }

    excludeMember(event){
        event.preventDefault()

        this.setState({ preloader: true })
        this.props.unionStore.excludeMember(
            this.state.memberId,
            this.deleteRef.current.value,
            () => {
                this.setState({
                    deleteMemberDialog: false
                })
                NotificationManager.success('Вы удалили члена профсоюза')

            if (this.props.match.params.id != 'undefined'){
                this.props.unionStore.loadMembersPpo(this.props.match.params.id,null, () => {
                    this.setState({ preloader: false })
                }, response => {
                    if (Array.isArray(response.data)) {
                        response.data.forEach(error => {
                            this.setState({ preloader: false })
                            NotificationManager.error(error.message)
                        })
                    } else {
                        this.setState({ preloader: false })
                        NotificationManager.error(response.data.message)
                    }
                    if (response.status == 401){
                        this.setState({ preloader: false })
                        this.props.history.push('/')
                    }
                })
            }else{
                this.props.unionStore.loadMembersPpo(this.props.userStore.profile.union.resource_id,null, () => {
                    this.setState({ preloader: false })
                }, response => {
                    if (Array.isArray(response.data)) {
                        response.data.forEach(error => {
                            this.setState({ preloader: false })
                            NotificationManager.error(error.message)
                        })
                    } else {
                        this.setState({ preloader: false })
                        NotificationManager.error(response.data.message)
                    }
                    if (response.status == 401){
                        this.setState({ preloader: false })
                        this.props.history.push('/')
                    }
                })
            }

        },response => {
            if (Array.isArray(response.data)) {
                response.data.forEach(error => {
                    this.setState({ preloader: false })
                    NotificationManager.error(error.message)
                })
            } else {
                this.setState({ preloader: false })
                NotificationManager.error(response.data.message)
            }
            if (response.status == 401){
                this.setState({ preloader: false })
                this.props.history.push('/')
            }
        })
    }

    prevPage(){
        this.setState({ preloader: true })
        if (this.props.unionStore.pageNumberMembersPpo > 1){
            this.props.unionStore.pageNumberMembersPpo = this.props.unionStore.pageNumberMembersPpo - 1
            this.loadPage()
        }else{
            this.setState({ preloader: false })
        }
    }

    nextPage(){
        this.setState({ preloader: true })
        if (this.props.unionStore.pageNumberMembersPpo < this.props.unionStore.pageCountMembersPpo){
            this.props.unionStore.pageNumberMembersPpo = this.props.unionStore.pageNumberMembersPpo + 1
            this.loadPage()
        }else{
            this.setState({ preloader: false })
        }
    }

    searchMembers(search){
        if (search.length > 2){
            this.setState({ preloader: true })
            if (this.props.match.params.id != 'undefined'){
                this.props.unionStore.loadMembersPpo(this.props.match.params.id, search, () => {
                    this.setState({ preloader: false })
                }, response => {
                    if (Array.isArray(response.data)) {
                        response.data.forEach(error => {
                            this.setState({ preloader: false })
                            NotificationManager.error(error.message)
                        })
                    } else {
                        this.setState({ preloader: false })
                        NotificationManager.error(response.data.message)
                    }
                    if (response.status == 401){
                        this.setState({ preloader: false })
                        this.props.history.push('/')
                    }
                })
            }else{
                this.props.unionStore.loadMembersPpo(this.props.userStore.profile.union.resource_id, search, () => {
                    this.setState({ preloader: false })
                }, response => {
                    if (Array.isArray(response.data)) {
                        response.data.forEach(error => {
                            this.setState({ preloader: false })
                            NotificationManager.error(error.message)
                        })
                    } else {
                        this.setState({ preloader: false })
                        NotificationManager.error(response.data.message)
                    }
                    if (response.status == 401){
                        this.setState({ preloader: false })
                        this.props.history.push('/')
                    }
                })
            }
        }else{
            this.loadPage()
        }
    }

    render() {
        return (
            <div className='members'>

                {
                    this.state.preloader &&
                        <Preloader/>
                }

                <NotificationContainer/>

                <Search
                    currentPage={this.props.unionStore.currentPageMembersPpo}
                    pageCount={this.props.unionStore.pageCountMembersPpo}
                    search={this.searchMembers}
                    prevPage={this.prevPage}
                    nextPage={this.nextPage}
                />

                <div className="members-list">
                    <table>
                        <thead className="heading">
                            <tr>
                                <td className="iin">{this.props.userStore.languageList["ИИН"] || 'ИИН'}</td>
                                <td className="fio">{this.props.userStore.languageList["ФИО"] || 'ФИО'}</td>
                                <td className="phone">{this.props.userStore.languageList["Телефон"] || 'Телефон'}</td>
                                <td className="more">{this.props.userStore.languageList["Подробная информация"] || 'Подробная информация'}</td>
                                <td className="remove">{this.props.userStore.languageList["Исключить"] || 'Исключить'}</td>
                            </tr>
                        </thead>
                        <tbody className='list'>
                        {
                            this.props.unionStore.membersPpoList.map((member, index) => {
                                return <tr key={index}>
                                    <td className="iin">{ member.individual_number }</td>
                                    <td className="fio">
                                        <div className="fio__wrapper">
                                            <div className="icon">
                                                <div style={{
                                                    background: member.member_status == '101' ? 'url(/star_blue.svg) no-repeat center' : 'url(/star.svg)',
                                                    width: 25,
                                                    height: 24,
                                                }}>
                                                </div>
                                            </div>
                                            <div className="fio__text">
                                                { `${member.first_name} ${member.family_name}` }
                                            </div>
                                        </div>
                                    </td>
                                    <td className="phone">{ member.phone }</td>
                                    <td className="more">
                                        <Link to={{
                                            pathname:`/union/ppo/${this.props.match.params.id}/members/` + member.resource_id,
                                            state: { tabId: 2}
                                        }}>
                                            <div className='btn-action'>
                                                <div className="icon">
                                                    <ProfileIcon/>
                                                </div>
                                                <span>
                                                {this.props.userStore.languageList["Подробная информация"] || 'Подробная информация'}
                                            </span>
                                            </div>
                                        </Link>
                                    </td>
                                    <td className="remove" >
                                        <button className={'reject'}>
                                            <div className="btn-action" style={{
                                                display: "flex",
                                                alignItems: "center",
                                                borderRadius: 4,
                                            }} data-id={member.resource_id} onClick={this.deleteMemberDialog}>
                                                <div className={'icon'}>
                                                    <RejectIcon data-id={member.resource_id}/>
                                                </div>
                                                {this.props.userStore.languageList["Удалить"] || 'Удалить'}
                                            </div>
                                        </button>
                                    </td>
                                </tr>
                            })
                        }

                        {
                            this.state.deleteMemberDialog &&
                            <Modal
                                isOpen={true}
                                className="Modal"
                                overlayClassName="Overlay"
                            >
                                <NotificationContainer />
                                <div className='modal__wrapper create-section__wrapper' style={{ width: 594, height: 288 }}>
                                    <form onSubmit={(event) => this.excludeMember(event)} style={{ maxHeight: '100%' }}>

                                        <label>
                                            <p className="label">{this.props.userStore.languageList["Напишите причину исключения из Первичной Профсоюзной организации"]
                                            || 'Напишите причину исключения из Первичной Профсоюзной организации'}:</p>
                                            <div className="wrapper">

                                                {/*<input name='sectionName'*/}
                                                {/*       ref={this.typeName}*/}
                                                {/*       style={{ height: 144, border: '1px solid #E4E8F0' }}*/}
                                                {/*       type='text'*/}
                                                {/*       placeholder={this.props.userStore.languageList["Введите текст..."] || 'Введите текст...'}*/}
                                                {/*       className="section-name"*/}
                                                {/*/>*/}

                                                <textarea
                                                    name="sectionName"
                                                    ref={this.deleteRef}
                                                    style={{ height: 144, width: '100%', padding: 16, border: '1px solid #E4E8F0' }}
                                                    cols="30"
                                                    rows="10"
                                                    className="section-name"
                                                    placeholder={this.props.userStore.languageList["Необязательное поле"] || 'Необязательное поле'}
                                                >

                                                </textarea>

                                            </div>
                                        </label>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
                                            <button type='submit' className='btn' onClick={() => this.setState({ deleteMemberDialog: false })} style={{ margin: 0, marginRight: 16, background: '#EFF1F5', color: '#2E384D' }}>{this.props.userStore.languageList["Отмена"] || 'Отмена'}</button>
                                            <button type='submit' className='btn btn-save' style={{ margin: 0 }}>{this.props.userStore.languageList["Удалить"] || 'Удалить'}</button>
                                        </div>
                                    </form>
                                </div>
                            </Modal>
                        }

                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default inject('unionStore', 'permissionsStore', 'userStore')(observer(withRouter(PpoMembers)));