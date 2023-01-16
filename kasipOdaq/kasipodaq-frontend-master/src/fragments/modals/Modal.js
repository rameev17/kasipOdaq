import React, {Component} from 'react'
import './index.scss'
import Modal from 'react-modal';
import {Link} from 'react-router-dom'
import {ReactComponent as LogoIcon} from "../../assets/icons/logo.svg";
import {ReactComponent as LockIcon} from '../../assets/icons/lock.svg'
import {ReactComponent as ShowPassIcon} from "../../assets/icons/show-pass.svg";
import {ReactComponent as HidePassIcon} from "../../assets/icons/hide-pass.svg";
import {NotificationContainer, NotificationManager} from 'react-notifications';
import {inject, observer} from "mobx-react";
import CookieService from "../../services/CookieService";


class ModalAccessDenied extends Component {

    componentWillMount() {
        Modal.setAppElement('body');
    }

    render() {

        return (
            <Modal
                isOpen={true}
                onRequestClose={this.props.closeModal}
                className="Modal"
                overlayClassName="Overlay"
            >
                <div className="modal__wrapper access-denied__wrapper">
                    <div className="text">
                        Для того чтобы воспользоваться этим пунктом меню, Вам нужно состоять в профсоюзе.
                        Вступить в профсоюз?
                    </div>

                    <div className="access-denied__btns">
                        <Link onClick={this.props.enterToUnion} className='enter-to-union'>Вступить в профсоюз</Link>
                        <button onClick={this.props.closeModal}>Отмена</button>
                    </div>
                </div>
            </Modal>
        )
    }
}

class ModalChangeLang extends Component {

    state = {
        language: ''
    }

    componentDidMount() {
        this.setState({
            language: this.props.language
        })
    }

    render() {

        return (
            <Modal
                isOpen={true}
                onRequestClose={this.props.closeModal}
                className="Modal"
                overlayClassName="Overlay"
            >
                <div className="modal__wrapper change-lang__wrapper">
                    <form className='change-language'>
                        <label className='lang lang-kz'>
                            <span className="icon">

                            </span>
                            <span className="lang-name">
                                    Казахский язык
                                </span>
                            <input
                                   checked={this.state.language === 'kz'}
                                   type="radio"
                                   name="lang"
                                   value='kz'
                                   id='kz'/>
                            <span className="radio"/>
                        </label>
                        <label className='lang lang-ru'>
                            <span className="icon">

                            </span>
                            <span className="lang-name">
                                    Русский язык
                                </span>
                            <input
                                   checked={this.state.language === 'ru'}
                                   type="radio"
                                   name="lang"
                                   value='ru'
                                   id='ru'/>
                            <span className="radio"/>
                        </label>
                        <div className="btns">
                            <button className="btn"  type='submit'>Применить</button>
                            <button className='btn'>Отмена</button>
                        </div>
                    </form>
            </div>
            </Modal>
        )
    }
}

const ModalLogout = inject('userStore', 'permissionsStore')(observer(class ModalLogout extends Component {

    constructor(props) {
        super(props);

        this.logout = this.logout.bind(this)
    }

    logout(){
        CookieService.remove('token')
        CookieService.remove('union_id')
        CookieService.remove('language')
        this.props.permissionsStore.loadPermissions()
        window.location = '/';
    }

    render() {

        return (
            <Modal
                isOpen={true}
                className="Modal"
                overlayClassName="Overlay"
            >
                <div className="modal__wrapper logout__wrapper">
                    <div className="modal__text">
                        Вы действительно хотите выйти?
                    </div>
                    <div className="modal__btns">
                        <button className='modal__btn' onClick={this.props.closeModal}>Отмена</button>
                        <Link onClick={this.logout} className='modal__btn'>
                            Выйти
                        </Link>
                    </div>
                </div>
            </Modal>
        )
    }
}))

const ModalCreateUnion = inject('userStore')(observer(class ModalCreateUnion extends Component {

    render() {

        return (
            <Modal
                isOpen={true}
                className="create-union__modal"
                overlayClassName="Overlay"
            >
                <div className="wrapper">
                    <div className="label">
                        Ваша заявка №{this.props.userStore.requestNumber} на создание в профсоюз отправлена на рассмотрение.
                    </div>
                    <Link to='/news' className='continue'>Продолжить</Link>
                </div>
            </Modal>
        )
    }
}))

