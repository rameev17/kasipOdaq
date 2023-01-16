import React, {Component} from 'react'
import { Link } from "react-router-dom";
import Layout from "../../fragments/layout/Layout";

import { ModalChangeLang } from '../../fragments/modals/Modal';
import { ModalLogout } from '../../fragments/modals/Modal';
import { ModalChangePass } from '../../fragments/modals/Modal';
import './style.scss';

import {ReactComponent as NotificationsIcon} from '../../assets/icons/preferences-notifications.svg';
import {ReactComponent as ChangeLangIcon} from '../../assets/icons/preferences-change-lang.svg';
import {ReactComponent as ChangePassIcon} from '../../assets/icons/preferences-change-pass.svg';
import {ReactComponent as HelpIcon} from '../../assets/icons/preferences-help.svg';
import {ReactComponent as LogOutIcon} from '../../assets/icons/preferences-logout.svg';
import CookieService from "../../services/CookieService";
import notificationStore from "../../stores/NotificationStore";

import {NotificationContainer, NotificationManager} from 'react-notifications';
import {inject, observer} from "mobx-react";
import Modal from "react-modal";

class Preferences extends Component {

    constructor(props) {
        super(props);

        this.state = {
            modalIsOpen: false,
            modalRestorePass: false,
            modalChangeLanguage: false,
            LogoutModalIsOpen: false,
            is_enable_notify: false,
            language: '',
        }

        this.closeModal = this.closeModal.bind(this)
        this.notifyChange = this.notifyChange.bind(this)
        this.handleChangeLang = this.handleChangeLang.bind(this)
        this.handleLanguageSubmit = this.handleLanguageSubmit.bind(this)
    }

    componentDidMount() {
        this.props.notificationStore.loadNotificationList(1)
        this.props.userStore.profileInfo(data => {
            this.setState({
                is_enable_notify: data.setting.enable_notice
            })
        }, response => {
            if (Array.isArray(response.data)) {
                response.data.forEach(error => {
                    this.setState({preloader: false})
                    NotificationManager.error(error.message)
                })
            } else {
                NotificationManager.error(response.data.message)
                this.setState({preloader: false})
            }
            if (response.status == 401){
                CookieService.remove('token')
                this.setState({ preloader: false })
                this.props.history.push('/auth')
            }
        })

        if (CookieService.get('language')){
            this.setState({
                language: CookieService.get('language')
            })
        }else{
            this.setState({
                language: 'ru'
            })
        }
    }

