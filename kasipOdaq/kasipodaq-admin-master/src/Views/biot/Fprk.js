import React, {Component} from 'react';
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import Search from '../../fragments/search';

import {ReactComponent as FolderIcon} from "../../assets/icons/folder.svg";
import {inject, observer} from "mobx-react";
import {NotificationContainer, NotificationManager} from "react-notifications";
import {ReactComponent as EditIcon} from "../../assets/icons/edit.svg";
import ReactQuill from "react-quill";
import CookieService from "../../services/CookieService";

class Fprk extends Component {

    constructor(props) {
        super(props);

        this.state = {
            preloader: false,
            editText: false,
            lang: CookieService.get('language-admin'),
            infoRu: '',
            infoKk: ''
        };

        this.loadPage = this.loadPage.bind(this);
        this.prevPage = this.prevPage.bind(this);
        this.nextPage = this.nextPage.bind(this);
        this.articleSave = this.articleSave.bind(this);
        this.searchIndustries = this.searchIndustries.bind(this)
    }

    componentDidMount() {
        this.loadPage()
    }

    loadPage(){
        this.props.unionStore.loadIndustries(null,() => {
            this.setState({ preloader: false })
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
        });

        this.props.infoStore.loadInfo(
            this.props.userStore.profile.union.resource_id,
            null,
            this.props.infoStore.INFO_KEY_BIOT,
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
            this.props.infoStore.INFO_KEY_BIOT,
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

    prevPage(){
        this.setState({ preloader: true });
        if (this.props.unionStore.pageNumberIndustries > 1){
            this.props.unionStore.pageNumberIndustries = this.props.unionStore.pageNumberIndustries - 1;
            this.loadPage()
        }else{
            this.setState({ preloader: false })
        }
    }

    nextPage(){
        this.setState({ preloader: true });
        if (this.props.unionStore.pageNumberIndustries < this.props.unionStore.pageCountIndustries){
            this.props.unionStore.pageNumberIndustries = this.props.unionStore.pageNumberIndustries + 1;
            this.loadPage()
        }else{
            this.setState({ preloader: false })
        }
    }

    searchIndustries(search){
        if (search.length > 2){
            this.setState({ preloader: true });
            this.props.unionStore.loadIndustries(search, () => {
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
            });
            this.setState({ preloader: false })
        }else{
            this.loadPage()
        }
    }

    articleSave(){
        if (this.state.infoRu !== ''){
            this.setState({ preloader:true });
            this.props.infoStore.updateInfo(
                this.props.infoStore.aboutBiotInfoId,
                this.props.infoStore.aboutBiotInfoId,
                this.state.infoRu,
                this.state.infoKk,
                () => {
                    NotificationManager.success('???? ?????????????? ???????????????? ????????????????????!');
                    this.setState({ editText: false });
                    this.loadPage();

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
                this.props.infoStore.INFO_KEY_BIOT,
                this.props.userStore.profile.union.resource_id,
                this.state.infoKk,
                () => {
                    NotificationManager.success('???? ?????????????? ???????????????? ????????????????????!');
                    this.setState({ editText: false });

                    this.loadPage();

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

    render() {
        return (
            <React.Fragment>

            <div className='opo-list__wrapper plate-wrapper'>
                <h2 className='from'>{this.props.userStore.languageList["???????????????????? ??????????????????????"] || '???????????????????? ??????????????????????'}</h2>
                <Search
                    currentPage={this.props.unionStore.currentPageIndustries}
                    pageCount={this.props.unionStore.pageCountIndustries}
                    prevPage={this.prevPage}
                    nextPage={this.nextPage}
                    search={this.searchIndustries}
                />
                <ul className="list__wrapper">
                    {
                        this.props.unionStore.industriesList.map(industry => {
                            return  <li>
                                <Link to={`/biot/opo/` + industry.resource_id}>
                                    <div className="icon">
                                        <FolderIcon/>
                                    </div>
                                    { industry.name }
                                </Link>
                            </li>
                        })
                    }
                </ul>
            </div>

            <div className="boit-info plate-wrapper">
                <div className="title-wrapper">
                    <h2 className={'opo'}>
                        {this.props.userStore.languageList["???????????????????????? ?? ???????????? ??????????"] || '???????????????????????? ?? ???????????? ??????????'}
                    </h2>
                    <div className='line'/>

                    {/*<button onClick={this.editText}>*/}
                    {/*    <div className="btn-action">*/}
                    {/*        <div className="icon">*/}
                    {/*            <EditIcon/>*/}
                    {/*        </div>*/}
                    {/*        <span>???????????????? ??????????</span>*/}
                    {/*    </div>*/}
                    {/*</button>*/}

                    {
                        this.props.userStore.role == 'fprk' &&
                        <button onClick={() => { this.setState({ editText: true }) }}>
                            <div className="btn-action">
                                <div className="icon">
                                    <EditIcon/>
                                </div>
                                <span>{this.props.userStore.languageList["??????????????????????????"] || '??????????????????????????'}</span>
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
                                    <div className="lang ru" style={{ background: this.state.lang == 'ru' ? '#00AEEF': '', color: this.state.lang == 'ru' ? '#ffffff' : '' }} onClick={() => this.setState({ lang: 'ru' }) }>{this.props.userStore.languageList['???????????????????? ???? ?????????????? ??????????'] || '???????????????????? ???? ?????????????? ??????????'}</div>
                                    <div className="lang kz" style={{ background: this.state.lang == 'kk' ? '#00AEEF': '', color: this.state.lang == 'kk' ? '#ffffff' : '' }} onClick={() => this.setState({ lang: 'kk' })}>{this.props.userStore.languageList['???????????????????? ???? ?????????????????? ??????????'] || '???????????????????? ???? ?????????????????? ??????????'}</div>
                                </div>
                                {
                                    this.state.lang == 'ru' &&
                                    <div className="wrapper data">
                                        <label>
                                            <span>{this.props.userStore.languageList["????????????????"] || '????????????????'}</span>
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
                                            <span>{this.props.userStore.languageList["????????????????"] || '????????????????'}</span>
                                            <ReactQuill
                                                value={this.state.infoKk }
                                                onChange={(text) => { this.setState({ infoKk: text }) }}
                                            />
                                        </label>
                                    </div>
                                }
                                <div className="btns">
                                    <button className="cancel" onClick={() => { this.setState({ editText: false }) }}>{this.props.userStore.languageList["????????????????"] || '????????????????'}</button>
                                    <button className="save" onClick={this.articleSave}>{this.props.userStore.languageList["??????????????????"] || '??????????????????'}</button>
                                </div>
                            </div>
                        </React.Fragment>

                    }

                    {/*<div className='additionalText'>*/}
                    {/*    <div className="toggle-lang">*/}
                    {/*        <div className="lang ru">???????????????????? ???? ?????????????? ??????????</div>*/}
                    {/*        <div className="lang kz">???????????????????? ???? ?????????????????? ??????????</div>*/}
                    {/*    </div>*/}
                    {/*    <div className="wrapper data">*/}
                    {/*        <label>*/}
                    {/*            <span>????????????????</span>*/}
                    {/*            <ReactQuill*/}
                    {/*            />*/}
                    {/*        </label>*/}
                    {/*    </div>*/}
                    {/*    <div className="btns">*/}
                    {/*        <button className="cancel" onClick={this.editText}>????????????????</button>*/}
                    {/*        <button className="save" onClick={this.saveSalpPost}>??????????????</button>*/}
                    {/*    </div>*/}
                    {/*</div>*/}

                </div>
            </div>

            </React.Fragment>
        );
    }
}

export default inject('unionStore', 'permissionsStore', 'infoStore', 'userStore')(observer(Fprk));