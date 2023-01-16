import React, {Component} from 'react';
import ReactQuill from "react-quill";
import {connect} from 'react-redux'
import {ReactComponent as AddIcon} from "../../assets/icons/add.svg";
import {ReactComponent as RemoveIcon} from "../../assets/icons/delete.svg";
import {ReactComponent as CameraIcon} from "../../assets/icons/camera.svg";
import Preloader from "../../fragments/preloader/Preloader";
import {NotificationContainer, NotificationManager} from "react-notifications";
import {inject, observer} from "mobx-react";
import {Link} from "react-router-dom";
import CookieService from "../../services/CookieService";

class PartnerEdit extends Component {
    constructor(props){
        super(props);

        this.state = {
            preloader: false,
            language: CookieService.get('language-admin'),
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
        };

        this.fileUpload = React.createRef();
        this.titleRef = React.createRef();
        this.vkRef = React.createRef();
        this.okRef = React.createRef();
        this.twitterRef = React.createRef();
        this.facebookRef = React.createRef();
        this.instagramRef = React.createRef();
        this.whatsappRef = React.createRef();
        this.telegramRef = React.createRef();

        this.editPartner = this.editPartner.bind(this);
        this.pictureChange = this.pictureChange.bind(this)

    }

    componentDidMount() {

        if (CookieService.get('language-admin') == 'kk'){
            this.setState({
                language: 'kk'
            })
        }else{
            this.setState({
                language: 'ru'
            })
        }

        this.props.partnersStore.loadPartner(this.props.match.params.id,
            'ru',
            () => {
            this.setState({
                nameRu: this.props.partnersStore.partner.name,
                contentRu: this.props.partnersStore.partner.description
            })

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
        });

        this.props.partnersStore.loadPartner(this.props.match.params.id,
            'kk',
            () => {
            this.setState({
                nameKk: this.props.partnersStore.partner.name,
                contentKk: this.props.partnersStore.partner.description
            })

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

    pictureChange(){
        let file = this.fileUpload.current.files[0];
        this.props.partnersStore.file = file
    }

    editPartner(){
        this.setState({ preloader: true });

        if(this.state.nameRu == null) {
            NotificationManager.error('Заполните пожалуйста поле "Название"')
        }else{
            if (this.props.partnersStore.file){
                this.props.partnersStore.uploadFile(data => {
                    this.props.partnersStore.editPartner(
                        this.props.match.params.id,
                        this.state.nameRu,
                        this.state.nameKk,
                        this.state.contentRu,
                        this.state.contentKk,
                        this.vkRef.current.value,
                        this.okRef.current.value,
                        this.instagramRef.current.value,
                        this.facebookRef.current.value,
                        this.whatsappRef.current.value,
                        this.twitterRef.current.value,
                        this.telegramRef.current.value,
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
            }else{
                this.props.partnersStore.editPartner(
                    this.props.match.params.id,
                    this.state.nameRu,
                    this.state.nameKk,
                    this.state.contentRu,
                    this.state.contentKk,
                    this.vkRef.current.value,
                    this.okRef.current.value,
                    this.instagramRef.current.value,
                    this.facebookRef.current.value,
                    this.whatsappRef.current.value,
                    this.twitterRef.current.value,
                    this.telegramRef.current.value,
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

                <h1 className="title">{this.props.userStore.languageList["Редактировать партнера"] || 'Редактировать партнера'}</h1>
                <div className="panel">

                    <div style={{ marginBottom: 16 }}>
                        <Link style={{ color: '#0052A4' }} to={'/partners'}>{this.props.userStore.languageList['Все категории'] || 'Все категории'}</Link>
                        <span> -> </span>
                        {
                            <Link style={{color: '#0052A4'}} to={`/partners/category/${this.props.partnersStore.partnerCategoryId}`}>
                                {this.props.partnersStore.partnerCategoryName}
                            </Link>
                        }
                        <span> -> </span>
                        <Link style={{ color: '#0052A4', borderBottom: '1px solid #0052A4' }}>{ this.props.partnersStore.partner.name }</Link>
                    </div>

                    <div className="toggle-lang">
                        <div className="lang ru" style={{ background: this.state.lang == 'ru' ? '#00AEEF': '', color: this.state.lang == 'ru' ? '#ffffff' : '' }} onClick={() => this.setState({ lang: 'ru' }) }>{this.props.userStore.languageList['Информация на русском языке'] || 'Информация на русском языке'}</div>
                        <div className="lang kz" style={{ background: this.state.lang == 'kk' ? '#00AEEF': '', color: this.state.lang == 'kk' ? '#ffffff' : '' }} onClick={() => this.setState({ lang: 'kk' })}>{this.props.userStore.languageList['Информация на казахском языке'] || 'Информация на казахском языке'}</div>
                    </div>
                    {
                        this.state.language == 'ru' &&
                        <div className="container top">
                            <div className="data">
                                <div className="img__wrapper">
                                    <label className='logo'>
                                        {
                                            this.props.partnersStore.file ?
                                                <div className={`img ${(this.state.img ? 'with-image' : 'default')}`}
                                                     style={{background: (`url(${URL.createObjectURL(this.props.partnersStore.file)}) no-repeat center center/ cover` )}}
                                                     onClick={this.handleSetImage}>
                                                    {/*<div className="remove-icon">*/}
                                                    {/*    <RemoveIcon/>*/}
                                                    {/*</div>*/}
                                                </div>
                                                :
                                                <div className={`img ${(this.props.partnersStore.partner.picture_uri ? 'with-image' : 'default')}`}
                                                     style={{background: (this.props.partnersStore.partner.picture_uri ? `url(${this.props.partnersStore.partner.picture_uri}) no-repeat center center/ cover` : '' )}}
                                                >
                                                    {/*<div className="remove-icon">*/}
                                                    {/*    <RemoveIcon/>*/}
                                                    {/*</div>*/}
                                                </div>
                                        }
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
                                               name="logo"/>
                                    </label>
                                </div>
                                <label>
                                    <span>{this.props.userStore.languageList["Название"] || 'Название'}</span>
                                    <input type="text"
                                           ref={this.titleRef}
                                           name='title'
                                           value={this.state.nameRu}
                                           onChange={(e) => { this.setState({ nameRu: e.target.value }) }}
                                           placeholder={this.props.userStore.languageList["Наименование"] || 'Наименование'}
                                    />
                                </label>
                                <div className="socials">
                                    <label>
                                        <span>{this.props.userStore.languageList["Ссылки на соц. сети"] || 'Ссылки на соц. сети'}</span>
                                        <div className="social-add">
                                            <input
                                                type="text"
                                                name='vk'
                                                ref={this.vkRef}
                                                placeholder='vk'
                                                value={this.props.partnersStore.partner.vk}
                                                onChange={() => this.props.partnersStore.partner.vk = this.vkRef.current.value }
                                            />
                                            <input
                                                type="text"
                                                name='ok'
                                                ref={this.okRef}
                                                placeholder='ok'
                                                value={this.props.partnersStore.partner.odnoklassniki}
                                                onChange={() => this.props.partnersStore.partner.odnoklassniki = this.okRef.current.value }
                                            />
                                            <input
                                                type="text"
                                                name='twitter'
                                                ref={this.twitterRef}
                                                placeholder='twitter'
                                                value={this.props.partnersStore.partner.twitter}
                                                onChange={() => this.props.partnersStore.partner.twitter = this.twitterRef.current.value }
                                            />
                                            <input
                                                type="text"
                                                name='facebook'
                                                ref={this.facebookRef}
                                                placeholder='facebook'
                                                value={this.props.partnersStore.partner.facebook}
                                                onChange={() => this.props.partnersStore.partner.facebook = this.facebookRef.current.value }
                                            />
                                            <input
                                                type="text"
                                                name='instagram'
                                                ref={this.instagramRef}
                                                placeholder='instagram'
                                                value={this.props.partnersStore.partner.instagram}
                                                onChange={() => this.props.partnersStore.partner.instagram = this.instagramRef.current.value }
                                            />
                                            <input
                                                type="text"
                                                name='whatshapp'
                                                ref={this.whatsappRef}
                                                placeholder='whatshapp'
                                                value={this.props.partnersStore.partner.whatsapp}
                                                onChange={() => this.props.partnersStore.partner.whatsapp = this.whatsappRef.current.value }
                                            />
                                            <input
                                                type="text"
                                                name='telegram'
                                                ref={this.telegramRef}
                                                placeholder='telegram'
                                                value={this.props.partnersStore.partner.telegram}
                                                onChange={() => this.props.partnersStore.partner.telegram = this.telegramRef.current.value }
                                            />
                                        </div>
                                    </label>
                                </div>
                                <label>
                                    <span>{this.props.userStore.languageList["Контент"] || 'Контент'}</span>
                                    <ReactQuill
                                        value={this.state.contentRu}
                                        onChange={(text) => { this.setState({ contentRu: text }) }}
                                    />
                                </label>
                            </div>
                        </div>
                    }

                    {
                        this.state.language == 'kk' &&
                        <div className="container top">
                            <div className="data">
                                <div className="img__wrapper">
                                    <label className='logo'>
                                        {
                                            this.props.partnersStore.file ?
                                                <div className={`img ${(this.state.img ? 'with-image' : 'default')}`}
                                                     style={{background: (`url(${URL.createObjectURL(this.props.partnersStore.file)}) no-repeat center center/ cover` )}}
                                                     onClick={this.handleSetImage}>
                                                    {/*<div className="remove-icon">*/}
                                                    {/*    <RemoveIcon/>*/}
                                                    {/*</div>*/}
                                                </div>
                                                :
                                                <div className={`img ${(this.props.partnersStore.partner.picture_uri ? 'with-image' : 'default')}`}
                                                     style={{background: (this.props.partnersStore.partner.picture_uri ? `url(${this.props.partnersStore.partner.picture_uri}) no-repeat center center/ cover` : '' )}}
                                                >
                                                    {/*<div className="remove-icon">*/}
                                                    {/*    <RemoveIcon/>*/}
                                                    {/*</div>*/}
                                                </div>
                                        }
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
                                               name="logo"/>
                                    </label>
                                </div>
                                <label>
                                    <span>{this.props.userStore.languageList["Название"] || 'Название'}</span>
                                    <input type="text"
                                           ref={this.titleRef}
                                           name='title'
                                           value={this.state.nameKk}
                                           onChange={(e) => { this.setState({ nameKk: e.target.value }) }}
                                           placeholder={this.props.userStore.languageList["Наименование"] || 'Наименование'}
                                    />
                                </label>
                                <div className="socials">
                                    <label>
                                        <span>{this.props.userStore.languageList["Ссылки на соц. сети"] || 'Ссылки на соц. сети'}</span>
                                        <div className="social-add">
                                            <input
                                                type="text"
                                                name='vk'
                                                ref={this.vkRef}
                                                placeholder='vk'
                                                value={this.props.partnersStore.partner.vk}
                                                onChange={() => this.props.partnersStore.partner.vk = this.vkRef.current.value }
                                            />
                                            <input
                                                type="text"
                                                name='ok'
                                                ref={this.okRef}
                                                placeholder='ok'
                                                value={this.props.partnersStore.partner.odnoklassniki}
                                                onChange={() => this.props.partnersStore.partner.odnoklassniki = this.okRef.current.value }
                                            />
                                            <input
                                                type="text"
                                                name='twitter'
                                                ref={this.twitterRef}
                                                placeholder='twitter'
                                                value={this.props.partnersStore.partner.twitter}
                                                onChange={() => this.props.partnersStore.partner.twitter = this.twitterRef.current.value }
                                            />
                                            <input
                                                type="text"
                                                name='facebook'
                                                ref={this.facebookRef}
                                                placeholder='facebook'
                                                value={this.props.partnersStore.partner.facebook}
                                                onChange={() => this.props.partnersStore.partner.facebook = this.facebookRef.current.value }
                                            />
                                            <input
                                                type="text"
                                                name='instagram'
                                                ref={this.instagramRef}
                                                placeholder='instagram'
                                                value={this.props.partnersStore.partner.instagram}
                                                onChange={() => this.props.partnersStore.partner.instagram = this.instagramRef.current.value }
                                            />
                                            <input
                                                type="text"
                                                name='whatshapp'
                                                ref={this.whatsappRef}
                                                placeholder='whatshapp'
                                                value={this.props.partnersStore.partner.whatsapp}
                                                onChange={() => this.props.partnersStore.partner.whatsapp = this.whatsappRef.current.value }
                                            />
                                            <input
                                                type="text"
                                                name='telegram'
                                                ref={this.telegramRef}
                                                placeholder='telegram'
                                                value={this.props.partnersStore.partner.telegram}
                                                onChange={() => this.props.partnersStore.partner.telegram = this.telegramRef.current.value }
                                            />
                                        </div>
                                    </label>
                                </div>
                                <label>
                                    <span>{this.props.userStore.languageList["Контент"] || 'Контент'}</span>
                                    <ReactQuill
                                        value={this.state.contentKk}
                                        onChange={(text) => { this.setState({ contentKk: text }) }}
                                    />
                                </label>
                            </div>
                        </div>
                    }
                    <div className="btns">
                        <button className="cancel" onClick={() => { this.props.history.goBack() }}>{this.props.userStore.languageList["Отменить"] || 'Отменить'}</button>
                        <button className="save" onClick={this.editPartner}>{this.props.userStore.languageList["Сохранить"] || 'Сохранить'}</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default inject('partnersStore', 'userStore', 'permissionsStore')(observer(PartnerEdit));