    notifyChange(){
        this.setState({ is_enable_notify: !this.state.is_enable_notify }, () => {
            this.props.notificationStore.notificationToggle(
                this.props.userStore.profile.setting.resource_id,
                this.state.is_enable_notify,
                data => {
                    if (this.state.is_enable_notify){
                        NotificationManager.success("Звук уведомлений включен!")
                    }else{
                        NotificationManager.success("Звук уведомлений выключен!")
                    }

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
                        CookieService.remove('token')
                        this.setState({ preloader: false })
                        this.props.history.push('/auth')
                    }
                })
        })
    }

    handleChangeLang = (e) => {
        this.setState({language: e.target.value})
    }

    handleLanguageSubmit(e) {
        e.preventDefault()
        CookieService.create('language', `${this.state.language}`)
        window.location.reload()
    }

    closeModal() {
        this.setState({
            modalIsOpen: false,
            LogoutModalIsOpen: false,
            modalRestorePass:false,
            modalChangeLanguage: false
        })
    }

    render() {

        return (
            <Layout title='Настройки'>

                <NotificationContainer/>

                <div className="plate-wrapper plate-wrapper__height">
                    <div className="preferences">
                        <ul>
                            {
                                CookieService.get('token') &&
                                <li className='notifications'>
                                    <label>
                                        <div className="icon">
                                            <NotificationsIcon/>
                                        </div>
                                        <span>{this.props.userStore.languageList["Уведомления"] || 'Уведомления'}</span>
                                        <input type="checkbox"
                                               checked={this.state.is_enable_notify == 1}
                                               onChange={this.notifyChange}
                                               name="notifications"/>
                                        <div className="checkbox"></div>
                                    </label>
                                </li>
                            }
                            <li className="language" onClick={() => this.setState({ modalChangeLanguage: true })}>
                                <div className="icon">
                                    <ChangeLangIcon/>
                                </div>
                                <span>{this.props.userStore.languageList["Смена языка"] || 'Смена языка'}</span>
                            </li>
                            {
                                CookieService.get('token') &&
                                <li className='change-pass' onClick={() => this.setState({ modalRestorePass: true }) }>
                                    <div className="icon">
                                        <ChangePassIcon/>
                                    </div>
                                    <span>{this.props.userStore.languageList["Смена пароля"] || 'Смена пароля'}</span>
                                </li>
                            }
                            {
                                CookieService.get('token') &&
                                <Link to={'/preferences/support'} className="support" style={{ width: "100%", display: 'flex', alignItems: 'center' }}>
                                    <div className="icon" style={{ marginRight: 17 }}>
                                        <HelpIcon/>
                                    </div>
                                    <span>{this.props.userStore.languageList['Техническая служба поддержки'] || 'Техническая служба поддержки' } </span>
                                </Link>
                            }
                            {
                                CookieService.get('token') &&
                                <li className='logout' onClick={() => { this.setState({ LogoutModalIsOpen: true }) }}>
                                    <div className="icon">
                                        <LogOutIcon/>
                                    </div>
                                    <span>{this.props.userStore.languageList["Выйти"] || 'Выйти'}</span>
                                </li>
                            }
                        </ul>
                    </div>
                </div>
                {
                    this.state.modalIsOpen &&
                    <ModalChangeLang
                        changeLanguage={this.changeLanguage}
                        language={this.state.language}
                        closeModal={this.closeModal}
                    />
                }
                {
                    this.state.LogoutModalIsOpen &&
                    <ModalLogout
                        closeModal={this.closeModal}
                        {...this.props}
                    />
                }
                {
                    this.state.modalRestorePass &&
                    <ModalChangePass
                        closeModal={this.closeModal}
                    />
                }

                {
                    this.state.modalChangeLanguage &&
                    <Modal
                        isOpen={true}
                        onRequestClose={this.props.closeModal}
                        className="Modal"
                        overlayClassName="Overlay"
                    >
                        <div className="modal__wrapper change-lang__wrapper">
                            <form className='change-language' onSubmit={this.handleLanguageSubmit}>
                                <label className='lang lang-kz'>
                            <span className="icon">

                            </span>
                                    <span className="lang-name">
                                    Қазақ тілі
                                </span>
                                    <input
                                        onChange={this.handleChangeLang}
                                        checked={this.state.language === 'kk'}
                                        type="radio"
                                        name="lang"
                                        value='kk'
                                        id='kk'/>
                                    <span className="radio"/>
                                </label>
                                <label className='lang lang-ru'>
                            <span className="icon">

                            </span>
                                    <span className="lang-name">
                                    Русский язык
                                </span>
                                    <input
                                        onChange={this.handleChangeLang}
                                        checked={this.state.language === 'ru'}
                                        type="radio"
                                        name="lang"
                                        value='ru'
                                        id='ru'/>
                                    <span className="radio"/>
                                </label>
                                <div className="btns">
                                    <button className="btn" type='submit'>{this.props.userStore.languageList["Применить"] || 'Применить'}</button>
                                    <div className='btn' style={{ cursor: 'pointer' }} onClick={this.closeModal}>{this.props.userStore.languageList["Отмена"] || 'Отмена'}</div>
                                </div>
                            </form>
                        </div>
                    </Modal>
                }

            </Layout>
        )
    }
}

export default inject('userStore', 'permissionsStore', 'notificationStore')(observer(Preferences));