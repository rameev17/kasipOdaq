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

class Ppo2Members extends Component {

    constructor(props) {
        super(props);

        this.state = {
            preloader: true,
        }

        this.loadPage = this.loadPage.bind(this)
        this.deleteMember = this.deleteMember.bind(this)
        this.excludeMember = this.excludeMember.bind(this)
        this.prevPage = this.prevPage.bind(this)
        this.nextPage = this.nextPage.bind(this)
        this.searchMembers = this.searchMembers.bind(this)
    }

    loadPage(){
        if (this.props.match.params.id != 'undefined'){
            this.props.unionStore.loadMembersPpo(this.props.match.params.id, null, () => {
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

            this.props.unionStore.loadUnion(this.props.match.params.id, (data) => {

                this.props.unionStore.breadCrumbs = data?.bread_crumbs

                console.log(data.bread_crumbs)

            }, response => {
                if (Array.isArray(response.data)) {
                    response.data.forEach(error => {
                        this.setState({ preloader: false })
                        // NotificationManager.error(error.message)
                    })
                } else {
                    this.setState({ preloader: false })
                    // NotificationManager.error(response.data.message)
                }
                if (response.status == 401){
                    this.setState({ preloader: false })
                    this.props.history.push('/')
                }
            })

        }else{
            this.props.unionStore.loadMembersPpo(this.props.userStore.profile.union.resource_id, null, () => {
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

            this.props.unionStore.loadUnion(this.props.userStore.profile.union.resource_id, (data) => {

                this.props.unionStore.breadCrumbs = data?.bread_crumbs

            }, response => {
                if (Array.isArray(response.data)) {
                    response.data.forEach(error => {
                        this.setState({ preloader: false })
                        // NotificationManager.error(error.message)
                    })
                } else {
                    this.setState({ preloader: false })
                    // NotificationManager.error(response.data.message)
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

    deleteMember(event){
        let ev = event.target.dataset.id

        if (ev == undefined) {
            let id = event.target.parentNode.dataset.id
            this.excludeMember(id)
        }else{
            let id = event.target.dataset.id
            this.excludeMember(id)
        }
    }

    excludeMember(id){
        this.setState({ preloader: true })

        this.props.unionStore.excludeMember(id, () => {

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

                {
                    this.props.userStore.role !== 'company' &&
                    <div style={{ marginTop: 16, marginBottom: 16 }}>
                        {
                            this.props.unionStore.breadCrumbs?.map((breadcrumb, index) => {
                                switch (breadcrumb.level) {
                                    case 'main_union':
                                        return (
                                            <> <Link style={{color: '#0052A4'}} to={`/union`}>{breadcrumb.name}</Link>
                                                {
                                                    index !== this.props.unionStore.breadCrumbs.length - 1 &&
                                                    <span> -> </span>
                                                }
                                            </>
                                        )
                                        break;
                                    case 'industry':
                                        return (
                                            <> <Link style={{color: '#0052A4'}}
                                                     to={`/union/opo/${breadcrumb.resource_id}`}>{breadcrumb.name}</Link>
                                                {
                                                    index !== this.props.unionStore.breadCrumbs.length - 1 &&
                                                    <span> -> </span>
                                                }
                                            </>
                                        )
                                        break;
                                    case 'branch':
                                        return (
                                            <> <Link style={{color: '#0052A4'}} to={`/union/list/${breadcrumb.resource_id}`}>{breadcrumb.name}</Link>
                                                {
                                                    index !== this.props.unionStore.breadCrumbs.length - 1 &&
                                                    <span> -> </span>
                                                }
                                            </>
                                        )
                                        break;
                                    case 'union':
                                        return (
                                            <> <Link style={{color: '#0052A4'}} to={`/union/ppo/${breadcrumb.resource_id}`}>{breadcrumb.name}</Link>
                                                {
                                                    index !== this.props.unionStore.breadCrumbs.length - 1 &&
                                                    <span> -> </span>
                                                }
                                            </>
                                        )
                                        break;
                                }

                            })
                        }
                    </div>
                }

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
                                            }} data-id={member.resource_id} onClick={this.deleteMember}>
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

                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default inject('unionStore', 'permissionsStore', 'userStore')(observer(withRouter(Ppo2Members)));