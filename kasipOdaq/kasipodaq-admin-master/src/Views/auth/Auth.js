import React from 'react';
import {Link} from 'react-router-dom';
import './index.scss';
import {NotificationContainer, NotificationManager} from "react-notifications";
import {IMaskInput} from 'react-imask';

import {ReactComponent as LogoIcon} from '../../assets/icons/logo.svg';
import {ReactComponent as ShowPassIcon} from '../../assets/icons/show-pass.svg';
import {ReactComponent as HidePassIcon} from '../../assets/icons/hide-pass.svg';
import {ReactComponent as PhoneIcon} from '../../assets/icons/phone.svg';
import {ReactComponent as LockIcon} from '../../assets/icons/lock.svg';

import { observer, inject } from "mobx-react";
import Preloader from "../../fragments/preloader/Preloader";
import CookieService from "../../services/CookieService";

class Auth extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            showPass: false,
            pass: '',
            preloader: false
        };

        this.authenticate = this.authenticate.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.togglePass = this.togglePass.bind(this)

    }

    togglePass() {
        this.setState({showPass: !this.state.showPass})
    }

    handleInputChange(e){
        this.setState({
            pass: e.target.value
        })
    }

    authenticate(e) {
        e.preventDefault();

        this.setState({ preloader: true });

        this.props.userStore.setPassword(this.state.pass);

        this.props.userStore.auth(data => {

        });

        this.props.userStore.auth( data => {
            CookieService.create('token-admin', data.token);
            CookieService.create('language-admin', 'ru');

            this.props.userStore.profileInfo(() => {
                if (this.props.userStore.role == 'user'){
                    NotificationManager.error('У вас нет доступа');
                    this.setState({ preloader: false })
                }else{
                    this.props.permissionsStore.loadPermissions(() => {
                        this.setState({ preloader: false });
                        this.props.history.push('/union')
                    })
                }
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
                    this.setState({ preloader: false });
                    this.props.history.push('/')
                }
            })

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
                this.setState({ preloader: false });
                CookieService.remove('token-admin');
                this.props.history.push('/')
            }
        })
    }

    render() {

        return (
            <React.Fragment>
                <div className='App'>

                    {
                        this.state.preloader &&
                        <Preloader/>
                    }

                    <NotificationContainer/>
                    <form className='auth form' onSubmit={ this.authenticate }>
                        <div className="logo-wrapper">
                            <LogoIcon/>
                        </div>
                        <label>
                            <p className="label">Номер телефона/Телефон нөмірі</p>
                            <div className="wrapper">
                                <div className="icon">
                                    <PhoneIcon/>
                                </div>
                                <IMaskInput
                                    mask={'+{7} (000) 000-00-00'}
                                    unmask={true}
                                    name='phone'
                                    className="login"
                                    required
                                    onAccept={ (value) => this.props.userStore.setLogin(value) }
                                    placeholder='Номер телефона/Телефон нөмірі'
                                />
                            </div>
                        </label>
                        <label>
                            <p className="label">Пароль/Құпия сөз</p>
                            <div className="wrapper">
                                <div className="icon">
                                    <LockIcon/>
                                </div>
                                <input name='pass'
                                       required
                                       value={this.state.pass}
                                       onChange={this.handleInputChange}
                                       type={(this.state.showPass ? 'text' : 'password')}
                                       placeholder='Введите пароль/Құпия сөзді енгізіңіз'
                                       className="password"
                                />
                                <div className='show' onClick={this.togglePass}>
                                    {this.state.showPass &&
                                    <ShowPassIcon/>
                                    }
                                    {!this.state.showPass &&
                                    <HidePassIcon/>
                                    }
                                </div>
                            </div>
                        </label>
                        <button type='submit' className='btn'>Войти/Кіру</button>
                        <Link to='/restore-pass' className="forgot__pass">
                            Забыли пароль?/Парольді ұмыттыңыз ба?
                        </Link>
                    </form>
                    {/*<div className="eula">*/}
                    {/*    <Link to="/eula">*/}
                    {/*        Пользовательское соглашение*/}
                    {/*    </Link>*/}
                    {/*</div>*/}

                </div>
            </React.Fragment>
        )
    }
}


export default inject('userStore', 'permissionsStore')(observer(Auth));