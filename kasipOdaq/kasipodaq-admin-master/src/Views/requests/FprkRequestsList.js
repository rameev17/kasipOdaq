import React, {Component} from 'react';
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import Search from "../../fragments/search";
import {ReactComponent as RejectIcon} from '../../assets/icons/delete.svg'
import {ReactComponent as CheckMarkIcon} from '../../assets/icons/check-mark.svg'
import {ReactComponent as ClipIcon} from '../../assets/icons/clip.svg'


import { observer, inject } from "mobx-react";
import {NotificationContainer, NotificationManager} from "react-notifications";

class FprkRequestsList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            requests: [],
            perPage: 10,
        }


    }

    componentDidMount() {
        this.props.unionStore.loadUnions(102,() => {

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
        this.props.unionStore.loadMembers(0, () => {

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

    /**
     * Временный костыль пока не готова АПИшка
     * Запросы берутся с Юр. помощи
     * **/


    render() {

        return (
            <div className='fprk-requests'>

                <Search totalCount={this.state.totalCount}
                        currentPage={this.state.currentPage}
                        pageCount={this.state.pageCount}
                        perPage={this.state.perPage}
                        pagingCallback={this.loadPage}
                        searchCallback={this.search}
                        showSearchString={false}/>

                <table>
                    <thead className="heading">
                    <tr>
                        <td className="subject">Тема</td>
                        <td className="full-name">ФИО</td>
                        <td className="date">Дата</td>
                        <td className="attachment">
                            <div className="icon">
                                <ClipIcon/>
                            </div>
                        </td>
                        <td className="answer">Ответить</td>
                        <td className="delete">Удалить</td>
                    </tr>
                    </thead>
                    <tbody className="requests-list list">
                    {
                        this.props.unionStore.unionsList.map((union, index) => {
                            return union.type == 0 &&
                                <tr className={'answered '} key={index}>
                                <td className="subject">{ union.name }</td>
                                <td className="full-name">full_name</td>
                                <td className="date">dd.MM.yyyy hh:mm:ss</td>
                                <td className="attachment">
                                    <div className='attachment'>
                                        <div className="icon">
                                            <ClipIcon/>
                                        </div>
                                    </div>
                                </td>
                                <td className="answer accept">
                                    <Link to={`/requests/request/${union.id}`}>
                                        <div className="btn-action">
                                                        <span className="icon">
                                                            <CheckMarkIcon/>
                                                        </span>
                                            <span>Ответить</span>
                                        </div>
                                    </Link>
                                </td>
                                <td className="delete">
                                    <button className="reject">
                                        <div className="btn-action">
                                            <div className="icon">
                                                <RejectIcon/>
                                            </div>
                                            <span>Удалить</span>
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

export default inject('unionStore', 'permissionsStore')(observer(FprkRequestsList));