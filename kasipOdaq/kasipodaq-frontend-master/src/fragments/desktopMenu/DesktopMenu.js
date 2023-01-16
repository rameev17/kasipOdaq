import React, {Component} from 'react'
import { Link,withRouter } from 'react-router-dom'
import {Scrollbars} from "react-custom-scrollbars";
import {ModalAccessDenied, ModalLogout} from "../modals";
import {ReactComponent as LogoIcon} from '../../assets/icons/logo.svg'
import {ReactComponent as LoginIcon} from '../../assets/icons/menu-login.svg'
import {ReactComponent as PersonalAreaIcon} from '../../assets/icons/menu-personal-area.svg'
import {ReactComponent as EnterToUnionIcon} from '../../assets/icons/menu-enter-to-union.svg'
import {ReactComponent as CreateUnionIcon} from '../../assets/icons/menu-create-union.svg'
import {ReactComponent as RequestToFprkIcon} from '../../assets/icons/menu-request-to-fprk.svg'
import {ReactComponent as LawDatabaseIcon} from '../../assets/icons/menu-law-database.svg'
import {ReactComponent as BiotIcon} from '../../assets/icons/menu-biot.svg'
import {ReactComponent as DisputeIcon} from '../../assets/icons/menu-dispute.svg'
import {ReactComponent as EpbIcon} from '../../assets/icons/menu-epb.svg'
import {ReactComponent as AboutUsIcon} from '../../assets/icons/menu-about-us.svg'
import {ReactComponent as PreferencesIcon} from '../../assets/icons/menu-preferences.svg'
import {ReactComponent as ContactsIcon} from '../../assets/icons/menu-contacts.svg'
import {ReactComponent as CloseIcon} from '../../assets/icons/close.svg'
import {ReactComponent as TribuneIcon} from '../../assets/icons/menu-tribune.svg'
import {ReactComponent as ChangeLangIcon} from '../../assets/icons/preferences-change-lang.svg';
import {ReactComponent as LogOutIcon} from '../../assets/icons/preferences-logout.svg'

import './index.scss'
import {inject, observer} from "mobx-react";
import CookieService from "../../services/CookieService";
import {NotificationContainer, NotificationManager} from 'react-notifications';

class DesktopMenu extends Component{

    constructor(props) {
        super(props);

        this.state = {
            accessDenied: false,
            LogoutModalIsOpen: false,
            location: '',
            language: '',
            languageEnter: 'Войти',
            languageCabinet: 'Личный кабинет',
            languageJoinUnion: 'Вступить в профсоюз',
            languageCreateUnion: 'Создать профсоюз',
            languageAppeal: 'Обращение в ФПРК',
            languageTribune: 'Трибуна',
            languageLawDatabase: 'Законодательная база',
            languageBiot: 'БиОТ',
            languageDispute: 'Трудовой спор',
            languageEpb: 'ЭПБ',
            languageAbout: 'О Федерации',
            languageSettings: 'Настройки',
            languageContacts: 'Контакты'
        }

        this.checkAccess = this.checkAccess.bind(this)
        this.closeModal = this.closeModal.bind(this)
        this.enterToUnion = this.enterToUnion.bind(this)
        this.languageRuChange = this.languageRuChange.bind(this)
        this.languageKkChange = this.languageKkChange.bind(this)

    }

    componentDidMount() {
        this.setState({
            location:  this.props.location.pathname
        })

        this.props.toggleMenu({})

        if (CookieService.get('language')){
            this.setState({
                language: CookieService.get('language')
            })
        }else{
            this.setState({
                language: 'ru'
            })
        }

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
    }

    checkAccess(e) {
        e.preventDefault()

        this.props.toggleMenu({})
        this.setState({accessDenied: true})
    }

    closeModal() {
        this.setState({
            accessDenied: false,
            LogoutModalIsOpen: false,
        })

        if (!CookieService.get('token')){
            this.props.history.push('/auth')
        }
    }

    enterToUnion(){
        this.setState({
            accessDenied: false,
            LogoutModalIsOpen: false,
        })

        if (!CookieService.get('token')){
            this.props.history.push('/auth')
        }else{
            this.props.history.push('/enter-to-union')
        }
    }

    languageRuChange(){
        CookieService.create('language', 'ru')
        this.props.userStore.getLanguage(CookieService.get('language'))
        this.setState({
            language: 'ru'
        })
    }

    languageKkChange(){
        CookieService.create('language', 'kk')
        this.props.userStore.getLanguage(CookieService.get('language'))
        this.setState({
            language: 'kk'
        })
    }

