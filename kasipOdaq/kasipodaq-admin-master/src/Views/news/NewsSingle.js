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

class NewsSingle extends Component {

    constructor(props){
        super(props);

        this.state = {
            preloader: true,
            title: '',
            content: '',
            source: '',
            status: 0,
        };

        this.titleRef = React.createRef();
        this.sourceRef = React.createRef();
        this.statusRef = React.createRef();
        this.fileInput = React.createRef();

        this.loadPage = this.loadPage.bind(this)
    }

    loadPage(){
        this.props.newsStore.loadNews(this.props.match.params.id, CookieService.get('language-admin'),() => {
            this.setState({
                preloader: false,
                status: this.props.newsStore.newsStatus
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
        this.loadPage()
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
                    <span>{this.props.userStore.languageList["Новость"] || 'Новость'}</span>
                </h1>
                <div className={'panel'}>
                    <div className="toggle-lang">
                        {/*<div className="lang ru">Информация на русском языке</div>*/}
                        {/*<div className="lang kz">Информация на казахском языке</div>*/}
                    </div>

                    <div style={{ marginBottom: 16 }}>
                        {/*<Link style={{ color: '#0052A4' }} to={`/news`}>Все новости</Link>*/}
                        {/*<span> -> </span>*/}
                        {/*<Link style={{ color: '#0052A4' }}>{this.props.newsStore.news.title}</Link>*/}
                        <Link style={{ color: '#0052A4' }} onClick={() => this.props.history.goBack()}>{this.props.userStore.languageList['Вернуться назад'] || 'Вернуться назад'}</Link>
                    </div>

                    <div className="container top">
                        <div className="data">
                            <div className="img__wrapper">
                                {
                                    this.props.newsStore.file ?
                                        <div className={`img ${(this.state.img ? 'with-image' : 'default')}`}
                                             style={{background: (`url(${URL.createObjectURL(this.props.newsStore.file)}) no-repeat center center/ cover` )}}
                                             >
                                        </div>
                                        :
                                        <div className={`img ${(this.props.newsStore.news.picture_uri ? 'with-image' : 'default')}`}
                                             style={{background: (this.props.newsStore.news.picture_uri ? `url(${this.props.newsStore.news.picture_uri}) no-repeat center center/ cover` : '' )}}
                                             >
                                        </div>
                                }
                            </div>
                            <label>
                                <span>{this.props.userStore.languageList["Название"] || 'Название'}</span>
                                <div dangerouslySetInnerHTML={{__html: this.props.newsStore.news.title}}
                                     style={{
                                         border: "1px solid #E4E8F0",
                                         padding: 10,
                                         color: "#2E384D"
                                     }} />
                            </label>
                            <label>
                                <span>{this.props.userStore.languageList["Контент"] || 'Контент'}</span>
                                <div dangerouslySetInnerHTML={{__html: this.props.newsStore.news.content}}
                                     style={{
                                        border: "1px solid #E4E8F0",
                                        padding: 10,
                                        color: "#2E384D"
                                }} />
                            </label>
                            <label>
                                <span>{this.props.userStore.languageList["Источник"] || 'Источник'}</span>
                                <div dangerouslySetInnerHTML={{__html: this.props.newsStore.news.source}}
                                     style={{
                                         border: "1px solid #E4E8F0",
                                         padding: 10,
                                         color: "#2E384D"
                                     }} />
                            </label>
                            <div className='checkbox'>
                                <input type="checkbox"
                                       checked={this.state.status}
                                       ref={this.statusRef}
                                       name='source'
                                       id='publish'
                                />
                                <label for="publish">{this.props.userStore.languageList["Опубликовать"] || 'Опубликовать'}</label>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}

export default inject('newsStore', 'userStore', 'permissionsStore')(observer(NewsSingle));