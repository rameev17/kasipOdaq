import React, {Component} from 'react'
import Layout from "../../fragments/layout/Layout";
import StepsLayout from '../../fragments/stepsLayout/StepsLayout'
import {Switch, BrowserRouter, Route, Redirect, Link} from 'react-router-dom';

import {IMaskInput} from 'react-imask'
import {ToastContainer, toast, Slide} from 'react-toastify';
import { ReCaptcha } from "react-recaptcha-v3";
import ReCAPTCHA from "react-google-recaptcha";
import Recaptcha from "react-recaptcha";

import {ReactComponent as LogoIcon} from '../../assets/icons/logo.svg'
import {ReactComponent as MarkIcon} from '../../assets/icons/exclamation-mark.svg'
import {ReactComponent as PassIcon} from '../../assets/icons/lock.svg'
import {ReactComponent as ShowPassIcon} from '../../assets/icons/show-pass.svg'
import {ReactComponent as HidePassIcon} from '../../assets/icons/hide-pass.svg'

import './style.scss';
import { observer, inject } from "mobx-react";
import Preloader from "../../fragments/preloader/Preloader";
import CookieService from "../../services/CookieService";
import {ReactComponent as PhoneIcon} from "../../assets/icons/phone.svg";
import {ReactComponent as CheckedIcon} from "../../assets/icons/checked.svg";
import {NotificationManager, NotificationContainer} from "react-notifications";

class RestorePass extends Component {

    state = {
        currentStep: 1
    }

    setStep = (step) => {
        this.setState(this.setState({currentStep: step}))
    }


    render() {

        return (
            <Layout title='Восстановление пароля'>
                <StepsLayout paging={4} currentStep={this.state.currentStep}>
                    <Switch>
                        <Route exact path='/preferences/restore-pass'
                               render={(props) => <StepPhone {...props}
                                                             setStep={this.setStep}/>}/>
                        <Route exact path='/preferences/restore-pass/code'
                               render={(props) => <StepCode {...props}
                                                            setStep={this.setStep}/>}/>
                        <Route exact path='/preferences/restore-pass/new-pass'
                               render={(props) => <StepNewPass {...props}
                                                               setPassword={this.setPassword}
                                                               setStep={this.setStep}/>}/>
                    </Switch>
                </StepsLayout>
            </Layout>
        )
    }
}

const StepPhone = inject('userStore', 'permissionsStore')(observer(class StepPhone extends Component {

    constructor(props){
        super(props)

        this.state = {
            preloader: false,
            verifyStatus: false,
        }

        this.recaptcha = React.createRef()

        this.getSendSms = this.getSendSms.bind(this)
        this.captchaChange = this.captchaChange.bind(this)
    }

    componentDidMount() {
        this.props.setStep(1)
    }

    captchaChange = (recaptchaToken) => {
        this.props.userStore.verifyRecaptcha(recaptchaToken, (data) => {
            this.setState({
                verifyStatus: data.data.success
            })
        })
    }

    getSendSms(e) {
        e.preventDefault();

        if (this.state.verifyStatus){
            this.setState({ preloader: true })

            this.props.userStore.sendSms("restore_password", data => {
                this.setState({ preloader: false })
                this.props.history.push('/preferences/restore-pass/code')

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
            });
        }else{
            NotificationManager.error('Вы робот!')
        }
    }


    render() {

        return (
            <div className='step step-phone'>
                {
                    this.state.preloader &&
                    <Preloader/>
                }
                <NotificationContainer/>

                <form className="form" onSubmit={ this.getSendSms }>
                    <div className="logo-wrapper">
                        <LogoIcon/>
                    </div>
                    <label>
                        <p className="label">{this.props.userStore.languageList["Номер телефона"] || 'Номер телефона'}</p>
                        <PhoneIcon className="svg-icons" style={{ position: 'absolute', top: '30' }}/>
                        <IMaskInput
                            mask={'+{7} (000) 000-00-00'}
                            unmask={true}
                            required
                            name='phone'
                            placeholder='+7 (___) ___-__-__'
                            onAccept={(value) => this.props.userStore.setPhone(value)}
                        />
                    </label>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginTop: 20
                    }}>
                        {/*<ReCAPTCHA*/}
                        {/*    sitekey="6LePrcEZAAAAALsgoRcFIYjJYMbfQSeflyjP6Bam"*/}
                        {/*    onChange={this.captchaChange}*/}
                        {/*/>*/}

                        <ReCaptcha
                            ref={this.recaptcha}
                            sitekey="6LePrcEZAAAAALsgoRcFIYjJYMbfQSeflyjP6Bam"
                            action='action_name'
                            verifyCallback={this.captchaChange}
                        />


                        {/*<Recaptcha*/}
                        {/*    sitekey="6LcgVcQZAAAAAPd3zImzOMt_SENFCquHd0Sb177P"*/}
                        {/*    render="explicit"*/}
                        {/*    onloadCallback={this.captchaChange}*/}
                        {/*/>*/}
                    </div>
                    <button
                        type='submit'
                        disabled={this.state.verifyStatus == false}
                    >

                        {this.props.userStore.languageList["Получить СМС"] || 'Получить СМС'}
                    </button>
                </form>

                <div className="eula">
                    <Link to={'/eula'} style={{ color: '#9A9B9C' }}>{this.props.userStore.languageList["Пользовательское соглашение"] || 'Пользовательское соглашение'}</Link>
                </div>

            </div>
        )
    }
}))

