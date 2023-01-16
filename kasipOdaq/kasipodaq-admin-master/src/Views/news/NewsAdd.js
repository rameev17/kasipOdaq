import React, {Component} from 'react';
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css';

import {ReactComponent as RemoveIcon} from '../../assets/icons/delete.svg'
import {ReactComponent as CameraIcon} from '../../assets/icons/camera.svg'
import {inject, observer} from "mobx-react";
import Preloader from "../../fragments/preloader/Preloader";
import {NotificationContainer, NotificationManager} from "react-notifications";
import {Link} from "react-router-dom";

class NewsAdd extends Component {

    constructor(props) {
        super(props);

        this.state = {
            preloader: false,
            content: '',
            status: 0,
            lang: 'ru',
            img: '',
            titleRU: '',
            titleKK: '',
            contentRU: '',
            contentKK: '',
            sourceRU: '',
            sourceKk: ''
        };

        this.titleRU = React.createRef();
        this.titleKK = React.createRef();
        this.contentRU = React.createRef();
        this.contentRef = React.createRef();
        this.contentKKRef = React.createRef();
        this.sourceRU = React.createRef();
        this.sourceKk = React.createRef();

        this.fileInput = React.createRef();

        this.createNews = this.createNews.bind(this);
        this.handleChangeContent = this.handleChangeContent.bind(this);
        this.handleStatusCheck = this.handleStatusCheck.bind(this);
        this.fileUpload = this.fileUpload.bind(this);
        this.removePicture = this.removePicture.bind(this)
    }

