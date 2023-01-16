import React, {Component} from 'react';
import { Link, withRouter } from 'react-router-dom'
import './index.scss'
import {connect} from "react-redux";

import { ReactComponent as UnionIcon } from '../../assets/icons/sidebar-union.svg';
import { ReactComponent as RequestsIcon } from '../../assets/icons/sidebar-requests.svg';
import { ReactComponent as NewsIcon } from '../../assets/icons/sidebar-news.svg';
import { ReactComponent as BiotIcon } from '../../assets/icons/sidebar-biot.svg';
import { ReactComponent as DisputeIcon } from '../../assets/icons/sidebar-dispute.svg';
import { ReactComponent as TribuneIcon } from '../../assets/icons/tribune.svg';
import { ReactComponent as OptionsIcon } from '../../assets/icons/sidebar-options.svg';
import { ReactComponent as HelpIcon } from '../../assets/icons/sidebar-help.svg';
import { ReactComponent as SupportIcon } from '../../assets/icons/options-help.svg';
import { ReactComponent as PartnersIcon } from '../../assets/icons/sidebar-partners.svg';
import { ReactComponent as AboutIcon } from '../../assets/icons/sidebar-about-federation.svg';
import { ReactComponent as AboutProjectIcon } from '../../assets/icons/sidebar-about-project.svg';
import {ReactComponent as LegalDatabaseIcon} from '../../assets/icons/menu-law-database.svg';
import { ReactComponent as ContactsIcon } from '../../assets/icons/sidebar-contacts.svg';
import {ReactComponent as AppealIcon} from '../../assets/icons/appeal.svg';
import {inject, observer} from "mobx-react";