    render(){

        return(
            <React.Fragment>

                <div className={"desktop-menu" + (this.props.isActive ? ' is-active' : '')}>
                    <Scrollbars style={{ width: 240, height: '100%', minHeight: 500 }}
                                {...this.props}>
                        <div>
                            <Link to={'/news'} className="logo" style={{ display: 'flex' }}>
                                <LogoIcon/>
                            </Link>
                            <ul className="menu">

                                {
                                    this.props.permissionsStore.hasPermission('user', 'authorize') &&
                                    <li className={'link' + (this.state.location.indexOf('/auth') !== -1 ? (' is-active') : (''))}>
                                        <Link to={'/auth'} className='login'>
                                            <div className="icon">
                                                <LoginIcon/>
                                            </div>
                                            <span>{this.props.userStore.languageList["Войти"] || 'Войти'}</span>
                                        </Link>
                                    </li>
                                }

                                {
                                    this.props.permissionsStore.hasPermission('user', 'get_person') &&
                                    <li className={'link' + (this.state.location.indexOf('/cabinet') !== -1 ? (' is-active') : ('')) }>
                                        <Link to={'/cabinet'} className='login'>
                                            <div className="icon">
                                                <PersonalAreaIcon/>
                                            </div>
                                            <span>{this.props.userStore.languageList["Личный кабинет"] || 'Личный кабинет'}</span>
                                        </Link>
                                    </li>
                                }

                                {
                                    this.props.permissionsStore.hasPermission('union', 'join') &&
                                        <li className={'link' + (this.state.location.indexOf('/enter-to-union') !== -1 ? (' is-active') : ('')) + (this.props.permissionsStore.hasPermission('union', 'join') ? '' : ' access-denied')}>
                                            <Link onClick={this.props.permissionsStore.hasPermission('union', 'join') ? () => { this.props.history.push('/enter-to-union') } : this.checkAccess} className='enter-to-union'>
                                                <div className="icon">
                                                    <EnterToUnionIcon/>
                                                </div>
                                                <span>{this.props.userStore.languageList["Вступить в профсоюз"] || 'Вступить в профсоюз'}</span>
                                            </Link>
                                        </li>
                                }

                                {
                                    this.props.permissionsStore.hasPermission('union', 'create') &&
                                        <li className={'link' + (this.state.location.indexOf('/create-union') !== -1 ? (' is-active') : ('')) + (this.props.permissionsStore.hasPermission('union', 'create') ? '' : ' access-denied')}>
                                            <Link onClick={this.props.permissionsStore.hasPermission('union', 'create') ? () => { this.props.history.push('/create-union') } : this.checkAccess} className='create-union'>
                                                <div className="icon">
                                                    <CreateUnionIcon/>
                                                </div>
                                                <span>{this.props.userStore.languageList["Создать профсоюз"] || 'Создать профсоюз'}</span>
                                            </Link>
                                        </li>
                                }

                                <li className={'link' + (this.state.location.indexOf('/request-to-fprk') !== -1 ? (' is-active') : ('')) + (this.props.permissionsStore.hasPermission('appeal', 'get_list') ? '' : ' access-denied')}>
                                    <Link onClick={this.props.permissionsStore.hasPermission('appeal', 'get_list') ? () => { this.props.history.push('/request-to-fprk') } : this.checkAccess} className='request-to-fprk'>
                                        <div className="icon">
                                            <RequestToFprkIcon/>
                                        </div>
                                        <span>{this.props.userStore.languageList["Обращения"] || 'Обращения'}</span>
                                    </Link>
                                </li>

                                <li className={'link' + (this.state.location.indexOf('/tribune') !== -1 ? (' is-active') : ('')) + (this.props.permissionsStore.hasPermission('revision', 'get_list') ? '' : ' access-denied')}>
                                    <Link onClick={this.props.permissionsStore.hasPermission('revision', 'get_list') ? () => { this.props.history.push('/tribune') } : this.checkAccess}  className='tribune'>
                                        <div className="icon">
                                            <TribuneIcon/>
                                        </div>
                                        <span>{this.props.userStore.languageList["Трибуна"] || 'Трибуна'}</span>
                                    </Link>
                                </li>

                                <li className={'link' + (this.state.location.indexOf('/law-database') !== -1 ? (' is-active') : ('')) }>
                                    <Link to={'/law-database'} className='law-database'>
                                        <div className="icon">
                                            <LawDatabaseIcon/>
                                        </div>
                                        <span>{this.props.userStore.languageList["Законодательная база"] || 'Законодательная база'}</span>
                                    </Link>
                                </li>

                                <li className={'link' + (this.state.location.indexOf('/biot') !== -1 ? (' is-active') : (''))  + (this.props.permissionsStore.hasPermission('order', 'get_list') ? '' : ' access-denied')}>
                                    <Link onClick={this.props.permissionsStore.hasPermission('order', 'get_list') ? () => { this.props.history.push('/biot') } : this.checkAccess} className='biot'>
                                        <div className="icon">
                                            <BiotIcon/>
                                        </div>
                                        <span>{this.props.userStore.languageList["БиОТ"] || 'БиОТ'}</span>
                                    </Link>
                                </li>

                                <li className={'link' + (this.state.location.indexOf('/dispute') !== -1 ? (' is-active') : ('')) + (this.props.permissionsStore.hasPermission('dispute', 'create') ? '' : ' access-denied')}>
                                    <Link onClick={this.props.permissionsStore.hasPermission('dispute', 'get_list') ? () => { this.props.history.push('/dispute') } : this.checkAccess} className='dispute'>
                                        <div className="icon">
                                            <DisputeIcon/>
                                        </div>
                                        <span>{this.props.userStore.languageList["Трудовой спор"] || 'Трудовой спор'}</span>
                                    </Link>
                                </li>

                                <li className={'link' + (this.state.location.indexOf('/epb') !== -1 ? (' is-active') : ('')) }>
                                    <Link to={'/epb'} className='epb'>
                                        <div className="icon">
                                            <EpbIcon/>
                                        </div>
                                        <span>{this.props.userStore.languageList["ЭПБ"] || 'ЭПБ'}</span>
                                    </Link>
                                </li>

                                <li className={'link' + (this.state.location.indexOf('/about-us') !== -1 ? (' is-active') : ('')) + (this.props.permissionsStore.hasPermission('article', 'get_by_union_id') ? '' : ' access-denied')}>
                                    <Link onClick={this.props.permissionsStore.hasPermission('article', 'get_by_union_id') ? () => { this.props.history.push('/about-us') } : this.checkAccess} className='about-us'>
                                        <div className="icon">
                                            <AboutUsIcon/>
                                        </div>
                                        <span>{this.props.userStore.languageList["О Федерации"] || 'О Федерации'}</span>
                                    </Link>
                                </li>
                                {
                                    <li className={'link' + (this.state.location.indexOf('/preferences') !== -1 ? (' is-active') : (''))}>
                                        <Link to='/preferences' className='preferences'>
                                            <div className="icon">
                                                <PreferencesIcon/>
                                            </div>
                                            <span>{this.props.userStore.languageList["Настройки"] || 'Настройки'}</span>
                                        </Link>
                                    </li>
                                }
                                {
                                    this.props.permissionsStore.hasPermission('article', 'get_by_union_id') &&
                                    <li className={'link' + (this.state.location.indexOf('/contacts') !== -1 ? (' is-active') : (''))  + (this.props.permissionsStore.hasPermission('article', 'get_by_union_id') ? '' : ' access-denied')}>
                                        <Link onClick={this.props.permissionsStore.hasPermission('article', 'get_by_union_id') ? () => { this.props.history.push('/contacts') } : this.checkAccess}  className='preferences'>
                                            <div className="icon">
                                                <ContactsIcon/>
                                            </div>
                                            <span>{this.props.userStore.languageList["Контакты"] || 'Контакты'}</span>
                                        </Link>
                                    </li>
                                }
                                {/*{*/}
                                {/*    CookieService.get('token') &&*/}
                                {/*    <li className={'link'}>*/}
                                {/*        <Link onClick={() => { this.setState({ LogoutModalIsOpen: true }) }} className='preferences'>*/}
                                {/*            <div className="icon">*/}
                                {/*                <LogOutIcon/>*/}
                                {/*            </div>*/}
                                {/*            <span>{this.props.userStore.languageList["Выйти"] || 'Выйти'}</span>*/}
                                {/*        </Link>*/}
                                {/*    </li>*/}
                                {/*}*/}
                                <li className={'link' + (this.state.location.indexOf('/contacts') !== -1 ? (' is-active') : (''))  + (this.props.permissionsStore.hasPermission('article', 'get_by_union_id') ? '' : ' access-denied')}>
                                    {/*<div className="icon">*/}
                                    {/*    <ChangeLangIcon/>*/}
                                    {/*</div>*/}
                                    <div className={'language-link'}>
                                        <div style={{ display: 'flex' }}>
                                            <p onClick={this.languageRuChange} style={{ backgroundColor: this.state.language == 'ru' ? '#00aeef' : '', border: this.state.language == 'ru' ? '1px solid #00aeef' : '' }}>РУ</p>
                                            <p onClick={this.languageKkChange} style={{ backgroundColor: this.state.language == 'kk' ? '#00aeef' : '', border: this.state.language == 'kk' ? '1px solid #00aeef' : '' }}>КЗ</p>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                            <div className="close-btn" onClick={this.props.toggleMenu}>
                                <CloseIcon/>
                            </div>
                        </div>
                    </Scrollbars>
                </div>

                {
                    this.state.accessDenied &&
                    <ModalAccessDenied
                        closeModal={this.closeModal}
                        enterToUnion={this.enterToUnion}
                    />
                }

                {
                    this.state.LogoutModalIsOpen &&
                    <ModalLogout
                        closeModal={this.closeModal}
                        {...this.props}
                    />
                }

            </React.Fragment>
        )
    }
}

export default withRouter(inject('permissionsStore', 'userStore')(observer(DesktopMenu)));
