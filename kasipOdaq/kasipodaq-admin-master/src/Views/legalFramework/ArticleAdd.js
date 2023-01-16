import React, {Component} from 'react';
import {Link} from "react-router-dom";
import ReactQuill from "react-quill";
import {inject, observer} from "mobx-react";
import Preloader from "../../fragments/preloader/Preloader";
import {NotificationContainer, NotificationManager} from "react-notifications";
import CookieService from "../../services/CookieService";

class ArticleAdd extends Component {
    constructor(props){
        super(props);

        this.state = {
            preloader: false,
            titleRU: '',
            titleKK: '',
            content: '',
            contentKK: '',
            lang: 'ru'
        };

        this.titleRef = React.createRef();
        this.titleKKRef = React.createRef();

        this.createDocument = this.createDocument.bind(this)
    }

    componentDidMount() {
        if (this.props.match.params.id !== undefined){
            this.props.legalStore.loadLegislationList(
                this.props.match.params.id,
                null,
                (data) => {
                    this.props.legalStore.breadCrumbs = data[0].bread_crumbs;
                    this.setState({ preloader: false })
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
            this.props.legalStore.loadTypeList(
                null,
                null,
                CookieService.get('language-admin'),
                () => {
                    this.setState({ preloader: false })
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
    }

    createDocument(){
        if (this.state.titleKK.length > 0 && this.state.contentKK == ''){
            NotificationManager.error('Заполните пожалуйста описание на казахском языке');
            return
        }

        this.setState({ preloader: true });

        if (this.props.match.params.id !== undefined){
            this.props.legalStore.createDocument(
                this.props.match.params.id,
                this.state.titleRU,
                this.state.content,
                this.state.titleKK,
                this.state.contentKK,
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
                }
            )
        }else{
            this.props.legalStore.createDocumentType(
                this.state.titleRU,
                this.state.content,
                this.state.titleKK,
                this.state.contentKK,
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
                }
            )
        }

    }

    render() {

        return (
            <div className='dispute-theme content'>

                {
                    this.state.preloader &&
                        <Preloader/>
                }

                <NotificationContainer/>

                <div className="title-wrapper">
                    <h1 className="title">{this.props.userStore.languageList["Законодательная база"] || 'Законодательная база'}</h1>
                </div>
                <div className="panel">

                    <div style={{ marginBottom: 16 }}>
                        <Link style={{ color: '#0052A4' }} to={`/legals`} onClick={() => this.props.legalStore.breadCrumbs = null}>{this.props.userStore.languageList["Законодательная база"] || 'Законодательная база'}</Link>
                        <span> -> </span>
                        {
                            this.props.legalStore.breadCrumbs?.map((breadcrumb, index) => {
                                return index !== this.props.legalStore.breadCrumbs.length - 1 &&
                                    <>
                                        <Link style={{ color: '#0052A4' }} to={`/legals/${breadcrumb.resource_id}`}>{ breadcrumb.name }</Link>
                                        {
                                            index !== this.props.legalStore.breadCrumbs.length - 1 &&
                                            <span> -> </span>
                                        }
                                    </>
                            })
                        }
                    </div>

                    <div className="toggle-lang">
                        <div className="lang ru" style={{ background: this.state.lang == 'ru' ? '#00AEEF': '', color: this.state.lang == 'ru' ? '#ffffff' : '' }} onClick={() => this.setState({ lang: 'ru' }) }>{this.props.userStore.languageList['Информация на русском языке'] || 'Информация на русском языке'}</div>
                        <div className="lang kz" style={{ background: this.state.lang == 'kk' ? '#00AEEF': '', color: this.state.lang == 'kk' ? '#ffffff' : '' }} onClick={() => this.setState({ lang: 'kk' })}>{this.props.userStore.languageList['Информация на казахском языке'] || 'Информация на казахском языке'}</div>
                    </div>
                    {
                        this.state.lang == 'ru' &&
                        <div className="data">
                            <label>
                                <span>{this.props.userStore.languageList["Тема"] || 'Тема'}</span>
                                <input type="text"
                                       name='name'
                                       ref={this.titleRef}
                                       defaultValue={this.state.titleRU}
                                       onChange={() => this.setState({ titleRU: this.titleRef.current.value })}
                                       placeholder={this.props.userStore.languageList["Наименование"] || 'Наименование'}
                                />
                            </label>
                            <label>
                                <span>{this.props.userStore.languageList["Описание"] || 'Описание'}</span>
                                <ReactQuill
                                    value={this.state.content}
                                    onChange={(text) => { this.state.content = text }}
                                />
                            </label>
                        </div>
                    }
                    {
                        this.state.lang == 'kk' &&
                        <div className="data">
                            <label>
                                <span>{this.props.userStore.languageList["Тема"] || 'Тема'}</span>
                                <input type="text"
                                       name='name'
                                       ref={this.titleKKRef}
                                       defaultValue={this.state.titleKK}
                                       onChange={() => this.setState({ titleKK: this.titleKKRef.current.value })}
                                       placeholder={this.props.userStore.languageList["Наименование"] || 'Наименование'}
                                />
                            </label>
                            <label>
                                <span>{this.props.userStore.languageList["Описание"] || 'Описание'}</span>
                                <ReactQuill
                                    value={this.state.contentKK}
                                    onChange={(text) => { this.state.contentKK = text }}
                                />
                            </label>
                        </div>
                    }
                    <div className="btns">
                        <button className="cancel" onClick={() => { this.props.history.goBack() }}>{this.props.userStore.languageList["Отменить"] || 'Отменить'}</button>
                        <button className="save" onClick={this.createDocument}>{this.props.userStore.languageList["Сохранить"] || 'Сохранить'}</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default inject('legalStore', 'userStore', 'permissionsStore')(observer(ArticleAdd));