import React, {Component} from 'react';
import ReactQuill from 'react-quill'
import {inject, observer} from "mobx-react";
import {NotificationContainer, NotificationManager} from "react-notifications";
import Preloader from "../../fragments/preloader/Preloader";
import {Link} from "react-router-dom";
import CookieService from "../../services/CookieService";

class ArticleEdit extends Component {
    constructor(props){
        super(props);

        this.state = {
            preloader: true,
            language: CookieService.get('language-admin'),
            titleRu: '',
            contentRu: '',
            titleKk: '',
            contentKk: ''
        };

        this.titleRef = React.createRef();

        this.editArticle = this.editArticle.bind(this);
        this.changeLanguageRu = this.changeLanguageRu.bind(this);
        this.changeLanguageKk = this.changeLanguageKk.bind(this)
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

        this.props.legalStore.loadLegislationArticle(this.props.match.params.id, 'ru', () => {
            this.setState({
                preloader: false,
                titleRu: this.props.legalStore.legislation.title,
                contentRu: this.props.legalStore.legislation.content
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
        });

        this.props.legalStore.loadLegislationArticle(this.props.match.params.id, 'kk', () => {
            this.setState({
                preloader: false,
                titleKk: this.props.legalStore.legislation.title,
                contentKk: this.props.legalStore.legislation.content
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

    editArticle(){
            this.props.legalStore.editLegislation(
                this.props.match.params.id,
                this.state.titleRu,
                this.state.contentRu,
                this.state.titleKk,
                this.state.contentKk,
                () => {
                    this.setState({preloader: false});
                    this.props.history.goBack()
                }, response => {
                    if (Array.isArray(response.data)) {
                        response.data.forEach(error => {
                            this.setState({preloader: false});
                            NotificationManager.error(error.message)
                        })
                    } else {
                        this.setState({preloader: false});
                        NotificationManager.error(response.data.message)
                    }
                    if (response.status == 401){
                        this.setState({ preloader: false });
                        this.props.history.push('/')
                    }
                }
            )
    }

    changeLanguageRu(){
        this.setState({ language: 'ru' })
    }

    changeLanguageKk(){
        this.setState({ language: 'kk' })
    }

    render() {

        return (
            <div className='dispute-theme'>

                {
                    this.state.preloader &&
                        <Preloader/>
                }

                <NotificationContainer/>

                <div className="title-wrapper">
                    <h1 className="title">title</h1>
                    {/*<Link to={`/dispute/ppo/${this.props.match.params.ppo}/direction/${this.props.match.params.direction}/add-dispute`}>Добавить спор</Link>*/}
                </div>
                <div className="panel">

                    <div style={{ marginBottom: 16 }}>
                        <Link style={{ color: '#0052A4' }} to={`/legals`} onClick={() => this.props.legalStore.breadCrumbs = null}>{this.props.userStore.languageList['Законодательная база'] || 'Законодательная база'}</Link>
                        <span> -> </span>
                        {
                            this.props.legalStore.breadCrumbs?.map((breadcrumb, index) => {
                                return <> <Link style={{ color: '#0052A4' }} to={`/legals/${breadcrumb.resource_id}`}>{ breadcrumb.name }</Link>
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
                        this.state.language == 'ru' &&
                        <div className="data">
                            <label>
                                <span>{this.props.userStore.languageList["Тема"] || 'Тема'}</span>
                                <input type="text"
                                       name='name'
                                       ref={this.titleRef}
                                       onChange={(e)  => { this.setState({ titleRu: e.target.value }) } }
                                       value={this.state.titleRu}
                                       placeholder={this.props.userStore.languageList["Наименование"] || 'Наименование'}
                                />
                            </label>
                            <label>
                                <span>{this.props.userStore.languageList["Описание"] || 'Описание'}</span>
                                <ReactQuill
                                    value={this.state.contentRu || ''}
                                    onChange={(text) => { this.setState({ contentRu: text }) } }
                                />
                            </label>
                        </div>
                    }

                    {
                        this.state.language == 'kk' &&
                        <div className="data">
                            <label>
                                <span>{this.props.userStore.languageList["Тема"] || 'Тема'}</span>
                                <input type="text"
                                       name='name'
                                       ref={this.titleRef}
                                       onChange={(e)  => { this.setState({ titleKk:  e.target.value }) } }
                                       value={this.state.titleKk}
                                       placeholder={this.props.userStore.languageList["Наименование"] || 'Наименование'}
                                />
                            </label>
                            <label>
                                <span>{this.props.userStore.languageList["Описание"] || 'Описание'}</span>
                                <ReactQuill
                                    value={this.state.contentKk || ''}
                                    onChange={(text) => { this.setState({ contentKk: text }) } }
                                />
                            </label>
                        </div>
                    }

                    <div className="btns">
                        <button className="cancel" onClick={() => { this.props.history.goBack() }}>{this.props.userStore.languageList["Отменить"] || 'Отменить'}</button>
                        <button className="save" onClick={this.editArticle}>{this.props.userStore.languageList["Сохранить"] || 'Сохранить'}</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default inject('legalStore', 'userStore', 'permissionsStore')(observer(ArticleEdit));