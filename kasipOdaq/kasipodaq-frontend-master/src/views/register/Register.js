import React, {Component} from 'react';
import Layout from "../../fragments/layout/Layout";
import StepsLayout from '../../fragments/stepsLayout/StepsLayout';
import { Switch, Link, Route } from 'react-router-dom';
import {IMaskInput} from 'react-imask';

import {NotificationContainer, NotificationManager} from 'react-notifications';
import {ModalRegistration} from '../../fragments/modals/Modal';

import {ReactComponent as LogoIcon} from '../../assets/icons/logo.svg';
import {ReactComponent as MarkIcon} from '../../assets/icons/exclamation-mark.svg';

import './style.scss';

import { observer, inject } from "mobx-react";
import Preloader from "../../fragments/preloader/Preloader";
import CookieService from "../../services/CookieService";
import {ReactComponent as PhoneIcon} from "../../assets/icons/phone.svg";
import {ReactComponent as CheckedIcon} from "../../assets/icons/checked.svg";
import {Textbox} from "react-inputs-validation";

class Register extends Component{

    constructor(props) {
        super(props)

    }

    state = {
        currentStep: 1,
        fileProtocol: '',
        filePosition: '',
        fileProtocolHeaders: {},
        filePositionHeaders: {},
        fileStatementHeaders: {}
    }

    setStep = (step) => {
        this.setState(this.setState({currentStep: step}))
    }

    render(){

        return(
            <Layout title='Регистрация'>
                <StepsLayout paging={3} currentStep={this.state.currentStep}>
                    <Switch>
                        <Route exact path='/register'
                               render={(props) => <StepPhone {...props}
                                                             setStep={this.setStep}/>}/>
                        <Route exact path='/register/code'
                               render={(props) => <StepCode {...props}
                                                            setStep={this.setStep}/>}/>
                        <Route exact path='/register/registration'
                               render={(props) => <StepRegistration {...props}
                                                                    setStep={this.setStep}/>}/>
                    </Switch>
                </StepsLayout>
            </Layout>
        )
    }
}