    createNews() {
        this.setState({preloader: true});

        let titleRU = this.state.titleRU;
        let titleKK = this.state.titleKK;
        let contentRU = this.state.contentRU;
        let contentKK = this.state.contentKK;
        let sourceRU = this.state.sourceRU;
        let sourceKk = this.state.sourceKk;
        let status = this.state.status ? 1 : 0;

        if (titleRU == '' || titleRU == undefined) {
            this.setState({preloader: false});
            NotificationManager.error(' Заполните пожалуйста поле "Название" ')
        } else if (this.state.contentRU == '' || this.state.contentRU == undefined) {
            this.setState({preloader: false});
            NotificationManager.error(' Заполните пожалуйста поле "Контент" ')
        } else if (sourceRU == ''){
            this.setState({preloader: false});
            NotificationManager.error(' Заполните пожалуйста поле "Источник" ')
        } else if (titleKK == '' && contentKK.length > 0) {
            this.setState({preloader: false});
            NotificationManager.error(' Заполните пожалуйста поле "Название на казахском языке" ')
        } else if (titleKK.length > 0 && contentKK == '') {
            this.setState({preloader: false});
            NotificationManager.error(' Заполните пожалуйста поле "Контент на казахском языке" ')
        } else {

                if (this.props.newsStore.file){
                    this.props.newsStore.uploadFile(data => {
                        this.props.newsStore.createNews(
                            titleRU,
                            contentRU,
                            sourceRU,
                            sourceKk,
                            status,
                            titleKK,
                            contentKK,
                            () => {
                                this.setState({ preloader: false });
                                this.props.history.push('/news')
                            }, response => {
                                if (response.status == 401){
                                    this.setState({ preloader: false });
                                    this.props.history.push('/')
                                }
                            }
                        )
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
                    this.props.newsStore.createNews(
                        titleRU,
                        contentRU,
                        sourceRU,
                        sourceKk,
                        status,
                        titleKK,
                        contentKK,
                        () => {
                            this.setState({ preloader: false });
                            this.props.history.push('/news')
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

    handleChangeContent(text){
        this.setState({
            content: text
        })
    }

    handleStatusCheck(){
        this.setState({
            status: !this.state.status
        })
    }

    fileUpload(){
        let file = this.fileInput.current.files[0];

        this.props.newsStore.file = file;

        this.setState({
            img: 'with-image'
        })
    }

    removePicture(){
        this.props.newsStore.file = null;
        this.fileInput.current.value = null;
        this.setState({ img: '' })
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
                    <span>{this.props.userStore.languageList["Добавить новость"] || 'Добавить новость'}</span>
                </h1>
                <div className={this.role !== 'rManagerOpo' ? 'panel' : ''}>

                    <div style={{ marginBottom: 16 }}>
                        <Link style={{ color: '#0052A4' }} to={`/news`}>{this.props.userStore.languageList['Все новости'] || 'Все новости'}</Link>
                        <span> -> </span>
                        <Link style={{ color: '#0052A4' }}>{this.props.userStore.languageList['Добавить новость'] || 'Добавить новость'}</Link>
                    </div>


                    <div className="toggle-lang">
                        <div className="lang ru" style={{ background: this.state.lang == 'ru' ? '#00AEEF': '', color: this.state.lang == 'ru' ? '#ffffff' : '' }} onClick={() => { this.setState({ lang: 'ru' }) }}>{this.props.userStore.languageList['Информация на русском языке'] || 'Информация на русском языке'}</div>
                        <div className="lang kz" style={{ background: this.state.lang == 'kk' ? '#00AEEF': '', color: this.state.lang == 'kk' ? '#ffffff' : '' }} onClick={() => { this.setState({ lang: 'kk' }) }}>{this.props.userStore.languageList['Информация на казахском языке'] || 'Информация на казахском языке'}</div>
                    </div>

                    {
                        this.state.lang == 'ru' &&
                        <div className="container top">
                            <div className="data">
                                <div className="img__wrapper">
                                    <div className={`img ${(this.state.img ? 'with-image' : 'default')}`}
                                         style={{background: (this.state.img ? `url(${URL.createObjectURL(this.props.newsStore.file)}) no-repeat center center/ cover` : '')}}
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
                                            {this.props.userStore.languageList["Загрузить изображение"] || 'Загрузить изображение'}
                                        </div>
                                    <input type="file"
                                           onChange={this.fileUpload}
                                           ref={this.fileInput}
                                           name="photo"/>
                                    </label>
                                </div>
                                <label htmlFor={'title'}>
                                    <span>{this.props.userStore.languageList["Название"] || 'Название'}</span>
                                    <input type="text"
                                           name='title'
                                           ref={this.titleRU}
                                           defaultValue={this.state.titleRU}
                                           onChange={() => this.setState({titleRU: this.titleRU.current.value})}
                                           required
                                           placeholder={this.props.userStore.languageList["Наименование"] || 'Наименование'}
                                    />
                                </label>
                                <label>
                                    <span>{this.props.userStore.languageList["Контент"] || 'Контент'}</span>
                                    {/*<ReactQuill*/}
                                    {/*    value={this.state.content}*/}
                                    {/*    onChange={this.handleChangeContent}*/}
                                    {/*    required*/}
                                    {/*/>*/}
                                    {/*<input type="text" name='title'*/}
                                    {/*       ref={this.contentRef}*/}
                                    {/*       required*/}
                                    {/*       style={{ minHeight: 300 }}*/}
                                    {/*/>*/}
                                    <textarea
                                        style={{
                                            width: "100%",
                                            minHeight: 300,
                                            border: "1px solid #E4E8F0",
                                            padding: 12
                                        }}
                                        defaultValue={this.state.contentRU}
                                        onChange={() => this.setState({ contentRU: this.contentRef.current?.value })}
                                        required
                                        ref={this.contentRef}
                                        />

                                </label>
                                <label>
                                    <span>{this.props.userStore.languageList["Источник"] || 'Источник'}</span>
                                    <input type="text" name='source'
                                           ref={this.sourceRU}
                                           defaultValue={this.sourceRU.current?.value}
                                           onChange={() => this.setState({ sourceRU: this.sourceRU.current?.value })}
                                           required
                                           placeholder={this.props.userStore.languageList["Источник"] || 'Источник'}
                                    />
                                </label>
                                <div className='checkbox'>
                                    <input type="checkbox"
                                           checked={this.state.status}
                                           onClick={this.handleStatusCheck}
                                           id="source"
                                           name='source'
                                    />
                                    <label htmlFor="source">
                                        <div>{this.props.userStore.languageList["Опубликовать"] || 'Опубликовать'}</div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    }

                    {
                        this.state.lang == 'kk' &&
                        <div className="container top">
                            <div className="data">
                                <div className="img__wrapper">
                                    <div className={`img ${(this.state.img ? 'with-image' : 'default')}`}
                                         style={{background: (this.state.img ? `url(${URL.createObjectURL(this.props.newsStore.file)}) no-repeat center center/ cover` : '')}}
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
                                            {this.props.userStore.languageList["Загрузить изображение"] || 'Загрузить изображение'}
                                        </div>
                                        <input type="file"
                                               onChange={this.fileUpload}
                                               ref={this.fileInput}
                                               name="photo"/>
                                    </label>
                                </div>
                                <label htmlFor={'title2'}>
                                    <span>{this.props.userStore.languageList["Название"] || 'Название'}</span>
                                    <input type="text" name='title2'
                                           ref={this.titleKK}
                                           defaultValue={this.state.titleKK}
                                           onChange={() => this.setState({titleKK: this.titleKK.current.value})}
                                           placeholder={this.props.userStore.languageList["Наименование"] || 'Наименование'}
                                    />
                                </label>
                                <label>
                                    <span>{this.props.userStore.languageList["Контент"] || 'Контент'}</span>
                                    {/*<ReactQuill*/}
                                    {/*    value={this.state.content}*/}
                                    {/*    onChange={this.handleChangeContent}*/}
                                    {/*    required*/}
                                    {/*/>*/}
                                    {/*<input type="text" name='title'*/}
                                    {/*       ref={this.contentRef}*/}
                                    {/*       required*/}
                                    {/*       style={{ minHeight: 300 }}*/}
                                    {/*/>*/}
                                    <textarea
                                        style={{
                                            width: "100%",
                                            minHeight: 300,
                                            border: "1px solid #E4E8F0",
                                            padding: 12
                                        }}
                                        defaultValue={this.state.contentKK}
                                        onChange={() => this.setState({ contentKK: this.contentKKRef.current?.value })}
                                        ref={this.contentKKRef}
                                    />

                                </label>
                                <label>
                                    <span>{this.props.userStore.languageList["Источник"] || 'Источник'}</span>
                                    <input type="text" name='source'
                                           ref={this.sourceKk}
                                           defaultValue={this.sourceKk.current?.value}
                                           onChange={() => this.setState({ sourceKk: this.sourceKk.current?.value })}
                                           required
                                           placeholder={this.props.userStore.languageList["Источник"] || 'Источник'}
                                    />
                                </label>
                                <div className='checkbox'>
                                    <input type="checkbox"
                                           checked={this.state.status}
                                           onClick={this.handleStatusCheck}
                                           id="source"
                                           name='source'
                                    />
                                    <label htmlFor="source">
                                        <div>{this.props.userStore.languageList["Опубликовать"] || 'Опубликовать'}</div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    }

                    <div className="btns">
                        <button className="cancel" onClick={() => { this.props.history.goBack() }}>{this.props.userStore.languageList["Отменить"] || 'Отменить'}</button>
                        <button className="save" onClick={this.createNews}>{this.props.userStore.languageList["Сохранить"] || 'Сохранить'}</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default inject('newsStore', 'userStore', 'permissionsStore')(observer(NewsAdd));