const StepCode = inject('userStore', 'permissionsStore')(observer(class StepCode extends Component {

    constructor(props) {
        super(props);

        this.state = {
            preloader: false,
        }

        this.confirmRef = React.createRef();

        this.confirmSms = this.confirmSms.bind(this);
        this.repeatSms = this.repeatSms.bind(this);
    }

    componentDidMount() {
        this.props.setStep(2)
    }

    confirmSms(e) {
        this.setState({ preloader: true })
        e.preventDefault();

        this.props.userStore.setActivationCode(this.confirmRef.current.value)

        this.props.userStore.confirmSms( data => {
            this.setState({ preloader: false })
            this.props.history.push('/preferences/restore-pass/new-pass')

        }, response => {
            if (Array.isArray(response.data)) {
                response.data.forEach(error => {
                    this.setState({ preloader: false })
                    NotificationManager.error(response.data.message)
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

    repeatSms(e){
        this.setState({ preloader: true })

        e.preventDefault();

        this.props.userStore.sendSms("restore_password", data => {
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
                CookieService.remove('token')
                this.setState({ preloader: false })
                this.props.history.push('/auth')
            }
        });
    }

    render() {
        return (
            <div className='step step-code'>
                {
                    this.state.preloader &&
                    <Preloader/>
                }
                <NotificationContainer/>
                <form className="form" onSubmit={ this.confirmSms }>
                    <div className="logo-wrapper">
                        <LogoIcon/>
                    </div>
                    <label>
                        <p className="label">{this.props.userStore.languageList["Код из СМС"] || 'Код из СМС'}</p>
                        <div className="icon"></div>
                        {
                            /* У инпута есть два состояния:
                            *  ошибка - className='error'
                            *  успех - className='success'
                            */
                        }
                        <input type="text"
                               ref={this.confirmRef}
                               required
                               placeholder='Введите код из СМС'/>
                    </label>
                    <button type='submit'>{this.props.userStore.languageList["Продолжить"] || 'Продолжить'}</button>
                    <div className="info">
                        <div className="icon">
                            <MarkIcon/>
                        </div>
                        <div className="text">
                            Для подтверждения регистрации на указанный номер был выслан СМС-код
                            {this.props.userStore.languageList["Для подтверждения регистрации на указанный номер был выслан СМС-код"]
                            || 'Для подтверждения регистрации на указанный номер был выслан СМС-код'}
                            <a onClick={this.repeatSms}>
                                {this.props.userStore.languageList["Выслать код еще раз"] || 'Выслать код еще раз'}
                            </a>
                        </div>
                    </div>
                </form>
                <div className="eula">
                    <Link to={'/eula'} style={{ color: '#9A9B9C' }}>{this.props.userStore.languageList["Пользовательское соглашение"] || 'Пользовательское соглашение'}</Link>
                </div>
            </div>
        )
    }
}))

const StepNewPass = inject('userStore', 'permissionsStore')(observer(class StepNewPass extends Component {
    constructor(props){
        super(props)

        this.state = {
            showPass: false,
            showPassRepeat: false,
            login: '',
            pass: '',
            passRepeat: '',
            preloader: false,
        }

        this.newPassword = React.createRef()
        this.repeatNewPassword = React.createRef()

        this.togglePass = this.togglePass.bind(this)
        this.togglePassRepeat = this.togglePassRepeat.bind(this)
        this.restorePass = this.restorePass.bind(this)
        this.onChangeNewPassword = this.onChangeNewPassword.bind(this)
    }


    componentDidMount() {
        this.props.setStep(3)
    }

    togglePass = () => {
        this.setState({showPass: !this.state.showPass})
    }

    togglePassRepeat = () => {
        this.setState({showPassRepeat: !this.state.showPassRepeat})
    }

    restorePass(e){

        e.preventDefault()

        if(this.newPassword.current.value !== this.repeatNewPassword.current.value) {
            NotificationManager.error('Ваши пароли не совпадают!')
        }else{

            this.setState({ preloader: true })

            this.props.userStore.restorePass( data => {
                this.setState({ preloader: false })
                NotificationManager.success('Ваш пароль успешно изменен!')
                this.props.history.push('/auth')

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

    }

    onChangeNewPassword(){
        this.props.userStore.newPassword = this.repeatNewPassword.current.value
    }

    render() {
        return (
            <div className='step step-code step-new-pass'>

                {
                    this.state.preloader &&
                        <Preloader/>
                }

                <NotificationContainer/>

                <form className="form" onSubmit={ this.restorePass }>
                    <div className="logo-wrapper">
                        <LogoIcon/>
                    </div>
                    <label>
                        <p className="label">{this.props.userStore.languageList["Новый пароль"] || 'Новый пароль'}</p>
                        <div className="wrapper">
                            <PassIcon className="svg-icons-restore"/>
                            <input name='pass'
                                   ref={this.newPassword}

                                   type={(this.state.showPass ? 'text' : 'password')}
                                   placeholder={this.props.userStore.languageList["Введите пароль"] || 'Введите пароль'}
                                   className="password"
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
                    <label className="label-margin">
                        <p className="label">{this.props.userStore.languageList["Подтвердите пароль"] || 'Подтвердите пароль'}</p>
                        <div className="wrapper">
                            <PassIcon className="svg-icons-restore"/>
                            <input name='passRepeat'
                                   onChange={ this.onChangeNewPassword }
                                   ref={this.repeatNewPassword}
                                   type={(this.state.showPassRepeat ? 'text' : 'password')}
                                   placeholder={this.props.userStore.languageList["Введите пароль"] || 'Введите пароль'}
                                   className="password"
                            />
                            <div className='show' onClick={this.togglePassRepeat}>
                                {this.state.showPassRepeat &&
                                <HidePassIcon/>
                                }
                                {!this.state.showPassRepeat &&
                                <ShowPassIcon/>
                                }
                            </div>
                        </div>
                    </label>
                    <button type='submit'>{this.props.userStore.languageList["Войти"] || 'Войти'}</button>
                </form>
                <div className="eula">
                    <p>
                        <CheckedIcon/> {this.props.userStore.languageList["Нажимая на кнопку, Вы соглашаетесь на обработку персональных данных"]
                        || 'Нажимая на кнопку, Вы соглашаетесь на обработку персональных данных'}
                    </p>
                </div>
            </div>
        )
    }
}))

export default inject('userStore', 'permissionsStore')(observer(RestorePass));