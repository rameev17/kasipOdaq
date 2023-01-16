import React, {Component} from 'react';
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import Search from "../../fragments/search";
import {withRouter} from 'react-router-dom'

import {ReactComponent as FolderIcon} from '../../assets/icons/folder.svg'
import {inject, observer} from "mobx-react";
import {NotificationContainer, NotificationManager} from "react-notifications";
import {ReactComponent as EditIcon} from "../../assets/icons/edit.svg";
import ReactQuill from "react-quill";
import AddDocument from "./AddDocument";
import OrdersList from "./OrdersList";
import CookieService from "../../services/CookieService";

class PpoList extends Component {

    constructor(props){
        super(props);

        this.state = {
            preloader: false,
            unionName: '',
            unionId: null,
            lang: CookieService.get('language-admin'),
            infoRu: '',
            infoKk: ''
        };

        this.articleSave = this.articleSave.bind(this);
        this.loadUnions = this.loadUnions.bind(this);
        this.nextPage = this.nextPage.bind(this);
        this.prevPage = this.prevPage.bind(this);
        this.searchUnion = this.searchUnion.bind(this)
    }

    loadArticle(){
        if (this.props.match.params.id !== undefined && this.props.match.params.id !== 'undefined'){
            this.props.infoStore.loadInfo(
                this.props.match.params.id,
                null,
                this.props.infoStore.INFO_KEY_BIOT_OPO,
                    'ru',
                    data => {
                this.setState({ infoRu: data[0].content });
                this.props.infoStore.aboutBiotInfoId = data[0].resource_id
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

            this.props.infoStore.loadInfo(
                this.props.match.params.id,
                null,
                this.props.infoStore.INFO_KEY_BIOT_OPO,
                'kk',
                data => {
                    this.setState({ infoKk: data[0].content })
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
            this.props.infoStore.loadInfo(
                this.props.userStore.profile.union.resource_id,
                    null,
                this.props.infoStore.INFO_KEY_BIOT_OPO,
                    'ru',
                    data => {
                this.setState({ infoRu: data[0].content });
                this.props.infoStore.aboutBiotInfoId = data[0].resource_id
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

            this.props.infoStore.loadInfo(
                this.props.userStore.profile.union.resource_id,
                null,
                this.props.infoStore.INFO_KEY_BIOT_OPO,
                'kk',
                data => {
                    this.setState({ infoKk: data[0].content })
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

    loadPpo(){
        this.props.unionStore.loadUnionsPpo(this.props.match.params.id,null, (data) => {

            this.props.unionStore.breadCrumbs = data[0].bread_crumbs

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

    componentDidMount() {
        this.loadPpo();
        this.loadArticle()
    }

    articleSave(){

        if (this.props.infoStore.aboutBiotOpoInfoId !== null){
            this.setState({ preloader:true });
            this.props.infoStore.updateInfo(
                this.props.infoStore.aboutBiotOpoInfoId,
                this.props.infoStore.aboutBiotOpoInfoId,
                this.state.infoRu,
                this.state.infoKk,
                () => {
                    NotificationManager.success('Вы успешно обновили информацию!');
                    this.setState({ editText: false });
                    this.loadArticle();

                    this.setState({ preloader: false })
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
        } else {
            this.setState({ preloader:true });
            this.props.infoStore.createInfo(
                null,
                this.state.infoRu,
                this.props.infoStore.INFO_KEY_BIOT_OPO,
                this.props.userStore.profile.union.resource_id,
                this.state.infoKk,
                () => {
                    NotificationManager.success('Вы успешно обновили информацию!');
                    this.setState({ editText: false });

                    this.loadArticle();

                    this.setState({ preloader: false })
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

    loadUnions(union){

        this.setState({ preloader: true });
        this.props.unionStore.loadUnionsPpo(union.resource_id, null,(data) => {


            this.setState({ preloader: false });

            this.props.unionStore.loadUnion(union.resource_id,
                () => {
                    this.setState({
                        unionName: this.props.unionStore.union.name,
                        unionId: union.resource_id
                    })
                });

            if (union.has_child){
                window.location.href = `/biot/opo/${union.resource_id}`
            }else{
                this.props.history.push(`/biot/ppo/${union.resource_id}`)
            }

        }, response => {
            if (Array.isArray(response.data)) {
                response.data.forEach(error => {
                    this.setState({ preloader: false })
                    // NotificationManager.error(error.message)
                })
            } else {
                this.setState({ preloader: false })
                // NotificationManager.error(response.data.message)
            }
            if (response.status == 401){
                this.setState({ preloader: false });
                this.props.history.push('/')
            }
        })
    }

    prevPage(){
        this.setState({ preloader: true });
        if (this.props.unionStore.pageNumberUnionsPpo > 1){
            this.props.unionStore.pageNumberUnionsPpo = this.props.unionStore.pageNumberUnionsPpo - 1;
            this.loadPpo()
        }else{
            this.setState({ preloader: false })
        }
    }

    nextPage(){
        this.setState({ preloader: true });
        if (this.props.unionStore.pageNumberUnionsPpo < this.props.unionStore.pageCountUnionsPpo){
            this.props.unionStore.pageNumberUnionsPpo = this.props.unionStore.pageNumberUnionsPpo + 1;
            this.loadPpo()
        }else{
            this.setState({ preloader: false })
        }
    }

    searchUnion(search){
        if (search.length > 2){
            this.setState({ preloader: true });
            this.props.unionStore.loadUnionsPpo(this.props.match.params.id, search, () => {
                this.setState({ preloader: false })
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
            this.loadPpo()
        }
    }

    render() {
        return (
            <>
            {
                this.props.permissionsStore.hasPermission('order', 'create') &&
                <AddDocument />
            }

            <OrdersList title={this.props.userStore.languageList["Приказы"] || 'Приказы'}
                        id={this.state.unionId}/>

            <div className='ppos-list plate-wrapper'>

                <h2>{this.props.userStore.languageList["Первичные профсоюзные объединения"] || 'Первичные профсоюзные объединения'}</h2>
                <Search
                    currentPage={this.props.unionStore.currentPageUnionsPpo}
                    pageCount={this.props.unionStore.pageCountUnionsPpo}
                    prevPage={this.prevPage}
                    nextPage={this.nextPage}
                    search={this.searchUnion}
                />
                <ul className="list__wrapper">
                    {
                        this.props.unionStore.unionsPpoList.map(union => {
                            return <li>
                                <Link onClick={() => this.loadUnions(union)}>
                                    <div className="icon">
                                        <FolderIcon/>
                                    </div>
                                    { union.name }
                                </Link>
                            </li>
                        })
                    }

                </ul>
            </div>

            <div className="boit-info plate-wrapper">
                <div className="title-wrapper">
                    <h2 className={'opo'}>
                        {this.props.userStore.languageList["Безопасность и охрана труда"] || 'Безопасность и охрана труда'}
                    </h2>
                    <div className='line'/>

                    {/*<button onClick={this.editText}>*/}
                    {/*    <div className="btn-action">*/}
                    {/*        <div className="icon">*/}
                    {/*            <EditIcon/>*/}
                    {/*        </div>*/}
                    {/*        <span>Добавить текст</span>*/}
                    {/*    </div>*/}
                    {/*</button>*/}

                    {
                        this.props.userStore.role == 'industry' &&
                        <button onClick={() => { this.setState({ editText: true }) }}>
                            <div className="btn-action">
                                <div className="icon">
                                    <EditIcon/>
                                </div>
                                <span>{this.props.userStore.languageList["Редактировать"] || 'Редактировать'}</span>
                            </div>
                        </button>
                    }
                </div>
                <div className="text">
                    <div className={`level `} dangerouslySetInnerHTML={{ __html: this.state.infoRu }}>
                    </div>

                    {
                        this.state.editText &&
                        <React.Fragment>
                            <div className='additionalText'>
                                <div className="toggle-lang">
                                    <div className="lang ru" style={{ background: this.state.lang == 'ru' ? '#00AEEF': '', color: this.state.lang == 'ru' ? '#ffffff' : '' }} onClick={() => this.setState({ lang: 'ru' }) }>{this.props.userStore.languageList['Информация на русском языке'] || 'Информация на русском языке'}</div>
                                    <div className="lang kz" style={{ background: this.state.lang == 'kk' ? '#00AEEF': '', color: this.state.lang == 'kk' ? '#ffffff' : '' }} onClick={() => this.setState({ lang: 'kk' })}>{this.props.userStore.languageList['Информация на казахском языке'] || 'Информация на казахском языке'}</div>
                                </div>
                                {
                                    this.state.lang == 'ru' &&
                                    <div className="wrapper data">
                                        <label>
                                            <span>{this.props.userStore.languageList["Описание"] || 'Описание'}</span>
                                            <ReactQuill
                                                value={this.state.infoRu }
                                                onChange={(text) => { this.setState({ infoRu: text })}}
                                            />
                                        </label>
                                    </div>
                                }
                                {
                                    this.state.lang == 'kk' &&
                                    <div className="wrapper data">
                                        <label>
                                            <span>{this.props.userStore.languageList["Описание"] || 'Описание'}</span>
                                            <ReactQuill
                                                value={this.state.infoKk }
                                                onChange={(text) => { this.setState({ infoKk: text }) }}
                                            />
                                        </label>
                                    </div>
                                }
                                <div className="btns">
                                    <button className="cancel" onClick={() => { this.setState({ editText: false }) }}>{this.props.userStore.languageList["Отменить"] || 'Отменить'}</button>
                                    <button className="save" onClick={this.articleSave}>{this.props.userStore.languageList["Сохранить"] || 'Сохранить'}</button>
                                </div>
                            </div>
                        </React.Fragment>
                    }
                </div>
            </div>
            </>
        );
    }
}

export default withRouter(inject('unionStore', 'permissionsStore', 'infoStore', 'userStore')(observer(PpoList)));