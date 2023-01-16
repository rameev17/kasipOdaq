import React from 'react';
import StepsLayout from '../Containers/StepsLayout';
import {NotificationContainer, NotificationManager} from "react-notifications";
import { Switch, Route } from 'react-router-dom';
import {IMaskInput} from 'react-imask';

import './index.scss';
import {ReactComponent as LogoIcon} from "../../assets/icons/logo.svg";
import {ReactComponent as PhoneIcon} from '../../assets/icons/phone.svg';
import {ReactComponent as ShowPassIcon} from '../../assets/icons/show-pass.svg';
import {ReactComponent as HidePassIcon} from '../../assets/icons/hide-pass.svg';
import {ReactComponent as LockIcon} from '../../assets/icons/lock.svg';
import {ReactComponent as MarkIcon} from '../../assets/icons/exclamation-mark.svg';

import { observer, inject } from "mobx-react";
import Preloader from "../../fragments/preloader/Preloader";

class RestorePass extends React.Component{

    state = {
        currentStep: 1,
        isAuth: false
    }

    setStep = (step) => {
        this.setState(this.setState({currentStep: step}))
    }

    render(){

        return(
            <React.Fragment>
            <NotificationContainer/>
            {
                !this.state.isAuth &&
                    <div className="form__wrapper">
                        <StepsLayout paging={4} currentStep={this.state.currentStep}>
                            <Switch>
                                <Route exact path='/restore-pass'
                                       render={(props) => <StepPhone {...props}
                                                                     requestActivationCode={this.requestActivationCode}
                                                                     setStep={this.setStep}/>}/>
                                <Route exact path='/restore-pass/code'
                                       render={(props) => <StepCode {...props}
                                                                    requestActivationCode={this.requestActivationCode}
                                                                    verifyActivationCode={this.verifyActivationCode}
                                                                    setStep={this.setStep}/>}/>
                                <Route exact path='/restore-pass/new-pass'
                                       render={(props) => <StepNewPass {...props}
                                                                       setPassword={this.setPassword}
                                                                       setStep={this.setStep}/>}/>
                            </Switch>
                        </StepsLayout>
                    </div>
            }
            </React.Fragment>
        )
    }
}

const StepPhone = inject('userStore', 'permissionsStore')(observer(class StepPhone extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            preloader: false,
            isVerify: false,
        }

        this.getSendSms = this.getSendSms.bind(this)
        this.handleChangeInput = this.handleChangeInput.bind(this)
    }

    componentDidMount() {
        this.props.setStep(1)
    }

    handleChangeInput(value) {
        this.props.userStore.phone = value
    }

    getSendSms(e) {
        e.preventDefault();

        this.setState({preloader: true})

        this.props.userStore.sendSms(data => {
            this.setState({preloader: false})
            this.props.history.push('/restore-pass/code')

        }, response => {
            if (Array.isArray(response.data)) {
                response.data.forEach(error => {
                    this.setState({preloader: false})
                    NotificationManager.error(error.message)
                })
            } else {
                this.setState({preloader: false})
                NotificationManager.error(response.data.message)
            }
            if (response.status == 401){
                this.setState({ preloader: false })
                this.props.history.push('/')
            }
        });
    }

    render(){

        return(
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
                        <p className="label">Номер телефона</p>
                        <div className="icon">
                            <PhoneIcon/>
                        </div>
                        <IMaskInput
                            mask={'+{7} (000) 000-00-00'}
                            unmask={true}
                            name='phone'
                            onAccept={value => this.handleChangeInput(value)}
                            placeholder='+7 (___) ___-__-__'
                        />
                    </label>
                    <button type='submit' className='btn'>Получить SMS</button>
                </form>
            </div>
        )
    }
}))

