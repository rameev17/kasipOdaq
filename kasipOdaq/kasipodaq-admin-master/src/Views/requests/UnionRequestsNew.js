import React, {Component} from 'react';
import {connect} from 'react-redux'
import Search from "../../fragments/search";
import {ReactComponent as ChekMarkIcon} from "../../assets/icons/check-mark.svg";
import {ReactComponent as RejectIcon} from "../../assets/icons/delete.svg";
import {Link} from "react-router-dom";
import {ReactComponent as ProfileIcon} from "../../assets/icons/profile.svg";
import {inject, observer} from "mobx-react";
import Preloader from "../../fragments/preloader/Preloader";
import {NotificationContainer, NotificationManager} from "react-notifications";

class UnionRequestsNew extends Component {

    constructor(props){
        super(props);

        this.state = {
            unionRequests: [],
            perPage: 10,
            preloadUnions: false,
            preloadMembers: false,
        };

        this.confirmApplication = this.confirmApplication.bind(this);
        this.rejectApplication = this.rejectApplication.bind(this)

    }


    componentDidMount() {
        this.setState({
            preloadUnions: true
        }, () => {
            this.props.unionStore.loadUnions( 100,data => {
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
        });

        this.setState({
            preloadMembers: true
        }, () => {
            this.props.unionStore.loadMembers( 0,data => {
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
                    this.setState({ preloadUnions: false });
                    this.props.history.push('/')
                }
            })
        })
    }

    confirmApplication(event){
        this.setState({ preloadUnions: true });

        let id = event.target.dataset.id;
        this.props.unionStore.confirmApplication(id, () => {
            this.setState({ preloadUnions: false });
            this.props.unionStore.loadUnions(100, () => {

            },response => {
                if (Array.isArray(response.data)) {
                    response.data.forEach(error => {
                        this.setState({ preloader: false });
                        NotificationManager.error(error.message)
                    })
                } else {
                    this.setState({ preloader: false });
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

    rejectApplication(event){
        this.setState({ preloadUnions: true });

        let id = event.target.dataset.id;
        this.props.unionStore.rejectApplication(id, () => {
            this.setState({ preloadUnions: false });
            this.props.unionStore.loadUnions(100, () => {

            },response => {
                if (Array.isArray(response.data)) {
                    response.data.forEach(error => {
                        this.setState({ preloader: false });
                        NotificationManager.error(error.message)
                    })
                } else {
                    this.setState({ preloader: false });
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

                    {
                        this.state.preloadUnions &&
                        <Preloader/>
                    }

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
                            searchCallback={this.searchRequest}
                            showSearchString={false}/>
                    <div className="requests-list">
                        <table>
                            <thead className="heading">
                            <tr>
                                <td className="company">{ this.props.userStore.languageList["Название компании"] || 'Название компании' }</td>
                                <td className="fio">{ this.props.userStore.languageList["ФИО"] || 'ФИО' }</td>
                                <td className="fio">{ this.props.userStore.languageList["№ заявки"] || '№ заявки' }</td>
                                <td className="phone">{ this.props.userStore.languageList["Телефон"] || 'Телефон' }</td>
                                <td className="more"/>
                                <td className="accept-column">
                                    { this.props.userStore.languageList["Одобрить заявку"] || 'Одобрить заявку' }
                                </td>
                                <td className="accept-column">
                                    { this.props.userStore.languageList["Отклонить заявку"] || 'Отклонить заявку' }
                                </td>
                            </tr>
                            </thead>
                            <tbody className="list">
                            {
                                this.props.unionStore.unionsList.map((union, index) => {
                                    return <tr key={index}>
                                        <td className="company">{ union.union_name }</td>
                                        <td className="fio">
                                            <span>{ `${union.person.first_name} ${union.person.family_name}` }</span>
                                        </td>
                                        <td className="phone">{ union.resource_id }</td>
                                        <td className="phone">{ union.person.phone }</td>
                                        <td className="more">
                                            <Link to={`/requests/person/${union.resource_id}`}>
                                                <div className='btn-action'>
                                                    <div className="icon">
                                                        <ProfileIcon/>
                                                    </div>
                                                </div>
                                            </Link>
                                        </td>
                                        <td className="accept-column">
                                            <button className="accept">
                                                <div className="btn-action">
                                                    <span className="icon">
                                                        <ChekMarkIcon/>
                                                    </span>
                                                    <span  data-id={union.resource_id}
                                                           onClick={this.confirmApplication}>{ this.props.userStore.languageList["Принять"] || 'Принять' }</span>
                                                </div>
                                            </button>
                                        </td>
                                        <td className="accept-column">
                                            <button className="reject">
                                                <div className="btn-action">
                                                    <div className="icon">
                                                        <RejectIcon/>
                                                    </div>
                                                    <div data-id={union.resource_id}
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
            </div>
        );
    }
}

export default inject('unionStore', 'userStore', 'permissionsStore')(observer(UnionRequestsNew));