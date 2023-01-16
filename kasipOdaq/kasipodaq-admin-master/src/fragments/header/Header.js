import React, {Component} from 'react';
import { withRouter } from "react-router";
import {ModalLogout} from '../modals'
import './index.scss'

import { ReactComponent as Logout } from '../../assets/icons/logout.svg';
import { ReactComponent as Logo } from '../../assets/icons/logo.svg';
import { ReactComponent as TriangleIcon } from '../../assets/icons/triangle.svg';
import CookieService from "../../services/CookieService";
import {inject, observer} from "mobx-react";
import UserProfile from "../userProfile";
import Preloader from "../preloader/Preloader";
import {NotificationContainer, NotificationManager} from "react-notifications";

class Header extends Component {
    constructor(props){
        super(props)
        this.state = {
            showLogoutModal: false,
            profileIsOpen: false,
            preloader: true,
        }

        this.logout = this.logout.bind(this)
        this.toggleProfile = this.toggleProfile.bind(this)
        this.handleLogoutClick = this.handleLogoutClick.bind(this)
        this.closeLogoutModal = this.closeLogoutModal.bind(this)
    }

    handleLogoutClick() {
        this.setState({showLogoutModal: !this.state.showLogoutModal})
    }

    closeLogoutModal() {
        this.setState({ showLogoutModal: false })
    }

    logout() {
        CookieService.remove('token-admin')
        window.location = "/";
    }

    componentDidMount() {
        this.props.userStore.profileInfo(() => {

            this.props.userStore.role == 'user' && this.props.history.push('/')

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

    toggleProfile() {
        this.setState({profileIsOpen: !this.state.profileIsOpen})
    }

    render() {
        return (
            <header>

                {
                    this.state.preloader &&
                        <Preloader/>
                }

                <NotificationContainer/>

                <div className="logo">
                    <Logo/>
                </div>
                <div className="col-right">
                    <div className="profile-link" onClick={this.toggleProfile}>
                        <React.Fragment>
                            <div className="img"
                                 style={{background: (this.props.userStore.profile.picture_uri ? `url(${this.props.userStore.profile.picture_uri}) no-repeat center center/ cover` : '')}}
                            >
                                {!this.props.userStore.profile.picture_uri &&
                                    ` ${this.props.userStore.profile.first_name[0]} ${this.props.userStore.profile.family_name[0]} `
                                }
                            </div>

                            <div className="name">{ `${this.props.userStore.profile.first_name} ${this.props.userStore.profile.family_name} ` }</div>
                            {/*<TriangleIcon/>*/}
                        </React.Fragment>
                    </div>
                    {/*<div className="langs__wrapper">*/}
                    {/*    <ul className="langs">*/}
                    {/*        <li><a href='#'>ҚАЗ</a></li>*/}
                    {/*        <li><a href='#'>РУС</a></li>*/}
                    {/*    </ul>*/}
                    {/*</div>*/}
                    <div className="logout"
                        onClick={this.handleLogoutClick}
                    >
                        <Logout/>
                    </div>
                </div>

                {
                    this.state.showLogoutModal &&
                    <ModalLogout
                        closeLogoutModal={this.closeLogoutModal}
                        logout={this.logout}
                    />
                }
                {/*{*/}
                {/*    this.state.profileIsOpen &&*/}
                {/*    <UserProfile toggleProfile={this.toggleProfile}*/}
                {/*                 profileIsOpen={this.state.profileIsOpen}*/}
                {/*                 {...this.props}*/}
                {/*    />*/}
                {/*}*/}

            </header>
        );
    }
}

export default withRouter(inject('userStore')(observer(Header)));