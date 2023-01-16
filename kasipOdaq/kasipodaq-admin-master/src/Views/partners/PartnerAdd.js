import React, {Component} from 'react';
import ReactQuill from "react-quill";
import {connect} from 'react-redux'

import {ReactComponent as RemoveIcon} from "../../assets/icons/delete.svg";
import {ReactComponent as CameraIcon} from "../../assets/icons/camera.svg";
import {ReactComponent as AddIcon} from "../../assets/icons/add.svg";
import {inject, observer} from "mobx-react";
import Preloader from "../../fragments/preloader/Preloader";
import {NotificationContainer, NotificationManager} from "react-notifications";

class PartnerAdd extends Component {
    constructor(props){
        super(props);

        this.state = {
            preloader: false,
            img: '',
            nameRu: '',
            nameKk: '',
            vk: '',
            ok: '',
            twitter: '',
            facebook: '',
            instagram: '',
            whatsapp: '',
            telegram: '',
            contentRu: '',
            contentKk: '',
            lang: 'ru'
        };

        this.titleRef = React.createRef();
        this.titleKkRef = React.createRef();
        this.descriptionRef = React.createRef();
        this.fileUpload = React.createRef();

        this.vkRef = React.createRef();
        this.okRef = React.createRef();
        this.twitterRef = React.createRef();
        this.facebookRef = React.createRef();
        this.instagramRef = React.createRef();
        this.whatsappRef = React.createRef();
        this.telegramRef = React.createRef();

        this.pictureChange = this.pictureChange.bind(this);
        this.createPartner = this.createPartner.bind(this)
    }

    pictureChange(){
        let file = this.fileUpload.current.files[0];
        this.props.partnersStore.file = file;

        this.setState({
            img: 'with-image'
        })
    }

