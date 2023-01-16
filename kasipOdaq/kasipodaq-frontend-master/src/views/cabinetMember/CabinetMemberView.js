import React, {Component} from 'react'
import Layout from "../../fragments/layout/Layout";
import {Switch, Route, Link} from 'react-router-dom'

import {IMaskInput} from 'react-imask'

import {ReactComponent as EditProfileIcon} from '../../assets/icons/edit-profile.svg'
import {ReactComponent as CameraIcon} from '../../assets/icons/camera.svg'
import {ReactComponent as Address} from '../../assets/icons/geo.svg';
import {ReactComponent as RemoveIcon} from '../../assets/icons/delete.svg'
import {ReactComponent as LeftArrowIcon} from '../../assets/icons/arrow.svg'

import './style.scss'
import {inject, observer} from "mobx-react";
import Preloader from "../../fragments/preloader/Preloader";
import {NotificationContainer, NotificationManager} from 'react-notifications';
import InputMask from "react-input-mask";
import CookieService from "../../services/CookieService";
import ChildrenView from "./ChildrenView";
import ChildrenEditView from "./ChildrenEditView";

const dateFormat = require('dateformat')

class CabinetMember extends Component {
    constructor(props){
        super(props)

        this.state = {
            profile: {},
            member: {},
            primaryUnion: {},
            industryUnion: {}
        }

    }

    render() {

        return (
            <Layout title='Личный кабинет'>
                <Switch>
                    <Route exact path='/cabinet' render={(props) => <Profile {...props}
                                                                             primaryUnion={this.state.primaryUnion}
                                                                             industryUnion={this.state.industryUnion}
                                                                             member={this.state.member}
                                                                             profile={this.state.profile}/>}/>
                    <Route exact path='/cabinet/edit' render={(props) => <EditProfile {...props}
                                                                                      profile={this.state.profile}/>}/>
                    <Route exact path='/cabinet/children' render={(props) => <ChildrenView {...props} />}/>
                    <Route exact path='/cabinet/children/:id' render={(props) => <ChildrenEditView {...props} />}/>
                    <Route exact path='/cabinet/notifications'/>
                </Switch>
            </Layout>
        )
    }
}

