import React, {Component} from 'react'
import {Link, Route} from 'react-router-dom'
import './index.scss'
import {withRouter} from 'react-router-dom';

import {ReactComponent as NewsIcon} from '../../assets/icons/news.svg'
import {ReactComponent as HelpIcon} from '../../assets/icons/help.svg'
import {ReactComponent as PartnersIcon} from '../../assets/icons/partners.svg'
import {ReactComponent as UnionIcon} from '../../assets/icons/union.svg'
import {ReactComponent as BurgerIcon} from '../../assets/icons/burger.svg'
import {inject, observer} from "mobx-react";
import {ModalAccessDenied} from "../modals";
import {ReactComponent as BellDesktopIcon} from "../../assets/icons/belldesktopicon.svg";

class BottomBar extends Component {

    constructor(props) {
        super(props);

        this.state = {
            location: '',
            notifications: false,
            accessDenied: false
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

        this.props.toggleMenu({})
        this.setState({accessDenied: true})
    }


    render() {

        return (
            <React.Fragment>
                <div className="bottom-bar">
                    <ul>
                        {
                            this.props.permissionsStore.hasPermission('news', 'get_list') &&
                            <li className={'link' + (this.state.location == '/news' ? (' is-active') : (''))}>
                                <Link to='/news'>
                                    <NewsIcon/>
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
                        <li>
                            <Link onClick={(e) => this.props.toggleMenu(e)}>
                                <BurgerIcon/>
                                <span>
                                    {this.props.userStore.languageList["Меню"] || 'Меню'}
                                </span>
                            </Link>
                        </li>
                    </ul>
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

export default withRouter(inject('userStore', 'permissionsStore')(observer(BottomBar)));