const ModalRegistration = inject('userStore')(observer(class ModalRegistration extends Component {

    render() {

        return (
            <Modal
                isOpen={true}
                className="create-union__modal"
                overlayClassName="Overlay"
            >
                <div className="wrapper">
                    <div className="label">
                        Вы успешно зарегистрировались!
                    </div>
                    <Link to='/auth' className='continue'>Войти</Link>
                </div>
            </Modal>
        )
    }
}))

const ModalEnterToUnion = inject('userStore')(observer(class ModalEnterToUnion extends Component {

    render() {

        return (
            <Modal
                isOpen={true}
                className="create-union__modal"
                overlayClassName="Overlay"
            >
                <div className="wrapper">
                    <div className="label">
                        Ваша заявка №{this.props.userStore.requestNumber} на вступление в профсоюз отправлена на рассмотрение.
                    </div>
                    <Link to='/news' className='continue'>Продолжить</Link>
                </div>
            </Modal>
        )
    }
}))

const ModalChangePass = inject('userStore')(observer(class ModalChangePass extends Component {

    constructor(props) {
        super(props);

        this.state = {
            showNewPass: false,
            showConfirmPass: false,
            showOldPass: false
        }

        this.oldPassword = React.createRef()
        this.newPassword = React.createRef()
        this.newPasswordRepeat = React.createRef()

        this.changePassword = this.changePassword.bind(this)
        this.toggleOldPass = this.toggleOldPass.bind(this)
        this.toggleNewPass = this.toggleNewPass.bind(this)
        this.toggleConfirmPass = this.toggleConfirmPass.bind(this)
    }

    toggleNewPass() {
        this.setState({showNewPass: !this.state.showNewPass})
    }

    toggleConfirmPass() {
        this.setState({showConfirmPass: !this.state.showConfirmPass})
    }

    toggleOldPass() {
        this.setState({showOldPass: !this.state.showOldPass})
    }

    changePassword(e){
        e.preventDefault()

        if (this.newPassword.current.value !== this.newPasswordRepeat.current.value){
            NotificationManager.error('Ваши пароли не совпадают')
        }else{
            this.setState({ preloader: true })
            this.props.userStore.changePassword(
                this.oldPassword.current.value,
                this.newPassword.current.value,
                () => {
                    NotificationManager.success('Ваш пароль успешно изменен')
                    this.setState({ preloader: false })
                    setTimeout(() => {
                        this.props.closeModal()
                    }, 1000)

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
                }

            )
        }

    }

    render() {
        return (
            <Modal
                isOpen={true}
                onRequestClose={this.props.closeModal}
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
                                <input name='password'
                                       type={(this.state.showOldPass ? 'text' : 'password')}
                                       ref={this.oldPassword}
                                       placeholder='Введите пароль'
                                       className="password"
                                       required
                                />
                                <div className='show' onClick={this.toggleOldPass}>
                                    {  this.state.showOldPass && <HidePassIcon/> }
                                    { !this.state.showOldPass && <ShowPassIcon/> }
                                </div>
                            </div>
                        </label>
                        <label>
                            <p className="label">Новый пароль</p>
                            <div className="wrapper">
                                <div className="icon">
                                    <LockIcon/>
                                </div>
                                <input name='new_password'
                                       type={(this.state.showNewPass ? 'text' : 'password')}
                                       placeholder='Введите пароль'
                                       className="password"
                                       ref={this.newPassword}
                                       required
                                />
                                <div className='show' onClick={this.toggleNewPass}>
                                    {  this.state.showNewPass && <HidePassIcon/> }
                                    { !this.state.showNewPass && <ShowPassIcon/> }
                                </div>
                            </div>
                        </label>
                        <label>
                            <p className="label">Подтвердите пароль</p>
                            <div className="wrapper">
                                <div className="icon">
                                    <LockIcon/>
                                </div>
                                <input name='password_confirm'
                                       type={(this.state.showConfirmPass ? 'text' : 'password')}
                                       placeholder='Введите пароль'
                                       className="password"
                                       ref={this.newPasswordRepeat}
                                       required
                                />
                                <div className='show' onClick={this.toggleConfirmPass}>
                                    { this.state.showConfirmPass && <HidePassIcon/> }
                                    { !this.state.showConfirmPass && <ShowPassIcon/> }
                                </div>
                            </div>
                        </label>
                        <button type='submit' className='btn btn-save'>Сохранить</button>
                        <button type='submit' className='btn btn-cancel' onClick={this.props.closeModal}>Отмена</button>
                    </form>
                </div>
            </Modal>
        )
    }
}))

export {ModalAccessDenied, ModalChangeLang, ModalLogout, ModalCreateUnion, ModalEnterToUnion, ModalChangePass, ModalRegistration};