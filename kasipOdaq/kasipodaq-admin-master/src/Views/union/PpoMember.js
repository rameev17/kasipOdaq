import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import Calendar from 'react-calendar'
import * as dateFns from 'date-fns'
import { format } from 'date-fns';
import {IMaskInput} from 'react-imask';

import {ReactComponent as CameraIcon} from '../../assets/icons/camera.svg'
import {ReactComponent as RemoveIcon} from "../../assets/icons/remove.svg";
import {inject, observer} from "mobx-react";
import Preloader from "../../fragments/preloader/Preloader";
import {NotificationContainer, NotificationManager} from "react-notifications";
import Modal from "react-modal";
import CookieService from "../../services/CookieService";

class PpoMember extends Component {

    constructor(props){
        super(props);

        this.state = {
            preloader: true,
            sex: null,
            status: null,
            newStatusChecked: false,
            modalDialogView: false,
            deleteMemberDialog: false,
            memberId: null,
        };

        this.firstNameRef = React.createRef();
        this.familyNameRef = React.createRef();
        this.patronymicRef = React.createRef();
        this.birthdayRef = React.createRef();
        this.iinRef = React.createRef();
        this.addressRef = React.createRef();
        this.phoneRef = React.createRef();
        this.mailRef = React.createRef();
        this.jobPositionRef = React.createRef();
        this.fileInput = React.createRef();
        this.deleteRef = React.createRef();

        this.editMember = this.editMember.bind(this);
        this.loadPage = this.loadPage.bind(this);
        this.deleteMemberDialog = this.deleteMemberDialog.bind(this);
        this.excludeMember = this.excludeMember.bind(this);
        this.fileUpload = this.fileUpload.bind(this);
        this.deletePicture = this.deletePicture.bind(this);
        this.statusModalOpen = this.statusModalOpen.bind(this);
        this.statusChange = this.statusChange.bind(this);
        this.memberStatus = this.memberStatus.bind(this)
    }

    componentDidMount() {
        this.loadPage()
    }

