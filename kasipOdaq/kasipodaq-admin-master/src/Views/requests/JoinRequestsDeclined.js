import React, {Component} from 'react';
import {connect} from 'react-redux';
import Search from "../../fragments/search";
import {withRouter} from 'react-router-dom'
import {Link} from 'react-router-dom'

import {ReactComponent as ProfileIcon} from '../../assets/icons/profile.svg'
import {ReactComponent as RejectIcon} from '../../assets/icons/delete.svg'
import {ReactComponent as ChekMarkIcon} from '../../assets/icons/check-mark.svg'
import {inject, observer} from "mobx-react";
import Preloader from "../../fragments/preloader/Preloader";
import {NotificationContainer, NotificationManager} from "react-notifications";

class JoinRequestsDeclined extends Component {
    constructor(props) {
        super(props);

        this.state = {
            preloadMembers: false,
        };

        this.deleteApplication = this.deleteApplication.bind(this)
    }

    componentDidMount() {

        this.props.history.push({
            state: { tabId: 2 }
        });

        this.setState({
            preloadMembers: true
        }, () => {
            this.props.unionStore.loadMembers( 2,data => {
                this.setState({
                    preloadMembers: false
                })
            }, response => {
                if (Array.isArray(response.data)) {
                    response.data.forEach(error => {
                        this.setState({ preloadMembers: false });
                        NotificationManager.error(error.message)
                    })
                } else {
                    this.setState({ preloadMembers: false });
                    NotificationManager.error(response.data.message)
                }
                if (response.status == 401){
                    this.setState({ preloader: false });
                    this.props.history.push('/')
                }
            })
        })

    }

    deleteApplication(event){
        this.setState({ preloadMembers: true });

        let id = event.target.dataset.id;

        this.props.unionStore.deleteApplication(id, () => {
            this.props.unionStore.loadMembers(2, () => {
                this.setState({ preloadMembers: false })
            }, response => {
                if (Array.isArray(response.data)) {
                    response.data.forEach(error => {
                        this.setState({ preloadMembers: false });
                        NotificationManager.error(error.message)
                    })
                } else {
                    this.setState({ preloadMembers: false });
                    NotificationManager.error(response.data.message)
                }
                if (response.status == 401){
                    this.setState({ preloader: false });
                    this.props.history.push('/')
                }
            })
        }, response => {
            if (Array.isArray(response.data)) {
                response.data.forEach(error => {
                    this.setState({ preloadMembers: false });
                    NotificationManager.error(error.message)
                })
            } else {
                this.setState({ preloadMembers: false });
                NotificationManager.error(response.data.message)
            }
            if (response.status == 401){
                this.setState({ preloader: false });
                this.props.history.push('/')
            }
        })
    }

    render() {
        return (
            <div className='join-requests'>

                {
                    this.state.preloadMembers &&
                        <Preloader/>
                }

                <NotificationContainer/>

                <div className="title-wrapper">
                    <h1>{ this.props.userStore.languageList["Заявки на вступление"] || 'Заявки на вступление' }</h1>
                </div>
                <Search totalCount={this.state.totalCount}
                        currentPage={this.state.currentPage}
                        pageCount={this.state.pageCount}
                        perPage={this.state.perPage}
                        pagingCallback={this.loadPage}
                        searchCallback={this.searchRequest}/>
                <div className="requests-list">
                    <table>
                        <thead className="heading">
                        <tr>
                            <td className="iin">{ this.props.userStore.languageList["ИИН"] || 'ИИН' }</td>
                            <td className="fio">{ this.props.userStore.languageList["ФИО"] || 'ФИО' }</td>
                            <td className="fio">{ this.props.userStore.languageList["№ заявки"] || '№ заявки' }</td>
                            <td className="phone">{ this.props.userStore.languageList["Телефон"] || 'Телефон' }</td>
                            <td className="accept-column">
                                { this.props.userStore.languageList["Принятие в ППО"] || 'Принятие в ППО' }
                            </td>
                            <td className="accept-column">
                                { this.props.userStore.languageList["Удалить"] || 'Удалить' }
                            </td>
                        </tr>
                        </thead>
                        <tbody className="list">
                        {
                            this.props.unionStore.membersList.map((member,index) => {
                                return <tr key={index}>
                                    <td className="iin">{ member.person.individual_number }</td>
                                    <td className="fio">
                                        <span>{ `${member.person.first_name} ${member.person.family_name}` }</span>
                                    </td>
                                    <td>{ member.resource_id }</td>
                                    <td className="phone">{ member.person.phone }</td>

                                    <td className="accept-column">
                                        <button className="more">
                                            <div className="btn-action">
                                                    <span className="icon">
                                                        <ProfileIcon/>
                                                    </span>
                                                <a href={`/requests/person/${member.resource_id}`}>{ this.props.userStore.languageList["Подробная информация"] || 'Подробная информация' }</a>
                                            </div>
                                        </button>
                                    </td>
                                    <td className="accept-column">
                                        <button className="reject">
                                            <div className="btn-action" onClick={this.deleteApplication} data-id={member.resource_id}>
                                                <div className="icon" data-id={member.resource_id}>
                                                    <RejectIcon data-id={member.resource_id}/>
                                                </div>
                                                <div onClick={this.deleteApplication} data-id={member.resource_id}>{ this.props.userStore.languageList["Удалить"] || 'Удалить' }</div>
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

export default inject('unionStore', 'userStore', 'permissionsStore')(observer(JoinRequestsDeclined));