import React, {Component} from 'react';
import {connect} from 'react-redux';
import Search from "../../fragments/search";
import {withRouter} from 'react-router-dom'
import {Link} from 'react-router-dom'

import {ReactComponent as ProfileIcon} from '../../assets/icons/profile.svg'
import {ReactComponent as RejectIcon} from '../../assets/icons/delete.svg'
import {ReactComponent as ChekMarkIcon} from '../../assets/icons/check-mark.svg'
import {inject, observer} from "mobx-react";
import {NotificationContainer, NotificationManager} from "react-notifications";
import Preloader from "../../fragments/preloader/Preloader";

class JoinRequestsNew extends Component {

    constructor(props){
        super(props);

        this.state = {
            joinRequests: [],
            perPage: 10,
            preloadMembers: false
        };

        this.confirmApplication = this.confirmApplication.bind(this);
        this.rejectApplication = this.rejectApplication.bind(this)
    }

    componentDidMount() {
        this.props.unionStore.loadUnions( 0,data => {
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
    }

    confirmApplication(event){
        this.setState({ preloadMembers: true });

        let id = event.target.dataset.id;
        this.props.unionStore.confirmApplication(id, () => {
            this.setState({ preloadMembers: false });
            this.props.unionStore.loadUnions(0)
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
                this.setState({ preloadMembers: false });
                this.props.history.push('/')
            }
        })
    }

    rejectApplication(event){
        this.setState({ preloadMembers: true });

        let id = event.target.dataset.id;
        this.props.unionStore.rejectApplication(id, () => {
            this.setState({ preloadMembers: false });
            this.props.unionStore.loadUnions(0)
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
                this.setState({ preloadMembers: false });
                this.props.history.push('/')
            }
        })
    }

    render() {
            return (

            <div className='join-requests'>
                <div className="title-wrapper">
                    <h1>{ this.props.userStore.languageList["Заявки на вступление"] || 'Заявки на вступление' }</h1>
                </div>

                {
                    this.state.preloadMembers &&
                    <Preloader/>
                }

                <NotificationContainer/>

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
                            <td className="more"/>
                            <td className="accept-column">
                                { this.props.userStore.languageList["Принятие в ППО"] || 'Принятие в ППО' }
                            </td>
                            <td className="accept-column">
                                { this.props.userStore.languageList["Отклонить заявку"] || 'Отклонить заявку' }
                            </td>
                        </tr>
                        </thead>
                        <tbody className="list">
                        {
                            this.props.unionStore.unionsList.map((member, index) => {
                                return <tr key={index}>
                                    <td className="iin">{member.person.individual_number}</td>
                                    <td className="fio">
                                        <span>{`${member.person.first_name} ${member.person.family_name}`}</span>
                                    </td>
                                    <td className="fio">
                                        <span>{member.resource_id}</span>
                                    </td>
                                    <td className="phone">{member.person.phone}</td>
                                    <td className="more">
                                        <Link to={`/requests/person/${member.resource_id}`}>
                                            <div className='btn-action'>
                                                <div className="icon">
                                                    <ProfileIcon/>
                                                </div>
                                            </div>
                                        </Link>
                                    </td>
                                    <td className="accept-column">
                                        <button className="accept">
                                            <div className="btn-action" data-id={member.resource_id}
                                                 onClick={this.confirmApplication}>
                                                    <span className="icon" data-id={member.resource_id}>
                                                        <ChekMarkIcon/>
                                                    </span>
                                                <span data-id={member.resource_id}
                                                      onClick={this.confirmApplication}>{ this.props.userStore.languageList["Принять"] || 'Принять' }</span>
                                            </div>
                                        </button>
                                    </td>
                                    <td className="accept-column">
                                        <button className="reject" data-id={member.resource_id}>
                                            <div className="btn-action">
                                                <div className="icon">
                                                    <RejectIcon/>
                                                </div>
                                                <div data-id={member.resource_id}
                                                     onClick={this.rejectApplication}>{ this.props.userStore.languageList["Отклонить"] || 'Отклонить' }</div>
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

export default inject('unionStore', 'userStore', 'permissionsStore')(observer(JoinRequestsNew));