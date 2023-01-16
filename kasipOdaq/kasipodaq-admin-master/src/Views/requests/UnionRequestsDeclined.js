import React, {Component} from 'react';
import {connect} from 'react-redux'
import Search from "../../fragments/search";
import {withRouter} from 'react-router-dom'
import {Link} from 'react-router-dom'

import {ReactComponent as ProfileIcon} from '../../assets/icons/profile.svg'
import {ReactComponent as RejectIcon} from '../../assets/icons/delete.svg'
import {ReactComponent as ChekMarkIcon} from '../../assets/icons/check-mark.svg'
import Preloader from "../../fragments/preloader/Preloader";
import {inject, observer} from "mobx-react";
import {NotificationContainer, NotificationManager} from "react-notifications";

class UnionRequestsDeclined extends Component {

    constructor(props){
        super(props);

        this.state = {
            preloadUnions: false,
        };

        this.deleteApplication = this.deleteApplication.bind(this)
    }

    componentDidMount() {

        this.props.history.push({
            state: { tabId: 2 }
        });

        this.setState({
            preloadUnions: true
        }, () => {
            this.props.unionStore.loadUnions( 102,data => {
                this.setState({
                    preloadUnions: false
                })
            }, response => {
                if (Array.isArray(response.data)) {
                    response.data.forEach(error => {
                        this.setState({ preloadUnions: false });
                        NotificationManager.error(error.message)
                    })
                } else {
                    this.setState({ preloadUnions: false });
                    NotificationManager.error(response.data.message)
                }
                if (response.status == 401){
                    this.setState({ preloadUnions: false });
                    this.props.history.push('/')
                }
            })
        })

    }

    deleteApplication(event){
        this.setState({ preloadUnions: true });

        let id = event.target.dataset.id;

        this.props.unionStore.deleteApplication(id, () => {
            this.props.unionStore.loadUnions(102, () => {
                this.setState({ preloadUnions: false })
            }, response => {
                if (Array.isArray(response.data)) {
                    response.data.forEach(error => {
                        this.setState({ preloadUnions: false });
                        NotificationManager.error(error.message)
                    })
                } else {
                    this.setState({ preloadUnions: false });
                    NotificationManager.error(response.data.message)
                }
                if (response.status == 401){
                    this.setState({ preloadUnions: false });
                    this.props.history.push('/')
                }
            })
        }, response => {
            if (Array.isArray(response.data)) {
                response.data.forEach(error => {
                    this.setState({ preloadUnions: false });
                    NotificationManager.error(error.message)
                })
            } else {
                this.setState({ preloadUnions: false });
                NotificationManager.error(response.data.message)
            }
            if (response.status == 401){
                this.setState({ preloadUnions: false });
                this.props.history.push('/')
            }
        })
    }

    render() {
        return (
            <div>
                <div className="title-wrapper">
                    <h1>{ this.props.userStore.languageList["Заявки на создание"] || 'Заявки на создание' }</h1>
                </div>
                <div className='union-requests'>
                    <Search totalCount={this.state.totalCount}
                            currentPage={this.state.currentPage}
                            pageCount={this.state.pageCount}
                            perPage={this.state.perPage}
                            pagingCallback={this.loadPage}
                            searchCallback={this.searchRequest}
                            showSearchString={false}/>

                    {
                        this.state.preloadUnions &&
                        <Preloader/>
                    }

                    <NotificationContainer/>

                    <div className="requests-list">
                        <table>
                            <thead className="heading">
                            <tr>
                                <td className="company">{ this.props.userStore.languageList["Название компании"] || 'Название компании' }</td>
                                <td className="fio">{ this.props.userStore.languageList["ФИО"] || 'ФИО' }</td>
                                <td className="phone">{ this.props.userStore.languageList["Телефон"] || 'Телефон' }</td>
                                <td className="accept-column">
                                    { this.props.userStore.languageList["Подробная информация"] || 'Подробная информация' }
                                </td>
                                <td className="accept-column">
                                    { this.props.userStore.languageList["Удалить"] || 'Удалить' }
                                </td>
                            </tr>
                            </thead>
                            <tbody className="list">
                            {
                                this.props.unionStore.unionsList.map((union, index) => {
                                    return <tr key={index}>
                                        <td className="company">{ union.union_name }</td>
                                        <td className="fio">
                                            <div className="check-as-admin"/>
                                            <span>{ `${union.person.first_name} ${union.person.family_name}` }</span>
                                        </td>
                                        <td className="phone">{ union.phone }</td>
                                        <td className="accept-column">
                                            <button className="more">
                                                <div className="btn-action">
                                                    <span className="icon">
                                                        <ProfileIcon/>
                                                    </span>
                                                    <a className="icon-link" href={`/requests/person/${union.resource_id}`}>
                                                        { this.props.userStore.languageList["Подробная информация"] || 'Подробная информация' }
                                                    </a>
                                                </div>
                                            </button>
                                        </td>
                                        <td className="accept-column">
                                            <button className="reject">
                                                <div className="btn-action">
                                                    <div className="icon">
                                                        <RejectIcon/>
                                                    </div>
                                                    <div onClick={this.deleteApplication} data-id={union.resource_id}>{ this.props.userStore.languageList["Удалить"] || 'Удалить' }</div>
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
            </div>

        );
    }
}

export default  inject('unionStore', 'userStore', 'permissionsStore')(observer(withRouter(UnionRequestsDeclined)));