    createPartner(){
        if (this.state.img !== 'with-image'){
            NotificationManager.error('Загрузите пожалуйста логотип')
        }else if(this.state.nameRu == '') {
            NotificationManager.error('Заполните пожалуйста поле "Название"')
        }else if(this.state.contentRu == '') {
            NotificationManager.error('Заполните пожалуйста поле "Описание"')
        }else{
            this.setState({ preloader: true });
            if (this.props.partnersStore.file){
                this.props.partnersStore.uploadFile(data => {
                    this.props.partnersStore.createPartner(
                        this.props.match.params.id,
                        this.state.nameRu,
                        this.state.nameKk,
                        this.state.contentRu,
                        this.state.contentKk,
                        this.state.vk,
                        this.state.ok,
                        this.state.instagram,
                        this.state.facebook,
                        this.state.whatsapp,
                        this.state.twitter,
                        this.state.telegram,
                        () => {
                            this.setState({ preloader: false });
                            this.props.history.goBack()
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
                        this.props.history.push('/')
                    }
                })
            }else{
                this.props.partnersStore.createPartner(
                    this.props.match.params.id,
                    this.state.nameRu,
                    this.state.nameKk,
                    this.state.contentRu,
                    this.state.contentKk,
                    this.state.vk,
                    this.state.ok,
                    this.state.instagram,
                    this.state.facebook,
                    this.state.whatsapp,
                    this.state.twitter,
                    this.state.telegram,
                    () => {
                        this.setState({ preloader: false });
                        this.props.history.goBack()
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
        }
    }

    render() {

        return (
            <div className='partner-add'>

                {
                    this.state.preloader &&
                        <Preloader/>
                }
                <NotificationContainer/>

                <h1 className="title">{this.props.userStore.languageList["Добавление партнера"] || 'Добавление партнера'}</h1>
                <div className="panel">
                    <div className="toggle-lang">
                        <div className="lang ru" style={{ background: this.state.lang == 'ru' ? '#00AEEF': '', color: this.state.lang == 'ru' ? '#ffffff' : '' }} onClick={() => this.setState({ lang: 'ru' }) }>{this.props.userStore.languageList['Информация на русском языке'] || 'Информация на русском языке'}</div>
                        <div className="lang kz" style={{ background: this.state.lang == 'kk' ? '#00AEEF': '', color: this.state.lang == 'kk' ? '#ffffff' : '' }} onClick={() => this.setState({ lang: 'kk' })}>{this.props.userStore.languageList['Информация на казахском языке'] || 'Информация на казахском языке'}</div>
                    </div>
                    {
                        this.state.lang == 'ru' &&
                        <div className="container top">
                            <div className="data">
                                <div className="img__wrapper">
                                    <label className="logo">
                                        <div className={`img ${(this.state.img ? 'with-image' : 'default')}`}
                                             style={{background: (this.state.img ? `url(${URL.createObjectURL(this.props.partnersStore.file)}) no-repeat center center/ cover` : '')}}
                                            // onClick={this.handleSetImage}
                                        >
                                            {/*<div className="remove-icon" onClick={this.removeLogo}>*/}
                                            {/*    <RemoveIcon/>*/}
                                            {/*</div>*/}
                                        </div>
                                        <div className='button'>
                                            <div className="icon">
                                                <CameraIcon/>
                                            </div>
                                            {this.props.userStore.languageList["Загрузить логотип"] || 'Загрузить логотип'}
                                        </div>
                                        <input type="file"
                                               onChange={this.pictureChange}
                                               style={{display: 'none'}}
                                               defaultValue={this.fileUpload.current?.files[0]}
                                               ref={this.fileUpload}
                                               name="photo"/>
                                    </label>
                                </div>
                                <label>
                                    <span>{this.props.userStore.languageList["Название"] || 'Название'}</span>
                                    <input
                                        type="text"
                                        ref={this.titleRef}
                                        required
                                        onChange={() => this.setState({ nameRu: this.titleRef.current.value })}
                                        defaultValue={this.state.nameRu}
                                        name='title'
                                        placeholder={this.props.userStore.languageList["Наименование"] || 'Наименование'}
                                    />
                                </label>
                                <div className="socials">
                                    <label>
                                        <span>{this.props.userStore.languageList["Ссылки на соц. сети"] || 'Ссылки на соц. сети'}</span>
                                        <ul className="social-add">
                                            <input
                                                type="text"
                                                name='vk'
                                                onChange={() => this.setState({ vk: this.vkRef.current.value })}
                                                defaultValue={this.state.vk}
                                                ref={this.vkRef}
                                                placeholder='vk'
                                            />
                                            <input
                                                type="text"
                                                name='ok'
                                                onChange={() => this.setState({ ok: this.okRef.current.value })}
                                                defaultValue={this.state.ok}
                                                ref={this.okRef}
                                                placeholder='ok'
                                            />
                                            <input
                                                type="text"
                                                name='twitter'
                                                onChange={() => this.setState({ twitter: this.twitterRef.current.value })}
                                                defaultValue={this.state.twitter}
                                                ref={this.twitterRef}
                                                placeholder='twitter'
                                            />
                                            <input
                                                type="text"
                                                name='facebook'
                                                onChange={() => this.setState({ facebook: this.facebookRef.current.value })}
                                                defaultValue={this.state.facebook}
                                                ref={this.facebookRef}
                                                placeholder='facebook'
                                            />
                                            <input
                                                type="text"
                                                name='instagram'
                                                onChange={() => this.setState({ instagram: this.instagramRef.current.value })}
                                                defaultValue={this.state.instagram}
                                                ref={this.instagramRef}
                                                placeholder='instagram'
                                            />
                                            <input
                                                type="text"
                                                name='whatsapp'
                                                ref={this.whatsappRef}
                                                onChange={() => this.setState({ whatsapp: this.whatsappRef.current.value })}
                                                defaultValue={this.state.whatsapp}
                                                placeholder='whatsapp'
                                            />
                                            <input
                                                type="text"
                                                name='telegram'
                                                ref={this.telegramRef}
                                                onChange={() => this.setState({ telegram: this.telegramRef.current.value })}
                                                defaultValue={this.state.telegram}
                                                placeholder='telegram'
                                            />
                                        </ul>
                                    </label>
                                </div>
                                <label>
                                    <span>{this.props.userStore.languageList["Контент"] || 'Контент'}</span>
                                    <ReactQuill
                                        ref={this.descriptionRef}
                                        defaultValue={this.state.contentRu}
                                        onChange={(text) => { this.setState({ contentRu: text }) }}
                                    />
                                </label>
                            </div>
                        </div>
                    }

                    {
                        this.state.lang == 'kk' &&
                        <div className="container top">
                            <div className="data">
                                <div className="img__wrapper">
                                    <label className="logo">
                                        <div className={`img ${(this.state.img ? 'with-image' : 'default')}`}
                                             style={{background: (this.state.img ? `url(${URL.createObjectURL(this.props.partnersStore.file)}) no-repeat center center/ cover` : '')}}
                                            // onClick={this.handleSetImage}
                                        >
                                            {/*<div className="remove-icon" onClick={this.removeLogo}>*/}
                                            {/*    <RemoveIcon/>*/}
                                            {/*</div>*/}
                                        </div>
                                        <div className='button'>
                                            <div className="icon">
                                                <CameraIcon/>
                                            </div>
                                            {this.props.userStore.languageList["Загрузить логотип"] || 'Загрузить логотип'}
                                        </div>
                                        <input type="file"
                                               onChange={this.pictureChange}
                                               style={{display: 'none'}}
                                               ref={this.fileUpload}
                                               name="photo"/>
                                    </label>
                                </div>
                                <label>
                                    <span>{this.props.userStore.languageList["Название"] || 'Название'}</span>
                                    <input
                                        type="text"
                                        ref={this.titleKkRef}
                                        defaultValue={this.state.nameKk}
                                        onChange={() => this.setState({ nameKk: this.titleKkRef.current.value })}
                                        required
                                        name='title'
                                        placeholder={this.props.userStore.languageList["Наименование"] || 'Наименование'}
                                    />
                                </label>
                                <div className="socials">
                                    <label>
                                        <span>{this.props.userStore.languageList["Ссылки на соц. сети"] || 'Ссылки на соц. сети'}</span>
                                        <ul className="social-add">
                                            <input
                                                type="text"
                                                name='vk'
                                                onChange={() => this.setState({ vk: this.vkRef.current.value })}
                                                defaultValue={this.state.vk}
                                                ref={this.vkRef}
                                                placeholder='vk'
                                            />
                                            <input
                                                type="text"
                                                name='ok'
                                                onChange={() => this.setState({ ok: this.okRef.current.value })}
                                                defaultValue={this.state.ok}
                                                ref={this.okRef}
                                                placeholder='ok'
                                            />
                                            <input
                                                type="text"
                                                name='twitter'
                                                onChange={() => this.setState({ twitter: this.twitterRef.current.value })}
                                                defaultValue={this.state.twitter}
                                                ref={this.twitterRef}
                                                placeholder='twitter'
                                            />
                                            <input
                                                type="text"
                                                name='facebook'
                                                onChange={() => this.setState({ facebook: this.facebookRef.current.value })}
                                                defaultValue={this.state.facebook}
                                                ref={this.facebookRef}
                                                placeholder='facebook'
                                            />
                                            <input
                                                type="text"
                                                name='instagram'
                                                onChange={() => this.setState({ instagram: this.instagramRef.current.value })}
                                                defaultValue={this.state.instagram}
                                                ref={this.instagramRef}
                                                placeholder='instagram'
                                            />
                                            <input
                                                type="text"
                                                name='whatsapp'
                                                ref={this.whatsappRef}
                                                onChange={() => this.setState({ whatsapp: this.whatsappRef.current.value })}
                                                defaultValue={this.state.whatsapp}
                                                placeholder='whatsapp'
                                            />
                                            <input
                                                type="text"
                                                name='telegram'
                                                ref={this.telegramRef}
                                                onChange={() => this.setState({ telegram: this.telegramRef.current.value })}
                                                defaultValue={this.state.telegram}
                                                placeholder='telegram'
                                            />
                                        </ul>
                                    </label>
                                </div>
                                <label>
                                    <span>{this.props.userStore.languageList["Контент"] || 'Контент'}</span>
                                    <ReactQuill
                                        ref={this.descriptionRef}
                                        defaultValue={this.state.contentKk}
                                        onChange={(text) => { this.setState({ contentKk: text }) }}
                                    />
                                </label>
                            </div>
                        </div>
                    }
                    <div className="btns">
                        <button className="cancel" onClick={() => { this.props.history.goBack() }}>{this.props.userStore.languageList["Отменить"] || 'Отменить'}</button>
                        <button className="save" onClick={this.createPartner}>{this.props.userStore.languageList["Сохранить"] || 'Сохранить'}</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default inject('partnersStore', 'userStore', 'permissionsStore')(observer(PartnerAdd));