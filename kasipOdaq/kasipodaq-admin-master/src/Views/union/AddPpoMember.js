import React, {Component} from 'react';
import Calendar from 'react-calendar'
import * as dateFns from 'date-fns'
import { Link } from "react-router-dom"

import {ReactComponent as CameraIcon} from '../../assets/icons/camera.svg'
import {ReactComponent as RemoveIcon} from "../../assets/icons/remove.svg";
import {withRouter} from "react-router-dom";
import {inject, observer} from "mobx-react";
import Preloader from "../../fragments/preloader/Preloader";
import {NotificationContainer, NotificationManager} from "react-notifications";
import InputMask from "react-input-mask"
import ChildrenMember from "./ChildrenMember";
import {IMaskInput} from "react-imask";

class AddPpoMember extends Component {

    constructor(props) {
        super(props);

        this.state = {
            img: '',
            preloader: false,
            sex: null,
        }

        this.fileInput = React.createRef()
        this.firstNameRef = React.createRef()
        this.familyNameRef = React.createRef()
        this.patronymicRef = React.createRef()
        this.birthdayRef = React.createRef()
        this.iinRef = React.createRef()
        this.addressRef = React.createRef()
        this.phoneRef = React.createRef()
        this.mailRef = React.createRef()
        this.jobRef = React.createRef()

        this.createMember = this.createMember.bind(this)
        this.removePicture = this.removePicture.bind(this)
        this.fileUpload = this.fileUpload.bind(this)
    }

    componentDidMount() {

    }

    removePicture(){
        this.props.unionStore.fileMember = null
        this.fileInput.current.value = null
        this.setState({ img: '' })
    }

    fileUpload(){
        let file = this.fileInput.current.files[0]

        this.props.unionStore.fileMember = file

        this.setState({
            img: 'with-image'
        })
    }

