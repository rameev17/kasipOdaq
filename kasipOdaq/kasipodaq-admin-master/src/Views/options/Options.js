import React, {Component} from 'react'
import Layout from "../Containers/Layout";
import {ModalChangeLang, ModalLogout, ModalChangePass} from '../../fragments/modals'
import './index.scss';

import {ReactComponent as NotificationsIcon} from '../../assets/icons/preferences-notifications.svg'
import {ReactComponent as ChangeLangIcon} from '../../assets/icons/options-change-lang.svg'
import {ReactComponent as ChangePassIcon} from '../../assets/icons/options-change-pass.svg'
import {ReactComponent as HelpIcon} from '../../assets/icons/options-help.svg'
import {ReactComponent as LogOutIcon} from '../../assets/icons/options-logout.svg'
import CookieService from "../../services/CookieService";
import Modal from "react-modal";
import {inject, observer} from "mobx-react";


class Options extends Component {
    constructor(props){
        super(props)

        this.state = {
            showChangeLangModal: false,
            showLogoutModal: false,
            showChangePassModal: false,
            is_enable_notify: false,
            language: 'ru'
        }

        this.handleChangePassClick = this.handleChangePassClick.bind(this)
        this.handleLogoutClick = this.handleLogoutClick.bind(this)
        this.closeChangePassModal = this.closeChangePassModal.bind(this)
        this.closeLogoutModal = this.closeLogoutModal.bind(this)
        this.logout = this.logout.bind(this)
        this.handleLanguageSubmit = this.handleLanguageSubmit.bind(this)
        this.handleChangeLang = this.handleChangeLang.bind(this)
    }

    componentDidMount() {
        if (CookieService.get('language-admin')){
            this.setState({
                language: CookieService.get('language-admin')
            })
        }else{
            this.setState({
                language: 'ru'
            })
        }
    }

    handleChangePassClick = () => {
        this.setState({showChangePassModal: !this.state.showChangePassModal})
    }

    closeChangePassModal = () => {
        this.setState({showChangePassModal: false})
    }

    handleLangsClick = () => {
        this.setState({showChangeLangModal: !this.state.showChangeLangModal})
    }

    closeLangsModal = () => {
        this.setState({ showChangeLangModal: false })
    }

    handleLogoutClick = () => {
        this.setState({showLogoutModal: !this.state.showLogoutModal})
    }

    closeLogoutModal = () => {
        this.setState({ showLogoutModal: false });
    }

    goToSupport = () => {
        this.props.history.push('/options/support')
    }

    logout(){
        CookieService.remove('token-admin')
        CookieService.remove('language-admin')
        this.props.history.push('/')
    }

    handleChangeLang = (e) => {
        this.setState({language: e.target.value})
    }

    handleLanguageSubmit(e) {
        e.preventDefault()
        CookieService.create('language-admin', `${this.state.language}`)
        window.location.reload()
    }

    render() {
        return (
            <Layout title='Настройки'>
                <div className="options content">
                    <h1>{this.props.userStore.languageList["Настройки"] || 'Настройки'}</h1>
                    <div className="panel">
                        <ul>
                            <li className="language" onClick={this.handleLangsClick}>
                                <div className="icon">
                                    <ChangeLangIcon/>
                                </div>
                                <span>{this.props.userStore.languageList["Смена языка"] || 'Смена языка'}</span>
                            </li>
                            <li className='change-pass' onClick={this.handleChangePassClick}>
                                <div className="icon">
                                    <ChangePassIcon/>
                                </div>
                                <span>{this.props.userStore.languageList["Смена пароля"] || 'Смена пароля'}</span>
                            </li>
                            {/*<li className="support" onClick={this.goToSupport}>*/}
                            {/*    <div className="icon">*/}
                            {/*        <HelpIcon/>*/}
                            {/*    </div>*/}
                            {/*    <span>{this.props.userStore.languageList["Техническая служба поддержки"] || 'Техническая служба поддержки'}</span>*/}
                            {/*</li>*/}
                            <li className='logout' onClick={this.handleLogoutClick}>
                                <div className="icon">
                                    <LogOutIcon/>
                                </div>
                                <span>{this.props.userStore.languageList["Выйти"] || 'Выйти'}</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {
                    this.state.showChangeLangModal &&
                    <Modal
                        isOpen={true}
                        onRequestClose={this.props.closeLangsModal}
                        className="Modal"
                        overlayClassName="Overlay"
                    >
                        <div className='modal__wrapper change-lang__wrapper'>
                            <form className='change-language' onSubmit={this.handleLanguageSubmit}>
                                <label className='lang lang-kz'>
                            <span className="icon">

                            </span>
                                    <span className="lang-name">
                                    Казахский язык
                                </span>
                                    <input onChange={this.handleChangeLang}
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
                                    <input onChange={this.handleChangeLang}
                                           checked={this.state.language === 'ru'}
                                           type="radio"
                                           name="lang"
                                           value='ru'
                                           id='ru'/>
                                    <span className="radio"/>
                                </label>
                                <div className="btns">
                                    <button className="btn" type='submit'>{this.props.userStore.languageList["Применить"] || 'Применить'}</button>
                                    <div className='btn' onClick={this.closeLangsModal}>{this.props.userStore.languageList["Отмена"] || 'Отмена'}</div>
                                </div>
                            </form>
                        </div>
                    </Modal>
                }

                {
                    this.state.showChangePassModal &&
                    <ModalChangePass
                        closeChangePassModal={this.closeChangePassModal}
                    />

                }

                {
                    this.state.showLogoutModal &&
                    <ModalLogout
                        closeLogoutModal={this.closeLogoutModal}
                        logout={this.logout}
                    />

                }

            </Layout>
        );
    }
}


export default inject('userStore')(observer(Options));