const Profile = inject('userStore', 'permissionsStore')(observer(class Profile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            img: '',
            preloader: true,
        }
    }

    componentDidMount() {
        this.props.userStore.profileInfo( () => {
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
        })
    }

    render() {

        return (
            <div className="plate-wrapper plate-wrapper__height">
                {
                    this.state.preloader &&
                        <Preloader/>
                }
                <NotificationContainer/>

                <div className='profile'>
                    <div className="main">
                        <div className="img"
                             style={{background: (this.props.userStore.profile.picture_uri ? `url(${this.props.userStore.profile.picture_uri}) no-repeat center center/ cover` : '' )}}
                        >
                            {
                                !this.props.userStore.profile.picture_uri &&
                                <span>{ `${this.props.userStore.profile.first_name[0]} ${this.props.userStore.profile.family_name[0]}` }</span>
                            }

                        </div>
                        <div className="name">{ `${this.props.userStore.profile.first_name} ${this.props.userStore.profile.family_name}  ${this.props.userStore.profile.patronymic !== null ? this.props.userStore.profile.patronymic : '' }` }</div>
                        <div className="birthday">{ this.props.userStore.profile.birthday }</div>
                        <Link to='/cabinet/edit' className="edit-profile">
                            <EditProfileIcon/>
                        </Link>
                    </div>
                    <div className="personal">
                        <label>{this.props.userStore.languageList["Личные данные"] || 'Личные данные'}</label>
                        <div className="phone field">{ this.props.userStore.profile.phone }</div>
                        {
                            this.props.userStore.profile.email &&
                                <div className="mail field">{ this.props.userStore.profile.email }</div>
                        }
                        {
                            this.props.userStore.profile.job_position &&
                            <div className={'field'}>{this.props.userStore.languageList["Должность"] || 'Должность'}: { this.props.userStore.profile.job_position }</div>
                        }
                        {
                            this.props.userStore.profile.physical_address &&
                            <div className={'field'}><Address/> &nbsp; { this.props.userStore.profile.physical_address }</div>
                        }
                    </div>
                    {
                        this.props.userStore.profile.union !== null &&
                        <React.Fragment>
                            {
                                this.props.userStore.profile.union.industry &&
                                <div className="organization">
                                    <label>{this.props.userStore.languageList["Отраслевой профсоюз"] || 'Отраслевой профсоюз'}</label>
                                    <div className="name field">
                                        {this.props.userStore.profile.union.industry.name}
                                        {/*<span>(Председатель)</span>*/}
                                    </div>
                                </div>
                            }
                            {
                                this.props.userStore.profile.union.association_union &&
                                <div className="union">
                                    <label>{this.props.userStore.languageList["ТОП"] || 'ТОП'}</label>
                                    <div className="name field">{this.props.userStore.profile.union.association_union?.name}</div>
                                </div>
                            }
                            {
                                this.props.userStore.profile.union.root_union &&
                                <div className="union">
                                    <label>{this.props.userStore.languageList["Профсоюзное объединение"] || 'Профоюзное объединение'}</label>
                                    <div className="name field">{this.props.userStore.profile.union.root_union.name}</div>
                                </div>
                            }
                                <div className="union">
                                    <label>{this.props.userStore.languageList["Филиал"] || 'Филиал'}</label>
                                    <div className="name field">{this.props.userStore.profile.union.name}</div>
                                </div>

                            <div className="since">
                                <label>{this.props.userStore.languageList["В системе с"] || 'В системе с'}</label>
                                <div className="date field">{ dateFormat(this.props.userStore.profile.union.join_date, 'dd.mm.yyyy') }</div>
                            </div>
                        </React.Fragment>
                    }

                    {/*<React.Fragment>*/}
                    {/*    <div className="request">*/}
                    {/*        <label>Ваша заявка на рассмотрении</label>*/}
                    {/*    </div>*/}
                    {/*</React.Fragment>*/}

                </div>
            </div>
        )
    }
}))