    createMember(event){
        event.preventDefault()

        if (this.state.sex == null){
            NotificationManager.error("Выберите пол")
        }else if (this.iinRef.current.value.length !== 12){
            NotificationManager.error("ИИН должен состоять из 12 цифр")
        }else{
            this.setState({ preloader: true })
            if (this.props.unionStore.fileMember){
                this.props.unionStore.uploadFileMember(data => {
                    this.props.unionStore.createMember(
                        this.firstNameRef.current.value,
                        this.familyNameRef.current.value,
                        this.patronymicRef.current.value,
                        this.state.birthday,
                        this.state.sex,
                        this.iinRef.current.value,
                        this.addressRef.current.value,
                        this.phoneRef.current.value,
                        this.mailRef.current.value,
                        this.jobRef.current.value,
                        () => {
                            this.setState({ preloader: false })
                            NotificationManager.success("Член профсоюза успешно добавлен")
                            this.props.history.goBack()
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
                                this.setState({ preloader: false })
                                this.props.history.push('/')
                            }
                        }
                    )
                })
            }else{
                this.props.unionStore.createMember(
                    this.firstNameRef.current.value,
                    this.familyNameRef.current.value,
                    this.patronymicRef.current.value,
                    this.state.birthday,
                    this.state.sex,
                    this.iinRef.current.value,
                    this.addressRef.current.value,
                    this.phoneRef.current.value,
                    this.mailRef.current.value,
                    this.jobRef.current.value,
                    () => {
                        this.setState({ preloader: false })
                        NotificationManager.success("Член профсоюза успешно добавлен")
                        this.props.history.goBack()
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
                            this.setState({ preloader: false })
                            this.props.history.push('/')
                        }
                    }
                )
            }
        }
    }

    render() {

        return (
            <div className="profile">
                {
                    this.state.preloader &&
                    <Preloader/>
                }

                <NotificationContainer/>

                <div className="toggle-lang">
                    {/*<div className="lang ru">Информация на русском языке</div>*/}
                    {/*<div className="lang kz">Информация на казахском языке</div>*/}
                </div>
                <form onSubmit={this.createMember}>
                    <div className="person__wrapper">
                        <div className="add__person data">
                            <p className='subtitle'>
                                {this.props.userStore.languageList["Личные данные"] || 'Личные данные'}
                            </p>
                            <div className="container top">
                                <div className="col-left">
                                    <div className="img__wrapper">
                                        <div className={`img ${(this.state.img ? 'with-image' : 'default')}`}
                                             style={{background: (this.state.img ? `url(${URL.createObjectURL(this.props.unionStore.fileMember)}) no-repeat center center/ cover` : '')}}
                                             onClick={this.handleSetImage}>
                                            <div className="remove-icon" onClick={this.removePicture}>
                                                <RemoveIcon/>
                                            </div>
                                        </div>
                                        <label>
                                            <div className='button' onClick={this.handleSetImage}>
                                                <div className="icon">
                                                    <CameraIcon/>
                                                </div>
                                                {this.props.userStore.languageList["Загрузить фото"] || 'Загрузить фото'}
                                            </div>
                                            <input type="file"
                                                   onChange={this.fileUpload}
                                                   ref={this.fileInput}
                                                   name="photo"/>
                                        </label>
                                    </div>
                                    <div className='label__wrapper'>
                                        <label>
                                            <span>{this.props.userStore.languageList["Имя"] || 'Имя'}</span>
                                            <input type="text"
                                                   ref={this.firstNameRef}
                                                   required
                                                   name='firstName'
                                                   placeholder={this.props.userStore.languageList["Имя"] || 'Имя'}
                                            />
                                        </label>
                                        <label>
                                            <span>{this.props.userStore.languageList["Фамилия"] || 'Фамилия'}</span>
                                            <input type="text"
                                                   ref={this.familyNameRef}
                                                   required
                                                   name='familyName'
                                                   placeholder={this.props.userStore.languageList["Фамилия"] || 'Фамилия'}
                                            />
                                        </label>
                                        <label>
                                            <span>{this.props.userStore.languageList["Отчество"] || 'Отчество'}</span>
                                            <input type="text"
                                                   ref={this.patronymicRef}
                                                   name='patronymic'
                                                   placeholder={this.props.userStore.languageList["Отчество"] || 'Отчество'}
                                            />
                                        </label>
                                    </div>
                                </div>
                                <div className="col-right">
                                    <label>
                                        <span>{this.props.userStore.languageList["Дата рождения"] || 'Дата рождения'}</span>
                                        <InputMask
                                            mask="99.99.9999"
                                            value={this.state.birthday}
                                            ref={this.birthdayRef}
                                            required
                                            onChange={(event) => this.setState({
                                                birthday: event.target.value.replace('_', '')
                                            }) }
                                        />
                                    </label>
                                    <label>
                                        <span>{this.props.userStore.languageList["ИИН"] || 'ИИН'}</span>
                                        <input type="number"
                                               ref={this.iinRef}
                                               name='iin'
                                               placeholder={this.props.userStore.languageList["ИИН"] || 'ИИН'}
                                        />
                                    </label>
                                    <div className="gender">
                                        <span>{this.props.userStore.languageList["Пол"] || 'Пол'}</span>
                                        <div className="gender__radios">
                                            <label>
                                                <input type="radio"
                                                       name='gender'
                                                       value={this.state.sex}
                                                       onChange={() => this.setState({ sex: 1 })}
                                                />
                                                <span className='radio'/>
                                                <div className="text">
                                                    {this.props.userStore.languageList["Мужской"] || 'Мужской'}
                                                </div>
                                            </label>
                                            <label>
                                                <input type="radio"
                                                       name='gender'
                                                       value={this.state.sex}
                                                       onChange={() => this.setState({ sex: 0 })}
                                                />
                                                <span className='radio'/>
                                                <div className="text">
                                                    {this.props.userStore.languageList["Женский"] || 'Женский'}
                                                </div>
                                            </label>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div className="container bottom">
                                <div className="col-left">
                                    <p className='subtitle'>
                                        {this.props.userStore.languageList["Контактные данные"] || 'Контактные данные'}
                                    </p>
                                    <label>
                                        <span>{this.props.userStore.languageList["Адрес"] || 'Адрес'}</span>
                                        <input type="text" name='address'
                                               required
                                               ref={this.addressRef}
                                               placeholder='Адрес'/>
                                    </label>
                                    <label>
                                        <span>{this.props.userStore.languageList["Телефон"] || 'Телефон'}</span>
                                        <IMaskInput
                                            mask={'+{7} (000) 000-00-00'}
                                            unmask={true}
                                            name='phone'
                                            placeholder='+7 (___) ___-__-__'
                                            ref={this.phoneRef}
                                            onAccept={(value) => this.phoneRef.current.value = value}
                                            required
                                        />
                                    </label>
                                    <label>
                                        <span>{this.props.userStore.languageList["E-mail"] || 'E-mail'}</span>
                                        <input type="email" name='email'
                                               ref={this.mailRef}
                                               placeholder='E-mail'/>
                                    </label>
                                </div>
                                <div className="col-right">
                                    <p className='subtitle'>
                                        {this.props.userStore.languageList["Должностные данные"] || 'Должностные данные'}
                                    </p>
                                    <label>
                                        <span>{this.props.userStore.languageList["Должность"] || 'Должность'}</span>
                                        <input type="text"
                                               ref={this.jobRef}
                                               required
                                               name='post'
                                               placeholder={this.props.userStore.languageList["Должность"] || 'Должность'}
                                        />
                                    </label>
                                    <div className="wrapper">
                                        {/*<label>*/}
                                        {/*    <span>В профсоюзе с</span>*/}
                                        {/*    <input type="text" placeholder='В профсоюзе с'/>*/}
                                        {/*</label>*/}
                                        {/*<div className="remove">*/}
                                        {/*    <div className="btn-action">*/}
                                        {/*        <div className="icon">*/}
                                        {/*            <RemoveIcon/>*/}
                                        {/*        </div>*/}
                                        {/*        <span>Исключить</span>*/}
                                        {/*    </div>*/}
                                        {/*</div>*/}
                                    </div>
                                    {/*<div className='checkbox'>*/}
                                    {/*    <input type="checkbox" checked={this.state.isAdmin}*/}
                                    {/*           onClick={this.handleCheckAdmin}*/}
                                    {/*           id="admin"*/}
                                    {/*    />*/}
                                    {/*    <label for="admin">*/}
                                    {/*        <div>Права админа</div>*/}
                                    {/*    </label>*/}
                                    {/*</div>*/}
                                </div>
                            </div>
                        </div>
                        <div className="btns">
                            <button className="cancel" onClick={() => this.props.history.goBack()}>{this.props.userStore.languageList["Отменить"] || 'Отменить'}</button>
                            <button className="save" type="submit">{this.props.userStore.languageList["Сохранить"] || 'Сохранить'}</button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

export default withRouter(inject('unionStore', 'permissionsStore', 'userStore')(observer(AddPpoMember)));