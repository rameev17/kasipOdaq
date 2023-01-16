import React, {Component} from 'react'
import Layout from "../../fragments/layout/Layout";
import {Link} from 'react-router-dom'
import { ToastContainer, toast, Slide } from 'react-toastify';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-toastify/dist/ReactToastify.css';
import {IMaskInput} from 'react-imask'
import { Textbox } from 'react-inputs-validation';

import './style.scss';

import { observer, inject } from "mobx-react";

import {ReactComponent as LogoIcon} from '../../assets/icons/logo.svg'
import {ReactComponent as PhoneIcon} from '../../assets/icons/phone.svg'
import {ReactComponent as PassIcon} from '../../assets/icons/lock.svg'
import {ReactComponent as ShowPassIcon} from '../../assets/icons/show-pass.svg'
import {ReactComponent as HidePassIcon} from '../../assets/icons/hide-pass.svg'
import CookieService from "../../services/CookieService";
import Preloader from "../../fragments/preloader/Preloader";

class Auth extends Component {

    constructor(props) {
        super(props);

        this.state = {
            showPass: false,
            login: '',
            pass: '',
            preloader: false,
        }

        this.phoneChange = this.phoneChange.bind(this)
        this.passwordChange = this.passwordChange.bind(this)
        this.auth = this.auth.bind(this)
        this.togglePass = this.togglePass.bind(this)

    }

    componentDidMount() {

    }

    togglePass(){
        this.setState({
            showPass: !this.state.showPass
        })
    }

    auth(e){
        this.setState({ preloader: true })

        e.preventDefault()
        let login =  this.state.login;
        let password = this.state.pass;

        this.props.userStore.auth(login, password, data => {
            this.setState({ preloader: false })
            CookieService.create('token', data.token);
            this.props.history.push('/news');
            this.props.userStore.profileInfo(() => {

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
            this.props.permissionsStore.loadPermissions()
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

    }

    phoneChange(){
        let phone = document.getElementById('phone')

        phone.oninvalid = function(event) {
            event.target.setCustomValidity('Введите телефон');
        }
    }

    passwordChange(passwd){
        this.setState({
            pass: passwd
        })
    }

    render() {

        return (
            <Layout title='Вход в приложение'>
                {
                    this.state.preloader &&
                        <Preloader/>
                }

                {/*<ToastContainer/>*/}

                <NotificationContainer/>

                <form className='auth form' onSubmit={this.auth}>
                    <div className="logo-wrapper">
                        <LogoIcon/>
                    </div>
                    <label>
                        <p className="label">Номер телефона</p>
                        <div className="wrapper">
                            <PhoneIcon className="svg-icons"/>
                            <IMaskInput
                                mask={'+{7} (000) 000-00-00'}
                                unmask={true}
                                name='phone'
                                onAccept={(value) => this.setState({ login: value })}
                                onChange={this.phoneChange}
                                className="login"
                                placeholder='+7 (___) ___-__-__'
                                required
                                id={'phone'}
                            />
                        </div>
                    </label>
                    <label>
                        <p className="label">Пароль</p>
                        <div className="wrapper">
                            <PassIcon className="svg-icons"/>
                            <Textbox
                                attributesInput={{
                                    id: 'password',
                                    name: 'pass',
                                    type: this.state.showPass ? 'text' : 'password',
                                    placeholder: 'Введите пароль',
                                    required: true,
                                }}
                                value={this.state.pass}
                                onChange={this.passwordChange}
                                onBlur={() => {}}
                                validationOption={{
                                    name: 'Пароль',
                                    check: true,
                                    required: true,
                                    locale: "ru",
                                }}
                                classNameInput={"password"}
                            />
                            <div className='show' onClick={this.togglePass}>
                                {this.state.showPass &&
                                <HidePassIcon/>
                                }
                                {!this.state.showPass &&
                                <ShowPassIcon/>
                                }
                            </div>
                        </div>
                    </label>
                    <button type='submit'>Войти</button>
                    <Link to='/preferences/restore-pass' className="forgot__pass">
                        Забыли пароль?
                    </Link>
                    <Link to='/register' className="forgot__pass" style={{ color: '#01579B' }}>
                        Зарегистрироваться
                    </Link>
                </form>
                <div className="eula">
                    <Link to="/eula" style={{ color: '#9A9B9C' }}>
                        Пользовательское соглашение
                    </Link>
                </div>

            </Layout>
        )
    }
}

export default inject('userStore', 'permissionsStore')(observer(Auth));