const EditProfile = inject('userStore', 'permissionsStore')(observer(class EditProfile extends Component {

    constructor(props) {
        super(props);

        this.state = {
            preloader: true,
            birthday: null,
        }

        this.nameRef = React.createRef()
        this.familyNameRef = React.createRef()
        this.patronymicRef = React.createRef()
        this.phoneRef = React.createRef()
        this.mailRef = React.createRef()
        this.avatarUploadRef = React.createRef()
        this.birthdayRef = React.createRef()
        this.sexRef = React.createRef()
        this.addressRef = React.createRef()

        this.updateProfile = this.updateProfile.bind(this)
        this.avatarUpload = this.avatarUpload.bind(this)
        this.birthdayInputChange = this.birthdayInputChange.bind(this)
        this.deletePicture = this.deletePicture.bind(this)
    }

    loadPage(){
        this.props.userStore.profileInfo( () => {
            this.setState({
                preloader: false,
                birthday: this.props.userStore.profile.birthday
            })
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
        })
    }

    componentDidMount() {
        this.loadPage()
    }

    updateProfile(e){
        e.preventDefault()
        this.setState({ preloader: true })

        let birthday = this.birthdayRef.current.value

        if (this.props.userStore.avatarFile) {
            this.props.userStore.uploadAvatarFile(data => {
                this.props.userStore.updateProfileInfo(
                    this.nameRef.current.value,
                    this.familyNameRef.current.value,
                    this.patronymicRef.current.value,
                    this.sexRef.current.value,
                    this.mailRef.current.value,
                    this.addressRef.current.value,
                    () => {
                        this.setState({ preloader: false })
                        this.props.history.push('/cabinet')
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
                    }
                )
            })
        }else{
            this.props.userStore.updateProfileInfo(
                this.nameRef.current.value,
                this.familyNameRef.current.value,
                this.patronymicRef.current.value,
                this.sexRef.current.value,
                this.mailRef.current.value,
                this.addressRef.current.value,
                () => {
                    this.setState({ preloader: false })
                    this.props.history.push('/cabinet')
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
                }
            )
        }

    }

    avatarUpload(){
        this.props.userStore.avatarFile = this.avatarUploadRef.current.files[0]
    }

    birthdayInputChange(event) {
        const date = event.target.value.replace('_', '')

        this.setState({
            birthday: date
        }, () => {
            this.props.userStore.birthday = this.state.birthday
        })
    }

    convertDate() {
        let date = null;

        try {
            date = dateFormat(this.props.userStore.birthday, 'dd.mm.yyyy');
        } catch {
            date = this.props.userStore.birthday
        }

        return date
    }

    deletePicture(){
        this.props.userStore.deletePictureProfile(
            () => {
                this.loadPage()
            }, response => {
                if (Array.isArray(response.data)) {
                    response.data.forEach(error => {
                        this.setState({ preloader: false })
                        NotificationManager.error(error.message)
                    })
                } else {
                    this.setState({ preloader: false })
                    NotificationManager.error(response.message)
                }
                if (response.status == 401){
                    this.setState({ preloader: false })
                    this.props.history.push('/')
                }
            }
        )
    }

    render() {
        return (
            <div className="plate-wrapper plate-wrapper__height">
                {
                    this.state.preloader &&
                    <Preloader/>
                }

                <NotificationContainer/>

                <div style={{ marginBottom: 16 }}>
                    <Link style={{ color: '#0052A4' }} to={'/cabinet'}>Личный кабинет</Link>
                    <span> -> </span>
                    <Link style={{ color: '#0052A4', borderBottom: '1px solid #0052A4' }}>Редактирование личных данных</Link>
                </div>

                <div className='edit-profile'>
                    <div className="main">
                        <div className="img__wrapper">
                            {
                                this.props.userStore.avatarFile ?
                                    <div className="img"
                                         style={{background: (this.props.userStore.avatarFile ? `url(${URL.createObjectURL(this.props.userStore.avatarFile)}) no-repeat center center/ cover` : '' )}}
                                    >
                                        {
                                            !this.props.userStore.avatarFile &&
                                            <span>{ `${this.props.userStore.profile.first_name[0]} ${this.props.userStore.profile.family_name[0]}` }</span>
                                        }
                                    </div>
                                    :
                                    <div className="img"
                                         style={{background: (this.props.userStore.profile.picture_uri ? `url(${this.props.userStore.profile.picture_uri}) no-repeat center center/ cover` : '' )}}
                                    >
                                        {
                                            !this.props.userStore.profile.picture_uri &&
                                            <span>{ `${this.props.userStore.profile.first_name[0]} ${this.props.userStore.profile.family_name[0]}` }</span>
                                        }
                                    </div>
                            }

                            <label>
                                <div className="upload-image-btn">
                                    <CameraIcon/>
                                </div>
                                <input type="file"
                                       accept=".jpg, .jpeg, .png"
                                       onChange={this.avatarUpload}
                                       ref={this.avatarUploadRef}
                                />
                            </label>

                            <div className="remove-icon" onClick={this.deletePicture}>
                                <RemoveIcon/>
                            </div>

                        </div>
                        <form className='upload-image form' onSubmit={this.updateProfile}>


                            <div className="label">{this.props.userStore.languageList["Ф.И.О."] || 'Ф.И.О.'}</div>
                            <div className="field first_name">
                                <label>{this.props.userStore.languageList["Имя"] || 'Имя'}*</label>
                                <input type="text"
                                       ref={this.nameRef}
                                       defaultValue={this.props.userStore.profile.first_name}
                                       placeholder={this.props.userStore.languageList["Заполните поле"] || 'Заполните поле'}
                                       required
                                       name='first_name'/>
                            </div>
                            <div className="field last_name">
                                <label>{this.props.userStore.languageList["Фамилия"] || 'Фамилия'}*</label>
                                <input type="text"
                                       ref={this.familyNameRef}
                                       defaultValue={this.props.userStore.profile.family_name}
                                       placeholder={this.props.userStore.languageList["Заполните поле"] || 'Заполните поле'}
                                       required
                                       name='last_name'/>
                            </div>
                            <div className="field">
                                <label>{this.props.userStore.languageList["Отчество"] || 'Отчество'}</label>
                                <input type="text"
                                       ref={this.patronymicRef}
                                       defaultValue={this.props.userStore.profile.patronymic}
                                       placeholder={this.props.userStore.languageList["Отчество"] || 'Отчество'}
                                       name='middle_name'/>
                            </div>
                            <div className="field second_name">
                                <label>{this.props.userStore.languageList["Дата рождения"] || 'Дата рождения'}*</label>
                                <InputMask
                                    mask="99-99-9999"
                                    value={this.state.birthday}
                                    ref={this.birthdayRef}
                                    required
                                    onChange={
                                        this.birthdayInputChange
                                    }
                                />
                            </div>

                            <div className="field second_name">
                                <label>{this.props.userStore.languageList["Пол"] || 'Пол'}*</label>
                                <select style={{ width: '100%', border: '1px solid #E4E8F0', padding: '10px', borderRadius: '5px', fontSize: '16px', color: '#cfd2dc' }}
                                        ref={this.sexRef}
                                        name="industry"
                                        onChange={(e) => { this.props.userStore.sex = e.target.value }}
                                        value={this.props.userStore.sex}
                                        required
                                >
                                    <option value=''>{this.props.userStore.languageList["Выберите пол"] || 'Выберите пол'}</option>
                                    <option value='0'>{this.props.userStore.languageList["Женский"] || 'Женский'}</option>
                                    <option value='1'>{this.props.userStore.languageList["Мужской"] || 'Мужской'}</option>

                                </select>
                            </div>

                            <div className="label">{this.props.userStore.languageList["Контакты"] || 'Контакты'}</div>
                            <div className="field address">
                                <label>{this.props.userStore.languageList["Адрес проживания"] || 'Адрес проживания'}</label>
                                <input type="text"
                                       name="address"
                                       ref={this.addressRef}
                                       defaultValue={this.props.userStore.profile.physical_address}
                                />
                            </div>
                            <div className="field phone">
                                <label>{this.props.userStore.languageList["Телефон"] || 'Телефон'}</label>
                                <input type="phone"
                                       name="phone"
                                       ref={this.phoneRef}
                                       defaultValue={this.props.userStore.profile.phone}
                                       placeholder='+7 (___) ___-__-__'
                                       disabled
                                />
                            </div>
                            <div className="field email">
                                <label>{this.props.userStore.languageList["E-mail"] || 'E-mail'}</label>
                                <input type="text"
                                       ref={this.mailRef}
                                       defaultValue={this.props.userStore.profile.email}
                                       placeholder={this.props.userStore.languageList["Ваш E-mail"] || 'Ваш E-mail'}
                                       name="email"
                                />
                            </div>
                            <div className="field email" >
                                <a href="/cabinet/children" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #E4E8F0", paddingBottom: 16 }}>
                                    <p style={{ color: "#2E384D" }}>{this.props.userStore.languageList["Дети"] || 'Дети'}</p>
                                    <div className="icon">
                                        <LeftArrowIcon/>
                                    </div>
                                </a>
                            </div>
                            <div className="btns">
                                <button type="submit">{this.props.userStore.languageList["Сохранить"] || 'Сохранить'}</button>
                                <button onClick={() => { this.props.history.push('/cabinet') }}>{this.props.userStore.languageList["Отменить"] || 'Отменить'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}))

class Notifications extends Component {

    state = {
        notifications: []
    }

    componentDidMount() {

        const notifications = [
            {
                title: 'Как правильно оформить заявление на выход из профсоюза?',
                active: true,
                from: 'tribune'
            }
        ]
        this.setState({notifications: notifications})
    }

    render() {

        return (
            <div className="plate-wrapper plate-wrapper__height">
                <div className='notifications_page'>
                    <ul>
                        {this.state.notifications.map((item, index) => (
                            <li key={index}>
                                <Item item={item}/>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        )
    }
}

class Item extends Component {

    render() {

        return (
            <Link to={`/1`}
                  className={('notification__link is-active')}>item.title</Link>
        )
    }
}

export default inject('userStore', 'permissionsStore')(observer(CabinetMember));