const StepCode = inject('userStore', 'permissionsStore')(observer(class StepCode extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            preloader: false,
        }

        this.handleChangeInput = this.handleChangeInput.bind(this)
        this.confirmSms = this.confirmSms.bind(this)
        this.requestActivationCode = this.requestActivationCode.bind(this)
    }

    componentDidMount() {
        this.props.setStep(2)
    }

    handleChangeInput(e) {
        this.props.userStore.activationCode = e.target.value
    }

    confirmSms(e) {
        this.setState({ preloader: true })
        e.preventDefault();

        this.props.userStore.confirmSms( data => {
            this.setState({ preloader: false })
            this.props.history.push('/restore-pass/new-pass')

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
                this.setState({ preloader: false })
                this.props.history.push('/')
            }
        })
    }

    requestActivationCode(){
        this.setState({preloader: true})

        this.props.userStore.sendSms(data => {
            this.setState({preloader: false})
            NotificationManager.success('СМС Код повторно выслан на ваш номер!')

        }, response => {
            if (Array.isArray(response.data)) {
                response.data.forEach(error => {
                    this.setState({preloader: false})
                    NotificationManager.error(error.message)
                })
            } else {
                this.setState({preloader: false})
                NotificationManager.error(response.data.message)
            }
            if (response.status == 401){
                this.setState({ preloader: false })
                this.props.history.push('/')
            }
        });
    }


    render(){
        return(
            <div className='step step-code'>
                {
                    this.state.preloader &&
                        <Preloader/>
                }
                <NotificationContainer/>
                <form className="form" onSubmit={this.confirmSms}>
                    <div className="logo-wrapper">
                        <LogoIcon/>
                    </div>
                    <label>
                        <p className="label">Код из СМС</p>
                        <div className="icon"/>
                        {
                            /* У инпута есть два состояния:
                            *  ошибка - className='error'
                            *  успех - className='success'
                            */
                        }
                        <input type="text"
                               onChange={this.handleChangeInput}
                               placeholder='Введите код из СМС'/>
                    </label>
                    <button type='submit' className='btn'>Продолжить</button>
                    <div className="info">
                        <div className="icon">
                            <MarkIcon/>
                        </div>
                        <div className="text">
                            Для подтверждения регистрации на указанный номер был выслан SMS-код.
                            <a href="#" onClick={this.requestActivationCode}>
                                Выслать код еще раз
                            </a>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}))

const StepNewPass = inject('userStore', 'permissionsStore')(observer(class StepNewPass extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            showPass: false,
            showPassRepeat: false,
            login: '',
            pass: '',
            passRepeat: '',
        }

        this.newPassword = React.createRef()
        this.repeatNewPassword = React.createRef()

        this.toggleNewPass = this.toggleNewPass.bind(this)
        this.toggleConfirmPass = this.toggleConfirmPass.bind(this)
        this.restorePass = this.restorePass.bind(this)
    }

    componentDidMount() {
        this.props.setStep(3)
    }

    toggleNewPass(){
        this.setState({showNewPass: !this.state.showNewPass})
    }

    toggleConfirmPass(){
        this.setState({showConfirmPass: !this.state.showConfirmPass})
    }

    restorePass(e) {
        this.setState({ preloader: true })

        e.preventDefault()

        if(this.newPassword.current.value !== this.repeatNewPassword.current.value) {
            this.setState({ preloader: false })
            NotificationManager.error('Ваши пароли не совпадают!')
        }else{
            this.props.userStore.newPassword = this.newPassword.current.value

            this.props.userStore.restorePass( data => {
                this.setState({ preloader: false })
                NotificationManager.success('Ваш пароль успешно изменен!')
                this.props.history.push('/')

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
                    this.setState({ preloader: false })
                    this.props.history.push('/')
                }
            })

        }
    }

    render(){
        return(
            <div className='step step-pass'>
                <NotificationContainer/>
                <form className="form" onSubmit={ this.restorePass }>
                    <div className="logo-wrapper">
                        <LogoIcon/>
                    </div>
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
                            <input name='passRepeat'
                                   ref={this.repeatNewPassword}
                                   type={(this.state.showConfirmPass ? 'text' : 'password')}
                                   placeholder='Введите пароль'
                                   className="password"
                            />
                            <div className='show' onClick={this.toggleConfirmPass}>
                                { this.state.showConfirmPass && <ShowPassIcon/> }
                                { !this.state.showConfirmPass && <HidePassIcon/> }
                            </div>
                        </div>
                    </label>
                    <button type='submit' className='btn'>Войти</button>
                </form>
            </div>
        )
    }
}))

export default inject('userStore', 'permissionsStore')(observer(RestorePass));