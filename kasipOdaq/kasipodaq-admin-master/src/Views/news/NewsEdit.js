import React, {Component} from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import {ReactComponent as RemoveIcon} from '../../assets/icons/delete.svg';
import {ReactComponent as CameraIcon} from '../../assets/icons/camera.svg';
import {inject, observer} from "mobx-react";
import Preloader from "../../fragments/preloader/Preloader";
import {NotificationContainer, NotificationManager} from "react-notifications";
import ApiService from "../../services/ApiService";
import {Link} from "react-router-dom";
import CookieService from "../../services/CookieService";

class NewsEdit extends Component {

    constructor(props){
        super(props);

        this.state = {
            preloader: true,
            titleRu: '',
            titleKk: '',
            contentRu: '',
            contentKk: '',
            sourceRu: '',
            sourceKk: '',
            status: 0,
            language: CookieService.get('language-admin')
        };

        this.titleRef = React.createRef();
        this.sourceRef = React.createRef();
        this.statusRef = React.createRef();
        this.fileInput = React.createRef();
        this.contentRef = React.createRef();

        this.changeContent = this.changeContent.bind(this);
        this.changeTitleRu = this.changeTitleRu.bind(this);
        this.changeTitleKk = this.changeTitleKk.bind(this);
        this.changeSource = this.changeSource.bind(this);
        this.handleStatusCheck = this.handleStatusCheck.bind(this);
        this.editNews = this.editNews.bind(this);
        this.fileUpload = this.fileUpload.bind(this);
        this.deletePicture = this.deletePicture.bind(this);
        this.changeLanguageRu = this.changeLanguageRu.bind(this);
        this.changeLanguageKk = this.changeLanguageKk.bind(this)
    }

    loadPage(){
        if (CookieService.get('language-admin') == 'kk'){
            this.setState({
                language: 'kk'
            })
        }else{
            this.setState({
                language: 'ru'
            })
        }

        this.props.newsStore.loadNews(this.props.match.params.id, 'ru', () => {
            this.setState({
                preloader: false,
                titleRu: this.props.newsStore.news.title,
                status: this.props.newsStore.newsStatus,
                contentRu: this.props.newsStore.news.content,
                sourceRu: this.props.newsStore.news.source
            })
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
        });

        this.props.newsStore.loadNews(this.props.match.params.id, 'kk', () => {
            this.setState({
                preloader: false,
                titleKk: this.props.newsStore.news.title,
                status: this.props.newsStore.newsStatus,
                contentKk: this.props.newsStore.news.content,
                sourceKk: this.props.newsStore.news.source
            })
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
        })
    }

    componentDidMount() {
        this.loadPage();
        this.props.newsStore.loadFile()
    }

