import React, {Component} from 'react';
import {Link} from 'react-router-dom'
import Search from "../../fragments/search";
import {ReactComponent as RejectIcon} from '../../assets/icons/delete.svg'
import {ReactComponent as ChekMarkIcon} from '../../assets/icons/check-mark.svg'
import {ReactComponent as ClipIcon} from '../../assets/icons/clip.svg'
import * as dateFns from 'date-fns'
import {inject, observer} from "mobx-react";
import Preloader from "../../fragments/preloader/Preloader";
import {NotificationContainer, NotificationManager} from "react-notifications";

const dateFormat = require('dateformat');

class RequestsList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            preloader: true,
        }

        this.deleteAppeal = this.deleteAppeal.bind(this)
        this.deleteFunction = this.deleteFunction.bind(this)
        this.searchAppeal = this.searchAppeal.bind(this)
        this.nextPage = this.nextPage.bind(this)
        this.prevPage = this.prevPage.bind(this)
        this.loadAppeals = this.loadAppeals.bind(this)
    }

    componentDidMount() {
        this.props.userStore.profileInfo(() => {
            this.loadAppeals()
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

    loadAppeals(){
        this.props.appealStore.loadAppeals( 0,null,this.props.userStore.profile.union.resource_id,() => {
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

    deleteAppeal(event){
        this.setState({ preloader: true })

        let ev = event.target.dataset.id

        if (ev == undefined) {
           let id = event.target.parentNode.dataset.id
            this.deleteFunction(id)
        }else{
            let id = event.target.dataset.id
            this.deleteFunction(id)
        }
    }

    deleteFunction(id){
        this.props.appealStore.deleteAppeal(id, () => {

            this.props.appealStore.loadAppeals(0,null,this.props.userStore.profile.union.resource_id,() => {
                this.setState({ preloader: false })
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

    searchAppeal(search){
        if (search.length > 2){
            this.setState({ preloader: true })
            this.props.appealStore.loadAppeals(0,search, this.props.userStore.profile.union.resource_id,() => {
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
            this.setState({ preloader: false })
        }else{
            this.loadAppeals()
        }
    }

    prevPage(){
        this.setState({ preloader: true })
        if (this.props.appealStore.pageNumberAppeals > 1){
            this.props.appealStore.pageNumberAppeals = this.props.appealStore.pageNumberAppeals - 1
            this.loadAppeals()
        }else{
            this.setState({ preloader: false })
        }
    }

    nextPage(){
        this.setState({ preloader: true })
        if (this.props.appealStore.pageNumberIndustries < this.props.appealStore.pageCountIndustries){
            this.props.appealStore.pageNumberIndustries = this.props.appealStore.pageNumberIndustries + 1
            this.loadAppeals()
        }else{
            this.setState({ preloader: false })
        }
    }

    render() {

        return (
            <div className='fprk-requests'>
                {
                    this.state.preloader &&
                    <Preloader/>
                }
                <NotificationContainer/>

                <Search
                    currentPage={this.props.appealStore.currentPageAppeals}
                    pageCount={this.props.appealStore.pageCountAppeals}
                    prevPage={this.prevPage}
                    nextPage={this.nextPage}
                    search={this.searchAppeal}
                />

                <table>
                    <thead className="heading">
                        <tr>
                            <td className="subject">{this.props.userStore.languageList["Тема"] || 'Тема'}</td>
                            <td className="full-name">{this.props.userStore.languageList["ФИО"] || 'ФИО'}</td>
                            <td className="date">{this.props.userStore.languageList["Дата"] || 'Дата'}</td>
                            <td className="attachment">
                                <div className="icon">
                                    <ClipIcon/>
                                </div>
                            </td>
                            {
                                this.props.permissionsStore.hasPermission('appeal', 'answer') &&
                                <td className="answer">{this.props.userStore.languageList["Ответить"] || 'Ответить'}</td>
                            }

                            <td className="delete">{this.props.userStore.languageList["Удалить"] || 'Удалить'}</td>
                        </tr>
                    </thead>
                    <tbody className="requests-list list">
                    {
                        this.props.appealStore.appealList.map((appeal, index) => {
                            return <tr className='not-answered' key={index}>
                                <td className="subject">{ appeal.title }</td>
                                <td className="full-name">
                                    { appeal.person?.patronymic !== null ?
                                     `${appeal.person?.first_name} ${appeal.person?.family_name} ${appeal.person?.patronymic}`
                                        :
                                     `${appeal.person?.first_name} ${appeal.person?.family_name}`
                                    }
                                </td>
                                <td className="date">{ dateFormat(appeal.created_date, 'dd.mm.yyyy hh:mm:ss') }</td>
                                <td className="attachment">
                                    {
                                        appeal.files.length > 0 &&
                                        <div className='attachment'>
                                            <div className="icon">
                                                <ClipIcon/>
                                            </div>
                                        </div>
                                    }
                                </td>
                                {
                                    this.props.permissionsStore.hasPermission('appeal', 'answer') &&
                                    <td className="answer accept">
                                        <Link to={`/appeal/request/` + appeal.resource_id}>
                                            <div className="btn-action">
                                            <span className="icon">
                                                <ChekMarkIcon/>
                                            </span>
                                                {
                                                    appeal.answer.resource_id ?
                                                    <span>{this.props.userStore.languageList["Просмотреть"] || 'Просмотреть'}</span>
                                                    :
                                                    <span>{this.props.userStore.languageList["Ответить"] || 'Ответить'}</span>
                                                }
                                            </div>
                                        </Link>
                                    </td>
                                }
                                <td className="delete">
                                    <button className={'reject'}>
                                        <div className="btn-action" style={{
                                            display: "flex",
                                            alignItems: "center",
                                            borderRadius: 4,
                                        }} data-id={appeal.resource_id} onClick={this.deleteAppeal}>
                                            <div className={'icon'}>
                                                <RejectIcon data-id={appeal.resource_id}/>
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
        );
    }
}

export default inject('appealStore', 'userStore', 'permissionsStore')(observer(RequestsList));