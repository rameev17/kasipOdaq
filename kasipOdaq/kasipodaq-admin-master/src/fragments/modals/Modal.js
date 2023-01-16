import React, {Component} from 'react'
import Modal from 'react-modal';
import './index.scss'
import {NotificationContainer, NotificationManager} from "react-notifications";
import {inject, observer} from "mobx-react";
import CookieService from "../../services/CookieService";

import {ReactComponent as LockIcon} from '../../assets/icons/lock.svg'
import {ReactComponent as LogoIcon} from "../../assets/icons/logo.svg";
import {ReactComponent as ShowPassIcon} from "../../assets/icons/show-pass.svg";
import {ReactComponent as HidePassIcon} from "../../assets/icons/hide-pass.svg";


class ModalChangeLang extends Component {

    state = {
        language: ''
    };


    handleChangeLang = (e) => {
        this.setState({language: e.target.value})
    };

    handleSubmit = (e) => {
        e.preventDefault();

        CookieService.create('language-admin', this.state.language)
    };

    render() {

        return (
            <Modal
                isOpen={true}
                onRequestClose={this.props.closeLangsModal}
                className="Modal"
                overlayClassName="Overlay"
            >
                <div className='modal__wrapper change-lang__wrapper'>
                    <form className='change-language' onSubmit={this.handleSubmit}>
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
                            <input className="btn" type='submit' value='Применить' />
                            <div className='btn' onClick={this.props.closeLangsModal}>Отмена</div>
                        </div>
                    </form>
                </div>
            </Modal>
        )
    }
}

const ModalLogout = inject('userStore')(observer(class ModalLogout extends Component {

    componentWillMount() {
        Modal.setAppElement('body');
    }

    render() {
        return(
            <Modal
                   isOpen={true}
                   onRequestClose={this.props.closeLogoutModal}
                   className="Modal"
                   overlayClassName="Overlay"
            >
                <div className="modal__wrapper logout__wrapper">
                    <div className="modal__text">
                        { this.props.userStore.languageList['Вы действительно хотите выйти?'] || 'Вы действительно хотите выйти?' }
                    </div>
                    <div className="modal__btns">
                        <div className="modal__btn" onClick={this.props.closeLogoutModal}>
                            { this.props.userStore.languageList['Отмена'] || 'Отмена' }
                        </div>
                        <div className="modal__btn" onClick={this.props.logout}>
                            { this.props.userStore.languageList['Выйти'] || 'Выйти' }
                        </div>
                    </div>
                </div>
            </Modal>
        )
    }
}));

class ModalDeleteNews extends Component {

    componentWillMount() {
        Modal.setAppElement('body');
    }

    render() {
        return(
            <Modal
                isOpen={true}
                onRequestClose={this.props.closeModal}
                className="Modal"
                overlayClassName="Overlay"
            >
                <div className="modal__wrapper logout__wrapper">
                    <div className="modal__text">
                        Вы действительно хотите удалить новость?
                    </div>
                    <div className="modal__btns">
                        <div className="modal__btn" onClick={this.props.closeModal}>
                            Отмена
                        </div>
                        <div className="modal__btn" onClick={this.props.deleteNews}>
                            Удалить
                        </div>
                    </div>
                </div>
            </Modal>
        )
    }
}

const ModalChangePass = inject('userStore')(observer(class ModalChangePass extends Component{

    constructor(props) {
        super(props);

        this.state = {
            showNewPass: false,
            showConfirmPass: false,
            showOldPass: false
        };

        this.oldPassword = React.createRef();
        this.newPassword = React.createRef();
        this.newPasswordRepeat = React.createRef();

        this.changePassword = this.changePassword.bind(this)

    }

    toggleNewPass = () => {
        this.setState({showNewPass: !this.state.showNewPass})
    };

    toggleConfirmPass = () => {
        this.setState({showConfirmPass: !this.state.showConfirmPass})
    };

    toggleOldPass = () => {
        this.setState({showOldPass: !this.state.showOldPass})
    };

    changePassword(e){
        e.preventDefault();

        if (this.newPassword.current.value !== this.newPasswordRepeat.current.value){
            NotificationManager.error('Ваши пароли не совпадают')
        }else{
            this.setState({ preloader: true });
            this.props.userStore.changePassword(
                this.oldPassword.current.value,
                this.newPassword.current.value,
                () => {
                    NotificationManager.success('Ваш пароль успешно изменен');
                    this.setState({ preloader: false });
                    setTimeout(() => {
                        this.props.closeModal()
                    }, 1000)

                }, response => {
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
                        CookieService.remove('token-admin');
                        this.setState({ preloader: false });
                        this.props.history.push('/auth')
                    }
                }

            )
        }

    }

    render(){
        return(
            <Modal
                isOpen={true}
                onRequestClose={this.props.closeChangePassModal}
                className="Modal"
                overlayClassName="Overlay"
            >
                <NotificationContainer/>
                <div className='modal__wrapper change-pass__wrapper'>
                    <form className="form" onSubmit={this.changePassword}>
                        <div className="logo-wrapper">
                            <LogoIcon/>
                        </div>
                        <label>
                            <p className="label">Старый пароль</p>
                            <div className="wrapper">
                                <div className="icon">
                                    <LockIcon/>
                                </div>
                                <input name='oldPass'
                                       ref={this.oldPassword}
                                       type={(this.state.showOldPass ? 'text' : 'password')}
                                       placeholder='Введите пароль'
                                       className="password"
                                       required
                                />
                                <div className='show' onClick={this.toggleOldPass}>
                                    {  this.state.showOldPass && <ShowPassIcon/> }
                                    { !this.state.showOldPass && <HidePassIcon/> }
                                </div>
                            </div>
                        </label>
                        <label>
                            <p className="label">Новый пароль</p>
                            <div className="wrapper">
                                <div className="icon">
                                    <LockIcon/>
                                </div>
                                <input name='pass'
                                       ref={this.newPassword}
                                       type={(this.state.showNewPass ? 'text' : 'password')}
                                       placeholder='Введите пароль'
                                       className="password"
                                       required
                                />
                                <div className='show' onClick={this.toggleNewPass}>
                                    {  this.state.showNewPass && <ShowPassIcon/> }
                                    { !this.state.showNewPass && <HidePassIcon/> }
                                </div>
                            </div>
                        </label>
                        <label>
                            <p className="label">Подтвердите пароль</p>
                            <div className="wrapper">
                                <div className="icon">
                                    <LockIcon/>
                                </div>
                                <input name='confirmPass'
                                       ref={this.newPasswordRepeat}
                                       type={(this.state.showConfirmPass ? 'text' : 'password')}
                                       placeholder='Введите пароль'
                                       className="password"
                                       required
                                />
                                <div className='show' onClick={this.toggleConfirmPass}>
                                    { this.state.showConfirmPass && <ShowPassIcon/> }
                                    { !this.state.showConfirmPass && <HidePassIcon/> }
                                </div>
                            </div>
                        </label>
                        <button type='submit' className='btn btn-save'>Сохранить</button>
                        <button type='submit' className='btn btn-cancel' onClick={this.props.closeChangePassModal}>Отмена</button>
                    </form>
                </div>
            </Modal>
        )
    }
}));

export {ModalChangeLang, ModalLogout, ModalChangePass, ModalDeleteNews};