    deletePicture(){
        this.props.newsStore.deleteFile(
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

    changeContent(value){
        this.props.newsStore.news.content = value
    }

    changeTitleRu(event){
        this.setState({
            titleRu: event.target.value
        })
    }

    changeTitleKk(event){
        this.setState({
            titleKk: event.target.value
        })
    }

    changeSource(event){
        this.props.newsStore.news.source = event.target.value
    }

    handleStatusCheck(){
        this.setState({
            status: !this.state.status
        })
    }

    editNews(){
        this.setState({ preloader: true });

        let status = this.state.status ? 1 : 0;

        if (this.titleRef.current.value == ''){
            this.setState({ preloader: false });
            NotificationManager.error(' Заполните пожалуйста поле "Название" ')
        }else if(this.state.contentRu.length < 10){
            this.setState({ preloader: false });
            NotificationManager.error(' Минимальная длина поля "Контент" 10 символов ')
        }else if(this.state.titleKk == '' && this.state.contentKk.length > 0){
            this.setState({ preloader: false });
            NotificationManager.error(' Заполните пожалуйста поле "Название" на казахском языке')
        }else  if(this.state.contentKk == '' && this.state.titleKk.length > 0){
            this.setState({ preloader: false });
            NotificationManager.error(' Заполните пожалуйста поле "Контент" на казахском языке')
        }else if(this.sourceRef.current.value == ''){
            this.setState({ preloader: false });
            NotificationManager.error(' Заполните пожалуйста поле "Источник" ')
        }else{

            if(this.props.newsStore.file){
                this.props.newsStore.uploadFile(data => {
                    this.props.newsStore.updateNews(
                        this.titleRef.current.value,
                        this.state.contentRu,
                        this.state.sourceRu,
                        this.state.sourceKk,
                        status,
                        this.state.titleKk,
                        this.state.contentKk,
                        () => {
                            this.setState({ preloader: false });
                            this.props.history.push('/news')
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
                        }
                    )
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
                this.props.newsStore.updateNews(
                    this.titleRef.current.value,
                    this.state.contentRu,
                    this.state.sourceRu,
                    this.state.sourceKk,
                    status,
                    this.state.titleKk,
                    this.state.contentKk,
                    () => {
                        this.setState({ preloader: false });
                        this.props.history.push('/news')
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
                    }
                )
            }

        }


    }

    fileUpload(){
        let file = this.fileInput.current.files[0];

        this.props.newsStore.file = file;

        this.setState({
            img: 'with-image'
        })
    }

    changeLanguageRu(){
        this.setState({ language: 'ru' })
    }

    changeLanguageKk(){
        this.setState({ language: 'kk' })
    }

    render() {
        return (
            <div className='article-edit content'>
                {
                    this.state.preloader &&
                        <Preloader/>
                }

                <NotificationContainer/>

                <h1 className="title">
                    <span>{this.props.userStore.languageList["Редактировать новость"] || 'Редактировать новость'}</span>
                </h1>
                <div className={'panel'}>

                    <div style={{ marginBottom: 16 }}>
                        <Link style={{ color: '#0052A4' }} to={`/news`}>{this.props.userStore.languageList['Все новости'] || 'Все новости'}</Link>
                        <span> -> </span>
                        <Link style={{ color: '#0052A4' }}>{this.props.newsStore.news.title}</Link>
                    </div>

                    <div className="toggle-lang">
                        <div className="lang ru" style={{ background: this.state.language == 'ru' ? '#00AEEF': '', color: this.state.language == 'ru' ? '#ffffff' : '' }} onClick={ this.changeLanguageRu }>{this.props.userStore.languageList['Информация на русском языке'] || 'Информация на русском языке'}</div>
                        <div className="lang kz" style={{ background: this.state.language == 'kk' ? '#00AEEF': '', color: this.state.language == 'kk' ? '#ffffff' : '' }} onClick={ this.changeLanguageKk }>{this.props.userStore.languageList['Информация на казахском языке'] || 'Информация на казахском языке'}</div>
                    </div>

                    {
                        this.state.language == 'ru' &&
                        <div className="container top">
                            <div className="data">
                                <div className="img__wrapper">
                                    {
                                        this.props.newsStore.file ?
                                            <div className={`img ${(this.state.img ? 'with-image' : 'default')}`}
                                                 style={{background: (`url(${URL.createObjectURL(this.props.newsStore.file)}) no-repeat center center/ cover`)}}
                                                 onClick={this.handleSetImage}>
                                                <div className="remove-icon" onClick={this.deletePicture}>
                                                    <RemoveIcon/>
                                                </div>
                                            </div>
                                            :
                                            <div
                                                className={`img ${(this.props.newsStore.news.picture_uri ? 'with-image' : 'default')}`}
                                                style={{background: (this.props.newsStore.news.picture_uri ? `url(${this.props.newsStore.news.picture_uri}) no-repeat center center/ cover` : '')}}
                                                onClick={this.handleSetImage}>
                                                <div className="remove-icon" onClick={this.deletePicture}>
                                                    <RemoveIcon/>
                                                </div>
                                            </div>
                                    }
                                    <label htmlFor={'1'}>
                                        <div className='button' onClick={this.handleSetImage}>
                                            <div className="icon">
                                                <CameraIcon/>
                                            </div>
                                            {this.props.userStore.languageList["Загрузить изображение"] || 'Загрузить изображение'}
                                        </div>
                                        <input type="file"
                                               onChange={this.fileUpload}
                                               ref={this.fileInput}
                                               id={'1'}
                                               name="photo"/>
                                    </label>
                                </div>
                                <label>
                                    <span>{this.props.userStore.languageList["Название"] || 'Название'}</span>
                                    <input type="text" onChange={this.changeTitleRu} name='title'
                                           ref={this.titleRef}
                                           value={this.state.titleRu}
                                           placeholder={this.props.userStore.languageList["Наименование"] || 'Наименование'}
                                    />
                                </label>
                                <label>
                                    <span>{this.props.userStore.languageList["Контент"] || 'Контент'}</span>
                                    {/*<ReactQuill*/}
                                    {/*    value={this.props.newsStore.news.content || ''}*/}
                                    {/*    onChange={this.changeContent}*/}
                                    {/*/>*/}
                                    <textarea
                                        ref={this.contentRef}
                                        style={{
                                            width: "100%",
                                            minHeight: 300,
                                            border: "1px solid #E4E8F0",
                                            padding: 12
                                        }}
                                        required
                                        onChange={() => this.setState({contentRu: this.contentRef.current.value})}
                                        value={this.state.contentRu}
                                    />
                                </label>
                                <label>
                                    <span>{this.props.userStore.languageList["Источник"] || 'Источник'}</span>
                                    <input type="text"
                                           onChange={(e) => this.setState({ sourceRu: e.target.value })}
                                           name='source'
                                           ref={this.sourceRef}
                                           value={this.state.sourceRu}
                                           placeholder={this.props.userStore.languageList["Источник"] || 'Источник'}
                                    />
                                </label>
                                <div className='checkbox'>
                                    <input type="checkbox"
                                           checked={this.state.status}
                                           ref={this.statusRef}
                                           onChange={this.handleStatusCheck}
                                           name='source'
                                           id='publish'
                                    />
                                    <label
                                        htmlFor="publish">{this.props.userStore.languageList["Опубликовать"] || 'Опубликовать'}</label>
                                </div>
                            </div>
                        </div>
                    }

                    {
                        this.state.language == 'kk' &&
                        <div className="container top">
                            <div className="data">
                                <div className="img__wrapper">
                                    {
                                        this.props.newsStore.file ?
                                            <div className={`img ${(this.state.img ? 'with-image' : 'default')}`}
                                                 style={{background: (`url(${URL.createObjectURL(this.props.newsStore.file)}) no-repeat center center/ cover`)}}
                                                 onClick={this.handleSetImage}>
                                                <div className="remove-icon" onClick={this.deletePicture}>
                                                    <RemoveIcon/>
                                                </div>
                                            </div>
                                            :
                                            <div
                                                className={`img ${(this.props.newsStore.news.picture_uri ? 'with-image' : 'default')}`}
                                                style={{background: (this.props.newsStore.news.picture_uri ? `url(${this.props.newsStore.news.picture_uri}) no-repeat center center/ cover` : '')}}
                                                onClick={this.handleSetImage}>
                                                <div className="remove-icon" onClick={this.deletePicture}>
                                                    <RemoveIcon/>
                                                </div>
                                            </div>
                                    }
                                    <label htmlFor={'1'}>
                                        <div className='button' onClick={this.handleSetImage}>
                                            <div className="icon">
                                                <CameraIcon/>
                                            </div>
                                            {this.props.userStore.languageList["Загрузить изображение"] || 'Загрузить изображение'}
                                        </div>
                                        <input type="file"
                                               onChange={this.fileUpload}
                                               ref={this.fileInput}
                                               id={'1'}
                                               name="photo"/>
                                    </label>
                                </div>
                                <label>
                                    <span>{this.props.userStore.languageList["Название"] || 'Название'}</span>
                                    <input type="text" onChange={this.changeTitleKk} name='title'
                                           ref={this.titleRef}
                                           value={this.state.titleKk}
                                           placeholder={this.props.userStore.languageList["Наименование"] || 'Наименование'}
                                    />
                                </label>
                                <label>
                                    <span>{this.props.userStore.languageList["Контент"] || 'Контент'}</span>
                                    {/*<ReactQuill*/}
                                    {/*    value={this.props.newsStore.news.content || ''}*/}
                                    {/*    onChange={this.changeContent}*/}
                                    {/*/>*/}
                                    <textarea
                                        ref={this.contentRef}
                                        style={{
                                            width: "100%",
                                            minHeight: 300,
                                            border: "1px solid #E4E8F0",
                                            padding: 12
                                        }}
                                        required
                                        onChange={() => this.setState({contentKk: this.contentRef.current.value})}
                                        value={this.state.contentKk}
                                    />
                                </label>
                                <label>
                                    <span>{this.props.userStore.languageList["Источник"] || 'Источник'}</span>
                                    <input type="text"
                                           onChange={(e) => this.setState({ sourceKk: e.target.value })}
                                           name='source'
                                           ref={this.sourceRef}
                                           value={this.state.sourceKk}
                                           placeholder={this.props.userStore.languageList["Источник"] || 'Источник'}
                                    />
                                </label>
                                <div className='checkbox'>
                                    <input type="checkbox"
                                           checked={this.state.status}
                                           ref={this.statusRef}
                                           onChange={this.handleStatusCheck}
                                           name='source'
                                           id='publish'
                                    />
                                    <label
                                        htmlFor="publish">{this.props.userStore.languageList["Опубликовать"] || 'Опубликовать'}</label>
                                </div>
                            </div>
                        </div>
                    }

                    <div className="btns">
                        <button className="cancel" onClick={() => { this.props.history.goBack() }}>{this.props.userStore.languageList["Отменить"] || 'Отменить'}</button>
                        <button className="save" onClick={this.editNews}>{this.props.userStore.languageList["Сохранить"] || 'Сохранить'}</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default inject('newsStore', 'userStore', 'permissionsStore')(observer(NewsEdit));