    loadPage(){
        this.props.unionStore.loadMember(this.props.match.params.id, data => {
            this.setState({ preloader: false });
            this.setState({
                sex: data.sex,
                status: data.member_status
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
                this.props.history.push('/')
            }
        })
    }

    editMember(){
        if (this.iinRef.current.value.length !== 12){
            NotificationManager.error("ИИН должен содержать 12 цифр")
        }else{
            if (this.props.unionStore.fileMember){
                this.props.unionStore.uploadFileMember(data => {
                    this.props.unionStore.updateMember(
                        this.props.match.params.id,
                        this.firstNameRef.current.value,
                        this.familyNameRef.current.value,
                        this.patronymicRef.current.value,
                        this.state.sex,
                        this.birthdayRef.current.value,
                        this.iinRef.current.value,
                        this.addressRef.current.value,
                        this.jobPositionRef.current.value,
                        this.mailRef.current.value,
                        () => {
                            if (this.state.status == 101 && this.state.newStatusChecked){
                                this.memberStatus()
                            }
                            NotificationManager.success("Данные успешно изменены");
                            this.loadPage()
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
                        }
                    )
                })
            }else{
                this.props.unionStore.updateMember(
                    this.props.match.params.id,
                    this.firstNameRef.current.value,
                    this.familyNameRef.current.value,
                    this.patronymicRef.current.value,
                    this.state.sex,
                    this.birthdayRef.current.value,
                    this.iinRef.current.value,
                    this.addressRef.current.value,
                    this.jobPositionRef.current.value,
                    this.mailRef.current.value,
                    () => {
                        if (this.state.status == 101 && this.state.newStatusChecked){
                            this.memberStatus()
                        }
                        NotificationManager.success("Данные успешно изменены");
                        this.loadPage()
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
                    }
                )
            }
        }
    }

    deleteMemberDialog(event){

        this.setState({
            deleteMemberDialog: true
        });

        let ev = event.target.dataset.id;

        if (ev == undefined) {
            let id = event.target.parentNode.dataset.id;
            this.setState({
                memberId: id
            })
        }else{
            let id = event.target.dataset.id;
            this.setState({
                memberId: id
            })
        }

    }

    excludeMember(event){
        event.preventDefault();

        this.setState({ preloader: true });

        this.props.unionStore.excludeMember(
            this.state.memberId,
            this.deleteRef.current.value,
            () => {
            setTimeout(()=>{
                NotificationManager.success('Вы успешно исключили члена профсоюза!')
            }, 500);
            this.props.history.goBack()
        },response => {
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
    }

    fileUpload(){
        let file = this.fileInput.current.files[0];

        this.props.unionStore.fileMember = file;

        this.setState({
            img: 'with-image'
        })
    }

    deletePicture(){
        this.props.unionStore.deletePictureMember(
            this.props.match.params.id,
            () => {
                this.loadPage()
            }, response => {
                if (Array.isArray(response.data)) {
                    response.data.forEach(error => {
                        this.setState({ preloader: false });
                        NotificationManager.error(error.message)
                    })
                } else {
                    this.setState({ preloader: false });
                    NotificationManager.error(response.message)
                }
                if (response.status == 401){
                    this.setState({ preloader: false });
                    this.props.history.push('/')
                }
            }
        )
    }

    memberStatus(){
        this.setState({ preloader: true });
        this.props.unionStore.memberStatusChange(
            this.props.match.params.id,
            () => {
                this.setState({ preloader: false });
                CookieService.remove('token-admin');
                this.props.history.push('/')
            },response => {
                if (Array.isArray(response.data)) {
                    response.data.forEach(error => {
                        this.setState({
                            preloader: false,
                            modalDialogView: false
                        });
                        NotificationManager.error(error.message)
                    })
                } else {
                    this.setState({
                        preloader: false,
                        modalDialogView: false
                    });
                    NotificationManager.error(response.data.message)
                }
                if (response.status == 401){
                    this.setState({ preloader: false });
                    this.props.history.push('/')
                }
            }
        )
    }

    statusModalOpen(){
        if (this.state.status !== 101){
            this.setState({
                modalDialogView: true
            })
        }
    }

    statusChange(){
        this.setState({
            status: 101,
            modalDialogView: false,
            newStatusChecked: true
        })
    }

    render() {

        return (
            <div className='member'>

                {
                    this.state.preloader &&
                        <Preloader/>
                }

                <NotificationContainer/>

                <Link onClick={() => { this.props.history.goBack() }} className='bread-crumbs'>{this.props.userStore.languageList["Вернуться в список членов профсоюза"] || 'Вернуться в список членов профсоюза'}</Link>
                <div className="profile">
                    <div className="toggle-lang">
                        {/*<div className="lang ru">Информация на русском языке</div>*/}
                        {/*<div className="lang kz">Информация на казахском языке</div>*/}
                    </div>
                    <div className="add__person data">
                        <p className='subtitle'>
                            {this.props.userStore.languageList["Личные данные"] || 'Личные данные'}
                        </p>
                        <div className="container top">
                            <div className="col-left">
                                <div className="img__wrapper">
                                    {
                                        this.props.unionStore.fileMember ?
                                            <div className={`img ${(this.state.img ? 'with-image' : 'default')}`}
                                                 style={{background: (`url(${URL.createObjectURL(this.props.unionStore.fileMember)}) no-repeat center center/ cover` )}}
                                                 onClick={this.handleSetImage}>
                                                {
                                                    this.props.userStore.role == 'company' &&
                                                    <div className="remove-icon" onClick={this.deletePicture}>
                                                        <RemoveIcon/>
                                                    </div>
                                                }
                                            </div>
                                            :
                                            <div className={`img ${(this.props.unionStore.member.picture_uri ? 'with-image' : 'default')}`}
                                                 style={{background: (this.props.unionStore.member.picture_uri ? `url(${this.props.unionStore.member.picture_uri}) no-repeat center center/ cover` : '' )}}
                                                 onClick={this.handleSetImage}>
                                                {
                                                    this.props.userStore.role == 'company' &&
                                                    <div className="remove-icon" onClick={this.deletePicture}>
                                                        <RemoveIcon/>
                                                    </div>
                                                }
                                            </div>
                                    }
                                    {
                                        this.props.userStore.role == 'company' &&
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
                                    }
                                </div>
                                <div className="label__wrapper-text">
                                    <label>
                                        <span>{this.props.userStore.languageList["Имя"] || 'Имя'}</span>
                                        <input type="text"
                                               name='firstName'
                                               ref={this.firstNameRef}
                                               onChange={() => { this.props.unionStore.member.first_name = this.firstNameRef.current.value }}
                                               value={this.props.unionStore.member.first_name}
                                               placeholder={this.props.userStore.languageList["Имя"] || 'Имя'}
                                               disabled={this.props.userStore.role !== 'company'}
                                        />
                                    </label>
                                    <label>
                                        <span>{this.props.userStore.languageList["Фамилия"] || 'Фамилия'}</span>
                                        <input type="text"
                                               name='familyName'
                                               ref={this.familyNameRef}
                                               onChange={() => {this.props.unionStore.member.family_name = this.familyNameRef.current.value }}
                                               value={this.props.unionStore.member.family_name}
                                               placeholder={this.props.userStore.languageList["Фамилия"] || 'Фамилия'}
                                               disabled={this.props.userStore.role !== 'company'}
                                        />
                                    </label>
                                    <label>
                                        <span>{this.props.userStore.languageList["Отчество"] || 'Отчество'}</span>
                                        <input type="text"
                                               name='patronymic'
                                               ref={this.patronymicRef}
                                               onChange={() => {this.props.unionStore.member.patronymic = this.patronymicRef.current.value }}
                                               value={this.props.unionStore.member.patronymic}
                                               placeholder={this.props.userStore.languageList["Отчество"] || 'Отчество'}
                                               disabled={this.props.userStore.role !== 'company'}
                                        />
                                    </label>
                                </div>
                            </div>
                            <div className="col-right">
                                <label>
                                    <span>{this.props.userStore.languageList["Дата рождения"] || 'Дата рождения'}</span>
                                    <input type="text"
                                           ref={this.birthdayRef}
                                           value={this.props.unionStore.member.birthday}
                                           onChange={() =>  this.props.unionStore.member.birthday = this.birthdayRef.current.value}
                                           disabled={this.props.userStore.role !== 'company'}
                                    />
                                </label>
                                <label>
                                    <span>{this.props.userStore.languageList["ИИН"] || 'ИИН'}</span>
                                    <input type="text"
                                           value={this.props.unionStore.member.individual_number}
                                           ref={this.iinRef}
                                           onChange={() => this.props.unionStore.member.individual_number = this.iinRef.current.value}
                                           name='iin'
                                           placeholder={this.props.userStore.languageList["ИИН"] || 'ИИН'}
                                           disabled={this.props.userStore.role !== 'company'}
                                    />
                                </label>
                                <div className="gender">
                                    <span>{this.props.userStore.languageList["Пол"] || 'Пол'}</span>
                                    <div className="gender__radios">
                                        <label>
                                            <input
                                                type="radio"
                                                checked={this.state.sex == 1}
                                                onChange={() => this.setState({ sex: 1 })}
                                                disabled={this.props.userStore.role !== 'company'}
                                                name='gender'
                                                value='Мужской'
                                            />
                                            <span className='radio'/>
                                            <div className="text">
                                                {this.props.userStore.languageList["Мужской"] || 'Мужской'}
                                            </div>
                                        </label>
                                        <label>
                                            <input
                                                type="radio"
                                                checked={this.state.sex == 0}
                                                onChange={() => this.setState({ sex: 0 })}
                                                disabled={this.props.userStore.role !== 'company'}
                                                name='gender'
                                                value='Женский'
                                            />
                                            <span className='radio'/>
                                            <div className="text">
                                                {this.props.userStore.languageList["Женский"] || 'Женский'}
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                <div className="gender">
                                    <label>
                                        <span>{this.props.userStore.languageList["Дети"] || 'Дети'}</span>
                                        <Link to={`/union/member/children/${this.props.unionStore.member.resource_id}`} style={{
                                            border: "1px solid #E4E8F0",
                                            borderRadius: 4,
                                            margin: '10px 0',
                                            padding: 7,
                                            color: "#2E384D"
                                        }}>{this.props.userStore.languageList["Данные о детях"] || 'Данные о детях'}</Link>
                                    </label>
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
                                    <input type="text"
                                           name='address'
                                           ref={this.addressRef}
                                           value={this.props.unionStore.member.physical_address}
                                           onChange={() => { this.props.unionStore.member.physical_address = this.addressRef.current.value }}
                                           placeholder='Адрес'
                                           disabled={this.props.userStore.role !== 'company'}
                                           />
                                </label>
                                <label>
                                    <span>{this.props.userStore.languageList["Телефон"] || 'Телефон'}</span>
                                    <IMaskInput
                                        mask={'+{7} (000) 000-00-00'}
                                        unmask={true}
                                        name='phone'
                                        placeholder='+7 (___) ___-__-__'
                                        value={this.props.unionStore.member.phone}
                                        onAccept={(value) => this.props.unionStore.member.phone = value}
                                        disabled
                                    />
                                </label>
                                <label>
                                    <span>E-mail</span>
                                    <input type="email"
                                           name='email'
                                           ref={this.mailRef}
                                           value={this.props.unionStore.member.email}
                                           onChange={() => this.props.unionStore.member.email = this.mailRef.current.value}
                                           placeholder='E-mail'
                                           disabled={this.props.userStore.role !== 'company'}
                                    />
                                </label>
                            </div>
                            <div className="col-right">
                                <p className='subtitle'>
                                    {this.props.userStore.languageList["Должностные данные"] || 'Должностные данные'}
                                </p>
                                <label>
                                    <span>{this.props.userStore.languageList["Должность"] || 'Должность'}</span>
                                    <input type="text"
                                           value={this.props.unionStore.member.job_position}
                                           ref={this.jobPositionRef}
                                           onChange={() => { this.props.unionStore.member.job_position = this.jobPositionRef.current.value }}
                                           name='post'
                                           placeholder={this.props.userStore.languageList["Должность"] || 'Должность'}
                                           disabled={this.props.userStore.role !== 'company'}
                                    />
                                </label>
                                <div className="wrapper">
                                    <label>
                                        <span>{this.props.userStore.languageList["В системе с"] || 'В системе с'}</span>
                                        <input
                                            type="text"
                                            placeholder={this.props.userStore.languageList["В профсоюзе с"] || 'В профсоюзе с'}
                                            value={this.state.created_at}
                                            disabled
                                        />
                                    </label>
                                    <div className="remove">
                                        <div className="btn-action"
                                             data-id={this.props.unionStore.member.resource_id}
                                             onClick={this.deleteMemberDialog}>
                                            <div
                                                className="icon"
                                                data-id={this.props.unionStore.member.resource_id}
                                            >
                                                <RemoveIcon/>
                                            </div>
                                            <span data-id={this.props.unionStore.member.resource_id}>{this.props.userStore.languageList["Исключить"] || 'Исключить'}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className='checkbox'>
                                    <input type="checkbox"
                                           checked={this.state.status == 101}
                                           onClick={this.statusModalOpen}
                                           id="admin"
                                    />
                                    <label htmlFor="admin">
                                        <div>{this.props.userStore.languageList["Права админа"] || 'Права админа'}</div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    {
                        this.props.userStore.role == 'company' &&
                        <div className="btns">
                            <button className="cancel" onClick={() => { this.props.history.goBack() }}>{this.props.userStore.languageList["Отменить"] || 'Отменить'}</button>
                            <button className="save" onClick={this.editMember}>{this.props.userStore.languageList["Сохранить"] || 'Сохранить'}</button>
                        </div>
                    }
                </div>

                {
                    this.state.modalDialogView &&
                    <Modal
                        isOpen={true}
                        className="Modal"
                        overlayClassName="Overlay"
                    >
                        <div className="modal__wrapper logout__wrapper">
                            <div className="modal__text">
                                {this.props.userStore.languageList["Вы действительно хотите назначить новго председателя?"]
                                || 'Вы действтительно хотите назначить нового председателя?'}
                            </div>
                            <div className="modal__btns" style={{ justifyContent: 'center' }}>
                                <div className="modal__btn" onClick={() => this.setState({ modalDialogView: false })}>
                                    {this.props.userStore.languageList["Нет"] || 'Нет'}
                                </div>
                                <div className="modal__btn" onClick={this.statusChange}>
                                    {this.props.userStore.languageList["Да"] || 'Да'}
                                </div>
                            </div>
                        </div>
                    </Modal>
                }

                {
                    this.state.deleteMemberDialog &&
                    <Modal
                        isOpen={true}
                        className="Modal"
                        overlayClassName="Overlay"
                    >
                        <NotificationContainer/>
                        <div className='modal__wrapper create-section__wrapper' style={{ width: 594, height: 288 }}>
                            <form onSubmit={(event) => this.excludeMember(event)} style={{ maxHeight: '100%' }}>

                                <label>
                                    <p className="label">{this.props.userStore.languageList["Напишите причину исключения из Первичной Профсоюзной организации"]
                                    || 'Напишите причину исключения из Первичной Профсоюзной организации'}:</p>
                                    <div className="wrapper">

                                        {/*<input name='sectionName'*/}
                                        {/*       ref={this.typeName}*/}
                                        {/*       style={{ height: 144, border: '1px solid #E4E8F0' }}*/}
                                        {/*       type='text'*/}
                                        {/*       placeholder={this.props.userStore.languageList["Введите текст..."] || 'Введите текст...'}*/}
                                        {/*       className="section-name"*/}
                                        {/*/>*/}

                                        <textarea
                                            name="sectionName"
                                            ref={this.deleteRef}
                                            style={{ height: 144, width: '100%', padding: 16, border: '1px solid #E4E8F0' }}
                                            cols="30"
                                            rows="10"
                                            className="section-name"
                                            placeholder={this.props.userStore.languageList["Необязательное поле"] || 'Необязательное поле'}
                                        >

                                                </textarea>

                                    </div>
                                </label>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
                                    <button type='submit' className='btn' onClick={() => this.setState({ deleteMemberDialog: false })} style={{ margin: 0, marginRight: 16, background: '#EFF1F5', color: '#2E384D' }}>{this.props.userStore.languageList["Отмена"] || 'Отмена'}</button>
                                    <button type='submit' className='btn btn-save' style={{ margin: 0 }}>{this.props.userStore.languageList["Удалить"] || 'Удалить'}</button>
                                </div>
                            </form>
                        </div>
                    </Modal>
                }

            </div>
        );
    }
}

export default inject('unionStore', 'userStore', 'permissionsStore')(observer(PpoMember));