class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            location: ''
        }

    }

    componentDidMount() {
        this.setState({
            location:  this.props.location.pathname
        })
    }

    render() {

        return (
            <div className='sidebar'>
                <Profile profile={this.props.profile}/>
                <ul className="main-menu">
                    {
                        this.props.userStore.role !== 'tech_support' &&
                        this.props.permissionsStore.hasPermission('union', 'get_list') &&
                        <li className={(this.state.location.indexOf('/union') !== -1 ? ('is-active') : (''))}>
                            <Link to='/union'>
                                <div className="icon">
                                    <UnionIcon/>
                                </div>
                                <span>
                                    { this.props.userStore.role == 'company' ?
                                        this.props.userStore.languageList["Профсоюз"] || 'Профсоюз'
                                        :
                                        this.props.userStore.languageList["Профсоюзы"] || 'Профсоюзы'
                                    }
                                </span>
                            </Link>
                        </li>
                    }
                    {
                        this.props.userStore.role !== 'fprk' &&
                        this.props.userStore.role !== 'association' &&
                        this.props.userStore.role !== 'tech_support' &&
                        <li className={(this.state.location.indexOf('requests') !== -1 ? ('is-active') : (''))}>
                            <a href='/requests'>
                                <div className="icon">
                                    <RequestsIcon/>
                                </div>

                                {
                                    this.props.userStore.role == 'industry' &&
                                    <span>{this.props.userStore.languageList["Заявки ППО"] || 'Заявки ППО'}</span>
                                }

                                {
                                    this.props.userStore.role == 'company' &&
                                    <span>{this.props.userStore.languageList["Заявки на вступление"] || 'Заявки на вступление'}</span>
                                }

                                {
                                    this.props.userStore.role == 'branch' &&
                                    <span>{this.props.userStore.languageList["Заявки профсоюзов"] || 'Заявки профсоюзов'}</span>
                                }

                                {/*<div className="counter">1</div>*/}

                            </a>
                        </li>
                    }
                    {
                        this.props.userStore.kind == 'union' &&
                        this.props.userStore.role !== 'tech_support' &&
                        <li className={(this.state.location.indexOf('create') !== -1 ? ('is-active') : (''))}>
                            <a href='/create'>
                                <div className="icon">
                                    <RequestsIcon/>
                                </div>
                                <span>{this.props.userStore.languageList["Заявки на создание"] || 'Заявки на создание'}</span>

                                {/*<div className="counter">1</div>*/}

                            </a>
                        </li>
                    }
                    {
                        this.props.userStore.role !== 'tech_support' &&
                        this.props.permissionsStore.hasPermission('news', 'get_list') &&
                        <li className={(this.state.location.indexOf('/news') !== -1 ? ('is-active') : (''))}>
                            <Link to='/news'>
                                <div className="icon">
                                    <NewsIcon/>
                                </div>
                                <span>{
                                    this.props.userStore.role == 'company' ?
                                        this.props.userStore.languageList["События"] || 'События'
                                        :
                                        this.props.userStore.languageList["Новости"] || 'Новости'
                                    }
                                </span>
                            </Link>
                        </li>
                    }
                    {/*{*/}
                    {/*    this.props.userStore.role == 'fprk' &&*/}
                    {/*    */}
                    {/*}*/}

                    {
                        this.props.userStore.role !== 'tech_support' &&
                        <li className={(this.state.location.indexOf('/appeal') !== -1 ? ('is-active') : (''))}>
                            <Link to='/appeal'>
                                <div className="icon">
                                    <AppealIcon/>
                                </div>
                                <span>{this.props.userStore.languageList["Обращения"] || 'Обращения'}</span>
                            </Link>
                        </li>
                    }

                    {
                        this.props.userStore.role !== 'tech_support' &&
                        <li className={(this.state.location.indexOf('/biot') !== -1 ? ('is-active') : (''))}>
                            <Link to='/biot'>
                                <div className="icon">
                                    <BiotIcon/>
                                </div>
                                <span>{this.props.userStore.languageList["БиОТ"] || 'БиОТ'}</span>
                            </Link>
                        </li>
                    }

                    {
                        this.props.userStore.role !== 'tech_support' &&
                        this.props.permissionsStore.hasPermission('dispute', 'create') &&
                        <li className={(this.state.location.indexOf('/dispute') !== -1 ? ('is-active') : (''))}>
                            <Link to='/dispute'>
                                <div className="icon">
                                    <DisputeIcon/>
                                </div>
                                <span>{this.props.userStore.languageList["Трудовой спор"] || 'Трудовой спор'}</span>
                            </Link>
                        </li>
                    }
                    {
                        this.props.userStore.role !== 'tech_support' &&
                        <li className={(this.state.location.indexOf('/tribune') !== -1 ? ('is-active') : (''))}>
                            <Link to='/tribune'>
                                <div className="icon">
                                    <TribuneIcon/>
                                </div>
                                <span>{this.props.userStore.languageList["Трибуна"] || 'Трибуна'}</span>
                            </Link>
                        </li>
                    }

                    {
                        this.props.userStore.role == 'fprk' &&
                        this.props.userStore.role !== 'tech_support' &&
                        <li className={(this.state.location.indexOf('/legals') !== -1 ? ('is-active') : (''))}>
                            <Link to='/legals'>
                                <div className="icon">
                                    <LegalDatabaseIcon/>
                                </div>
                                <span>{this.props.userStore.languageList["Законодательная база"] || 'Законодательная база'}</span>
                            </Link>
                        </li>
                    }

                    <React.Fragment>
                        {
                            this.props.userStore.role == 'fprk' &&
                            this.props.userStore.role !== 'tech_support' &&
                            <li className={((this.state.location.indexOf('/about') !== -1 &&
                                (this.state.location.indexOf('/about-project') === -1)) ? ('is-active') : (''))}>
                                <Link to='/about'>
                                    <div className="icon">
                                        <AboutIcon/>
                                    </div>
                                    <span>{this.props.userStore.languageList["О Федерации"] || 'О Федерации'}</span>
                                </Link>
                            </li>
                        }
                        {
                            this.props.userStore.role == 'fprk' &&
                                this.props.userStore.role !== 'tech_support' &&
                            <li className={(this.state.location.indexOf('/law-requests') !== -1 ? ('is-active') : (''))}>
                                <Link to='/law-requests'>
                                    <div className="icon">
                                        <HelpIcon/>
                                    </div>
                                    <span>{this.props.userStore.languageList["Юр. помощь"] || 'Юр. помощь'}</span>
                                    {this.props.lawRequestsHeaders &&
                                    <div className="counter">{this.props.lawRequestsHeaders['x-pagination-total-count']}</div>
                                    }
                                </Link>
                            </li>
                        }
                        {
                            this.props.userStore.role == 'tech_support' &&
                            <li className={(this.state.location.indexOf('/support') !== -1 ? ('is-active') : (''))}>
                                <Link to='/support'>
                                    <div className="icon">
                                        <SupportIcon/>
                                    </div>
                                    <span>{this.props.userStore.languageList["Тех. поддержка"] || 'Тех. поддержка'}</span>
                                    {this.props.lawRequestsHeaders &&
                                    <div className="counter">{this.props.lawRequestsHeaders['x-pagination-total-count']}</div>
                                    }
                                </Link>
                            </li>
                        }
                        {
                            this.props.userStore.role == 'fprk' &&
                            this.props.userStore.role !== 'tech_support' &&
                            <li className={(this.state.location.indexOf('/partners') !== -1 ? ('is-active') : (''))}>
                                <Link to='/partners'>
                                    <div className="icon">
                                        <PartnersIcon/>
                                    </div>
                                    <span>{this.props.userStore.languageList["Партнеры"] || 'Партнеры'}</span>
                                </Link>
                            </li>
                        }

                    </React.Fragment>
                    {
                        this.props.permissionsStore.hasPermission('article', 'get_by_union_id') &&
                        <li className={(this.state.location.indexOf('/options') !== -1 ? ('is-active') : (''))}>
                            <Link to='/options'>
                                <div className="icon">
                                    <OptionsIcon/>
                                </div>
                                <span>{this.props.userStore.languageList["Настройки"] || 'Настройки'}</span>
                            </Link>
                        </li>
                    }

                    <React.Fragment>
                        {/*<li className={(this.state.location.indexOf('/about-project') !== -1 ? ('is-active') : (''))}>*/}
                        {/*    <Link to='/about-project'>*/}
                        {/*        <div className="icon">*/}
                        {/*            <AboutProjectIcon/>*/}
                        {/*        </div>*/}
                        {/*        <span>О проекте</span>*/}
                        {/*    </Link>*/}
                        {/*</li>*/}
                        {
                            this.props.userStore.role == 'fprk' &&
                            this.props.userStore.role !== 'tech_support' &&
                            <li className={(this.state.location.indexOf('/contacts') !== -1 ? ('is-active') : (''))}>
                                <Link to='/contacts'>
                                    <div className="icon">
                                        <ContactsIcon/>
                                    </div>
                                    <span>{this.props.userStore.languageList["Контакты"] || 'Контакты'}</span>
                                </Link>
                            </li>
                        }

                    </React.Fragment>
                </ul>
            </div>
        );
    }
}

class Profile extends Component {

    state = {
        image: null,
        fullName: '',
        role: '',
        email: ''
    }

    render() {
        return (
            <div className='profile'>
                {this.props.profile &&
                <div className="container">
                    <div className="abbr avatar"
                         style={{background: (this.state.logoUrl ? `url(${this.state.logoUrl}) no-repeat center center/ cover` : '')}}
                    >
                        {!this.state.logoUrl && this.state.initial}
                    </div>
                    <div className="role">{this.state.role}</div>
                    <div className="name">{this.state.fullName}</div>
                    <div className="email">{this.state.email}</div>
                </div>
                }
            </div>
        );
    }
}

export default withRouter(inject('permissionsStore', 'userStore', 'unionStore')(observer(Sidebar)));