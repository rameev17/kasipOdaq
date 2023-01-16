import React, {Component} from 'react'
import { Link, Route } from 'react-router-dom'
import './index.scss'
import {withRouter} from 'react-router-dom';
import {ReactComponent as NewsIcon} from '../../assets/icons/news.svg'
import {ReactComponent as HelpIcon} from '../../assets/icons/help.svg'
import {ReactComponent as PartnersIcon} from '../../assets/icons/partners.svg'
import {ReactComponent as UnionIcon} from '../../assets/icons/union.svg'
import {ReactComponent as BellDesktopIcon} from '../../assets/icons/belldesktopicon.svg'
import {inject, observer} from "mobx-react";
import {ReactComponent as DisputeIcon} from "../../assets/icons/menu-dispute.svg";
import {ModalAccessDenied} from "../modals";
import CookieService from "../../services/CookieService";

class DesktopTopBar extends Component{

    constructor(props) {
        super(props);

        this.state = {
            location: '',
            notifications: false,
            accessDenied: false,
        }

        this.closeModal = this.closeModal.bind(this)
        this.checkAccess = this.checkAccess.bind(this)
    }

    componentDidMount() {
        this.setState({location: this.props.location.pathname})
    }

    closeModal() {
        this.setState({accessDenied: false})
    }

    checkAccess(e) {
        e.preventDefault()
        this.setState({accessDenied: true})
    }

    render(){

        return(
            <React.Fragment>
                <div className="desktop-top-bar">
                    <div className="left-info">
                        <div className={ ('title') + (this.state.location == '/biot' ?('') : (' text-uppercase') ) }>
                            {this.props.userStore.languageList[this.props.title] || this.props.title}
                        </div>
                    </div>

                    <div className="nav-buttons">
                        <ul>
                            {
                                this.props.permissionsStore.hasPermission('news', 'get_list') &&
                                <li className={'link' + (this.state.location == '/news' ? (' is-active') : (''))}>
                                    <Link to='/news'>
                                        <NewsIcon/>
                                        {/*<span>{ this.state.languageNews }</span>*/}
                                        <span>{this.props.userStore.languageList["Новости"] || 'Новости'}</span>
                                    </Link>
                                </li>
                            }

                            <li className={'link' + (this.state.location == '/help' ? (' is-active') : ('')) }>
                                <Link onClick={this.props.permissionsStore.hasPermission('appeal', 'get_list') ? () => { this.props.history.push('/help') } : this.checkAccess} >
                                    <HelpIcon/>
                                    <span style={{ textAlign: 'center' }}>{this.props.userStore.languageList["Помощь"] || 'Помощь'}</span>
                                </Link>
                            </li>

                            <li className={'link' + (this.state.location == '/partners' ? (' is-active') : ('')) }>
                                <Link to={'/partners'} >
                                    <PartnersIcon/>
                                    <span>{this.props.userStore.languageList["Партнеры"] || 'Партнеры'}</span>
                                </Link>
                            </li>

                            <li className={'link' + (this.state.location == '/my-union' ? (' is-active') : ('')) }>
                                <Link onClick={this.props.permissionsStore.hasPermission('union', 'get_by_person_id') ? () => { this.props.history.push('/my-union') } : this.checkAccess} >
                                    <UnionIcon/>
                                    <span>{this.props.userStore.languageList["Профсоюз"] || 'Профсоюз'}</span>
                                </Link>
                            </li>

                            <li className={'link' + (this.state.location == '/notifications' ? (' is-active') : (''))}>
                                <Link to='/notifications'>
                                    <BellDesktopIcon />
                                    <span>{this.props.userStore.languageList["Уведомления"] || 'Уведомления'}</span>
                                </Link>
                            </li>

                        </ul>
                    </div>
                </div>

                {
                    this.state.accessDenied &&
                    <ModalAccessDenied
                        closeModal={this.closeModal}
                    />
                }

            </React.Fragment>
        )
    }
}

export default withRouter(inject('permissionsStore', 'userStore')(observer(DesktopTopBar)));