const StepPhone = inject('userStore', 'permissionsStore')(observer(class StepPhone extends Component{

    constructor(props){
        super(props)

        this.state = {
            phone: '',
            preloader: false,
        }

        this.getSendSms = this.getSendSms.bind(this)

    }

    componentDidMount() {
        this.props.setStep(1)
    }

    getSendSms(e) {
        this.setState({ preloader: true })
        e.preventDefault();

        this.props.userStore.sendSms("register", () => {
            this.setState({ preloader: false })
            this.props.history.push('/register/code')

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
                        <p className="label">{this.props.userStore.languageList["Номер телефона"] || 'Номер телефона'}</p>
                        <PhoneIcon className="svg-icons" style={{ position: 'absolute', top: '30' }}/>
                        <IMaskInput
                            mask={'+{7} (000) 000-00-00'}
                            unmask={true}
                            name='phone'
                            placeholder='+7 (___) ___-__-__'
                            onAccept={(value) => this.props.userStore.setPhone(value)}
                            required
                        />
                    </label>
                    <button type='submit'>{this.props.userStore.languageList["Получить СМС"] || 'Получить СМС'}</button>
                </form>
                <div className="eula">
                    <Link to={'/eula'} style={{ color: '#9A9B9C' }}>{this.props.userStore.languageList["Пользовательское соглашение"] || 'Пользовательское соглашение'}</Link>
                </div>
            </div>
        )
    }
}))

const StepCode = inject('userStore', 'permissionsStore')(observer(class StepCode extends Component{

    constructor(props) {
        super(props)
        this.state = {
            preloader: false,
            code: "",
        }

        this.confirmRef = React.createRef();
        this.confirmSms = this.confirmSms.bind(this);
        this.repeatSms = this.repeatSms.bind(this)

    }

    componentDidMount() {
        this.props.setStep(2)
    }

    confirmSms(e) {
        this.setState({ preloader: true })
        e.preventDefault();

        this.props.userStore.setActivationCode(this.state.code);

        this.props.userStore.confirmSms( data => {
            this.setState({ preloader: false })
            this.props.history.push('/register/registration')

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

    repeatSms(e) {
        this.setState({ preloader: true })
        e.preventDefault();

        this.props.userStore.sendSms( "register",() => {
            this.setState({ preloader: false })
            NotificationManager.success('СМС Код выслан на ваш номер повторно!')

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

    render(){

        return(
            <div className='step step-code'>
                {
                    this.state.preloader &&
                    <Preloader/>
                }
                <NotificationContainer/>
                <form  className="form" onSubmit={ this.confirmSms }>
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
                        <Textbox
                            attributesInput={{
                                id: 'confirmation-code',
                                name: 'code',
                                type: "text",
                                placeholder: this.props.userStore.languageList["Введите код"] || 'Введите код',
                                required: true,
                            }}
                            value={this.state.pass}
                            onChange={code => {
                                this.setState({code: code})
                            }}
                            onBlur={() => {}}
                            validationOption={{
                                name: 'пароль',
                                check: true,
                                required: true,
                                locale: "ru",
                                type: 'number',
                                length: 6,
                            }}
                        />
                    </label>
                    <button type='submit'>{this.props.userStore.languageList["Продолжить"] || 'Продолжить'}</button>
                    <div className="info">
                        <div className="icon">
                            <MarkIcon/>
                        </div>
                        <div className="text">
                            Для подтверждения регистрации на указанный номер был выслан СМС-код.
                            {this.props.userStore.languageList["Для подтверждения регистрации на укаханный номер был выслан СМС-код"]
                            || 'Для подтверждения регистрации на указанный номер был выслан СМС-код'}
                            <a onClick={this.repeatSms} style={{ cursor: 'pointer' }}>
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

const StepRegistration = inject('userStore', 'permissionsStore')(observer(class StepRegistration extends Component{

    constructor(props){
        super(props)

        this.state = {
            preloader: false,
            modalIsOpen: false,
            firstName: "",
            lastName: "",
            iin: "",
            address: "",
            password: "",
            passwordConfirmation: "",
        }

        this.patronymicRef = React.createRef()
        this.sexRef = React.createRef()

        this.togglePass = this.togglePass.bind(this);
        this.toggleRepeatPass = this.toggleRepeatPass.bind(this);
        this.renderRedirect = this.renderRedirect.bind(this)
        this.closeModal = this.closeModal.bind(this)
    }

    componentDidMount() {
        this.props.setStep(3);
    }

    togglePass() {
        this.setState({showPass: !this.state.showPass})
    }

    toggleRepeatPass() {
        this.setState({showRepeatPass: !this.state.showRepeatPass})
    }

    renderRedirect(e) {
        e.preventDefault()

        this.props.userStore.setfirstName(this.state.firstName);
        this.props.userStore.setPatronymic(this.patronymicRef.current.value)
        this.props.userStore.setfamilyName(this.state.lastName);
        this.props.userStore.setUid(this.state.iin);
        this.props.userStore.setPassword(this.state.password);

        if (this.state.password !== this.state.passwordConfirmation) {
            NotificationManager.error('Ваши пароли не совпадают');
        } else if (this.state.iin.length !== 12){
            NotificationManager.error('Ваши ИИН должен содержать 12 цифр');
        }else{
            this.props.userStore.registration( data => {

                this.props.permissionsStore.loadPermissions()

                this.setState({
                    preloader: false,
                    modalIsOpen: true
                })

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
                    CookieService.remove('token')
                    this.setState({ preloader: false })
                    this.props.history.push('/auth')
                }
            })
        }
    }

    closeModal() {
        this.setState({
            modalIsOpen: false
        })
    }

    render(){
        return(
            <React.Fragment>
                {
                    this.state.preloader &&
                    <Preloader/>
                }
                <NotificationContainer/>
                <div className='step step-registration'>
                    <form className="form" onSubmit={ this.renderRedirect }>
                        <div className="logo-wrapper">
                            <LogoIcon/>
                        </div>

                        <label>
                            <p className="label">{this.props.userStore.languageList["Имя"] || 'Имя'} <span>*</span></p>
                            <Textbox
                                attributesInput={{
                                    name: 'name',
                                    type: 'text',
                                    placeholder: this.props.userStore.languageList["Заполните поле"] || 'Заполните поле',
                                    required: true,
                                }}
                                onChange={name => {
                                    this.setState({firstName: name})
                                }}
                                onBlur={() => {}}
                                validationOption={{
                                    name: 'Имя',
                                    check: true,
                                    required: true,
                                    locale: "ru",
                                }}
                            />
                        </label>
                        <label>
                            <p className="label">{this.props.userStore.languageList["Фамилия"] || 'Фамилия'} <span>*</span></p>
                            <Textbox
                                attributesInput={{
                                    name: 'lastName',
                                    type: 'text',
                                    placeholder: this.props.userStore.languageList["Заполните поле"] || 'Заполните поле',
                                    required: true,
                                }}
                                onChange={lastName => {
                                    this.setState({lastName: lastName})
                                }}
                                onBlur={() => {}}
                                validationOption={{
                                    name: 'Поле',
                                    check: true,
                                    required: true,
                                    locale: "ru",
                                }}
                            />
                        </label>
                        <label>
                            <p className="label">{this.props.userStore.languageList["Отчество"] || 'Отчество'}</p>
                            <input type="text"
                                   name='middle_name'
                                   ref={this.patronymicRef}
                                   placeholder={this.props.userStore.languageList["Заполните поле"] || 'Заполните поле'}
                            />
                        </label>
                        <label>
                            <p className="label">{this.props.userStore.languageList["ИИН"] || 'ИИН'} <span>*</span></p>
                            <Textbox
                                attributesInput={{
                                    name: 'iin',
                                    type: 'text',
                                    placeholder: this.props.userStore.languageList["Заполните поле"] || 'Заполните поле',
                                    required: true,
                                }}
                                onChange={iin => {
                                    this.setState({iin: iin})
                                }}
                                onBlur={() => {}}
                                validationOption={{
                                    name: 'ИИН',
                                    check: true,
                                    required: true,
                                    type: 'number',
                                    length: 12,
                                    locale: "ru",
                                }}
                            />
                        </label>
                        <label>
                            <p className="label">{this.props.userStore.languageList["Пол"] || 'Пол'} <span>*</span></p>
                            <select style={{ width: '100%', border: '1px solid #E4E8F0', padding: '10px', borderRadius: '5px', fontSize: '16px', color: '#404040' }}
                                    ref={this.sexRef}
                                    name="sex"
                                    onChange={(e) => { this.props.userStore.sex = e.target.value }}
                                    required
                            >
                                <option value='' disabled={true} selected={true}>{this.props.userStore.languageList["Выберите пол"] || 'Выберите пол'}</option>
                                <option value='0'>{this.props.userStore.languageList["Женский"] || 'Женский'}</option>
                                <option value='1'>{this.props.userStore.languageList["Мужской"] || 'Мужской'}</option>
                            </select>
                        </label>
                        <label>
                            <p className="label">{this.props.userStore.languageList["Дата рождения"] || 'Дата рождения'} <span>*</span></p>
                            <IMaskInput
                                mask={'00-00-0000'}
                                unmask={false}
                                onChange={(event) => {
                                    console.log(event);
                                    this.props.userStore.setBirthday(event.target.value);
                                }}
                                placeholder='31-12-1999'
                                required
                            />
                        </label>
                        <label>
                            <p className="label">{this.props.userStore.languageList["Адрес проживания"] || 'Адрес проживания'} <span>*</span></p>
                            <Textbox
                                attributesInput={{
                                    name: 'address',
                                    type: 'text',
                                    placeholder: this.props.userStore.languageList["Заполните поле"] || 'Заполните поле',
                                    required: true,
                                }}
                                onChange={address => {
                                    this.setState({address: address})
                                    this.props.userStore.physical_address = address
                                }}
                                onBlur={() => {}}
                                validationOption={{
                                    name: 'Адрес',
                                    check: true,
                                    required: true,
                                    locale: "ru",
                                }}
                            />
                        </label>
                        <label>
                            <p className="label">{this.props.userStore.languageList["Пароль"] || 'Пароль'} <span>*</span></p>
                            <Textbox
                                attributesInput={{
                                    name: 'password',
                                    type: 'password',
                                    placeholder: this.props.userStore.languageList["Заполните поле"] || 'Заполните поле',
                                    required: true,
                                }}
                                onChange={password => {
                                    this.setState({password: password})
                                }}
                                onBlur={() => {}}
                                validationOption={{
                                    name: 'Пароль',
                                    check: true,
                                    required: true,
                                    locale: "ru",
                                }}
                            />
                        </label>
                        <label>
                            <p className="label">{this.props.userStore.languageList["Повторите пароль"] || 'Повторите пароль'} <span>*</span></p>
                            <Textbox
                                attributesInput={{
                                    name: 'passwordConfirmation',
                                    type: 'password',
                                    placeholder: this.props.userStore.languageList["Заполните поле"] || 'Заполните поле',
                                    required: true,
                                }}
                                onChange={password => {
                                    this.setState({passwordConfirmation: password})
                                }}
                                onBlur={() => {}}
                                validationOption={{
                                    name: 'Пароль',
                                    check: true,
                                    required: true,
                                    locale: "ru",
                                    compare: this.state.password,
                                }}
                            />
                        </label>
                        <button type='submit'>{this.props.userStore.languageList["Зарегистрироваться"] || 'Зарегистрироваться'}</button>
                    </form>
                    <div className="eula">
                        <p>
                            <CheckedIcon/> {this.props.userStore.languageList["Нажимая на кнопку, Вы соглащаетесь на обработку персональных данных"]
                            || 'Нажимая на кнопку, Вы соглашаетесь на обработку персональных данных'}
                        </p>
                    </div>
                    <div className="eula">
                        <Link to={'/eula'} style={{ color: '#9A9B9C', display: 'block' }}>{this.props.userStore.languageList["Пользовательское соглашение"] || 'Пользовательское соглашение'}</Link>
                    </div>

                    {
                        this.state.modalIsOpen &&
                        <ModalRegistration
                            closeModal = {this.closeModal}
                        />
                    }

                </div>
            </React.Fragment>
        )
    }
}))

export default inject('userStore', 'permissionsStore')(observer(Register));