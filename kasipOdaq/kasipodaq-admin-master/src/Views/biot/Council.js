import React, {Component} from 'react';
import {Link} from 'react-router-dom'
import ReactQuill from 'react-quill';

import {connect} from 'react-redux'
import {ReactComponent as EditIcon} from '../../assets/icons/edit.svg'
import {inject, observer} from "mobx-react";
import {NotificationContainer, NotificationManager} from "react-notifications";
import Preloader from "../../fragments/preloader/Preloader";
import CookieService from "../../services/CookieService";

class Council extends Component {

    constructor(props) {
        super(props);

        this.state = {
            preloader: false,
            editText: false,
            lang: CookieService.get('language-admin'),
            infoRu: '',
            infoKk: ''
        };

        this.articleSaveFprk = this.articleSaveFprk.bind(this);
        this.articleSave = this.articleSave.bind(this)
    }

    loadInfo(){
        this.props.userStore.profileInfo(data => {
            data.roles[0] == 'fprk' ?

                this.props.infoStore.loadInfo(
                    data.union.resource_id,
                    null,
                    this.props.infoStore.INFO_KEY_COUNCIL,
                    'ru',
                    data => {
                        this.setState({ infoRu: data[0].content });
                        this.props.infoStore.aboutCouncilInfoId = data[0].resource_id
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
                &&
                this.props.infoStore.loadInfo(
                    data.union.resource_id,
                    null,
                    this.props.infoStore.INFO_KEY_COUNCIL,
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
                :
                this.props.infoStore.loadInfo(
                    data.union.resource_id,
                    null,
                    this.props.infoStore.INFO_KEY_COUNCIL,
                    'ru',
                    data => {
                        this.setState({ infoRu: data[0].content });
                        this.props.infoStore.aboutCouncilInfoId = data[0].resource_id
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
                data.union.resource_id,
                null,
                this.props.infoStore.INFO_KEY_COUNCIL,
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

    componentDidMount() {
        this.loadInfo()
    }

    articleSaveFprk() {
        if (this.props.infoStore.aboutCouncilInfoId !== null){
            this.setState({ preloader: true });
            this.props.infoStore.updateInfo(
                this.props.infoStore.aboutCouncilInfoId,
                this.props.infoStore.aboutCouncilInfoId,
                this.state.infoRu,
                this.state.infoKk,
                () => {
                NotificationManager.success('Вы успешно обновили информацию!');
                this.setState({ editText: false });
                this.loadInfo();
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
            this.setState({ preloader: true });
            this.props.infoStore.createInfo(
                null,
                this.state.infoRu,
                this.props.infoStore.INFO_KEY_COUNCIL,
                null,
                this.state.infoKk,
                () => {
                NotificationManager.success('Вы успешно обновили информацию!');
                this.setState({ editText: false });
                this.loadInfo();
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

    articleSave() {
        if (this.props.infoStore.aboutCouncilInfoId !== null){
            this.setState({ preloader: true });
            this.props.infoStore.updateInfo(
                this.props.infoStore.aboutCouncilInfoId,
                this.props.infoStore.aboutCouncilInfoId,
                this.state.infoRu,
                this.state.infoKk,
                () => {
                NotificationManager.success('Вы успешно обновили информацию!');
                this.setState({ editText: false });
                this.loadInfo();
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
            this.setState({ preloader: true });
            this.props.infoStore.createInfo(
                null,
                this.state.infoRu,
                this.props.infoStore.INFO_KEY_COUNCIL,
                this.props.userStore.profile.union.resource_id,
                this.state.infoKk,
                () => {
                NotificationManager.success('Вы успешно обновили информацию!');
                this.setState({ editText: false });
                this.loadInfo();
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

        const modules = {
            toolbar: [
                [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
                [{size: []}],
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                [{'list': 'ordered'}, {'list': 'bullet'},
                    {'indent': '-1'}, {'indent': '+1'}],
                ['link', 'image', 'video'],
                ['clean']
            ],
            clipboard: {
                // toggle to add extra line breaks when pasting HTML:
                matchVisual: false,
            }
        };

        return (
            <div className="council">
                {
                    this.state.preloader &&
                        <Preloader/>
                }

                <NotificationContainer/>

                <div className="title-wrapper">
                    <h2 className={`subtitle`}>
                        {this.props.userStore.languageList["Производственный совет по безопасности и охране труда"]
                        || 'Производственный совет по безопасности и охране труда'}
                    </h2>
                    {
                        // this.props.userStore.role !== 'association' &&
                        //     this.props.userStore.role !== 'fprk' &&
                        <React.Fragment>
                            <div className="line"></div>
                            <div className="btn-action" onClick={() => { this.setState({ editText: true }) }}>
                                <div className="icon">
                                    <EditIcon/>
                                </div>
                                <span>{this.props.userStore.languageList["Редактировать"] || 'Редактировать'}</span>
                            </div>
                        </React.Fragment>
                    }
                </div>
                <div className="text">
                    {/*{*/}
                    {/*    // this.props.userStore.role !== 'fprk' &&*/}
                    {/*    <React.Fragment>*/}
                    {/*        <div className={`level 1`} dangerouslySetInnerHTML={{ __html: this.props.infoStore.aboutCouncilInfo }}>*/}
                    {/*        </div>*/}
                    {/*        {*/}
                    {/*            this.state.editText &&*/}
                    {/*            <div className='additionalText'>*/}
                    {/*                <div className="toggle-lang">*/}
                    {/*                    /!*<div className="lang ru">Информация на русском языке</div>*!/*/}
                    {/*                    /!*<div className="lang kz">Информация на казахском языке</div>*!/*/}
                    {/*                </div>*/}
                    {/*                <div className="wrapper data">*/}
                    {/*                    <label>*/}
                    {/*                        <span>{this.props.userStore.languageList["Описание"] || 'Описание'}</span>*/}
                    {/*                        <ReactQuill*/}
                    {/*                            modules={modules}*/}
                    {/*                            value={this.props.infoStore.aboutCouncilInfo || '' }*/}
                    {/*                            onChange={(text) => { this.props.infoStore.aboutCouncilInfo = text }}*/}
                    {/*                        />*/}
                    {/*                    </label>*/}
                    {/*                </div>*/}
                    {/*                <div className="btns">*/}
                    {/*                    <button className="cancel" onClick={() => { this.setState({ editText: false }) }}>{this.props.userStore.languageList["Отменить"] || 'Отменить'}</button>*/}
                    {/*                    <button className="save" onClick={this.articleSaveFprk}>{this.props.userStore.languageList["Сохранить"] || 'Сохранить'}</button>*/}
                    {/*                </div>*/}
                    {/*            </div>*/}
                    {/*        }*/}
                    {/*    </React.Fragment>*/}
                    {/*}*/}

                    {
                        // this.props.userStore.role !== 'fprk' &&
                        <React.Fragment>
                            <div className={`level 1`} dangerouslySetInnerHTML={{ __html: this.props.infoStore.aboutCouncilInfo }}>
                            </div>
                            {
                                this.state.editText &&
                                <div className='additionalText'>
                                    <div className="toggle-lang">
                                        <div className="lang ru" style={{ background: this.state.lang == 'ru' ? '#00AEEF': '', color: this.state.lang == 'ru' ? '#ffffff' : '' }} onClick={() => this.setState({ lang: 'ru' })}>{this.props.userStore.languageList['Информация на русском языке'] || 'Информация на русском языке'}</div>
                                        <div className="lang kz" style={{ background: this.state.lang == 'kk' ? '#00AEEF': '', color: this.state.lang == 'kk' ? '#ffffff' : '' }} onClick={() => this.setState({ lang: 'kk' })}>{this.props.userStore.languageList['Информация на казахском языке'] || 'Информация на казахском языке'}</div>
                                    </div>
                                    {
                                        this.state.lang == 'ru' &&
                                        <div className="wrapper data">
                                            <label>
                                                <span>{this.props.userStore.languageList["Описание"] || 'Описание'}</span>
                                                <ReactQuill
                                                    modules={modules}
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
                                                    modules={modules}
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
                            }
                        </React.Fragment>
                    }

                    {/*<div className='additionalText'>*/}
                    {/*    <div className="toggle-lang">*/}
                    {/*        <div className="lang ru">Информация на русском языке</div>*/}
                    {/*        <div className="lang kz">Информация на казахском языке</div>*/}
                    {/*    </div>*/}
                    {/*    <div className="wrapper data">*/}
                    {/*        <label>*/}
                    {/*            <span>Описание</span>*/}
                    {/*            <ReactQuill*/}
                    {/*                value={this.state.additionalText}*/}
                    {/*                onChange={this.handleChangeText}*/}
                    {/*            />*/}
                    {/*        </label>*/}
                    {/*    </div>*/}
                    {/*    <div className="btns">*/}
                    {/*        <button className="cancel" onClick={this.editText}>Отменить</button>*/}
                    {/*        <button className="save" onClick={this.saveWorkCouncilPost}>Создать</button>*/}
                    {/*    </div>*/}
                    {/*</div>*/}

                </div>
            </div>
        );
    }
}

export default inject('infoStore', 'permissionsStore', 'userStore')(observer(Council));