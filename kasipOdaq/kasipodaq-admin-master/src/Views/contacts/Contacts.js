import React, {Component} from 'react';
import {ReactComponent as EditIcon} from "../../assets/icons/edit.svg";
import ReactQuill from "react-quill";
import Layout from "../Containers/Layout";
import {inject, observer} from "mobx-react";
import Preloader from "../../fragments/preloader/Preloader";
import {NotificationContainer, NotificationManager} from "react-notifications";
import CookieService from "../../services/CookieService";

class Contacts extends Component {
    constructor(props){
        super(props);

        this.state = {
            preloader: false,
            lang: CookieService.get('language-admin'),
            infoRu: '',
            infoKk: ''
        };

        this.editContactsInfo = this.editContactsInfo.bind(this)
    }

    loadInfo(){
        this.props.userStore.profileInfo(() => {
            this.props.infoStore.loadInfo(
                null,
                null,
                this.props.infoStore.INFO_KEY_CONTACTS,
                'ru',
                data => {
                    this.setState({ infoRu: data[0].content });
                    this.props.infoStore.infoContactsId = data[0].resource_id;

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
                });

            this.props.infoStore.loadInfo(
                null,
                null,
                this.props.infoStore.INFO_KEY_CONTACTS,
                'kk',
                data => {
                    this.setState({ infoKk: data[0].content });

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

    changeDescription = (text) => {
        this.setState({description: text})
    };

    editContactsInfo(){
        this.setState({ preloader: true });
        console.log(this.props.infoStore.infoContactsId);
        if (this.props.infoStore.infoContactsId !== null) {
            this.props.infoStore.updateInfo(
                this.props.infoStore.infoContactsId,
                this.props.infoStore.infoContactsId,
                this.state.infoRu,
                this.state.infoKk,
                () => {
                this.loadInfo();
                NotificationManager.success('Вы успешно обновили информацию!')
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
            this.props.infoStore.createInfo(
                null,
                this.props.infoStore.infoContacts,
                this.state.infoRu,
                null,
                this.state.infoKk,
                () => {
                this.loadInfo();
                NotificationManager.success('Вы успешно создали информацию!')
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
            <Layout title='Контакты'>
                {
                    this.state.preloader &&
                        <Preloader/>
                }

                <NotificationContainer/>

                <div className="content">
                    <h1 className='title'>{this.props.userStore.languageList["Контакты"] || 'Контакты'}</h1>
                    <div className="panel">
                        <div className="histtory__wrapper">
                            <div className="title-wrapper">
                                <div className="line"/>
                                {/*<button className='btn__wrapper' onClick={this.toggleEditInfo}>*/}
                                {/*    <div className="btn-action">*/}
                                {/*        <div className="icon">*/}
                                {/*            <EditIcon/>*/}
                                {/*        </div>*/}
                                {/*        <span>Редактировать</span>*/}
                                {/*    </div>*/}
                                {/*</button>*/}
                            </div>
                            {/*<div className="content">*/}
                            {/*    description*/}
                            {/*</div>*/}
                        </div>

                        <div className='histtory__wrapper'>
                            <div className="toggle-lang">
                                <div className="lang ru" style={{ background: this.state.lang == 'ru' ? '#00AEEF': '', color: this.state.lang == 'ru' ? '#ffffff' : '' }} onClick={() => this.setState({ lang: 'ru' }) }>{this.props.userStore.languageList['Информация на русском языке'] || 'Информация на русском языке'}</div>
                                <div className="lang kz" style={{ background: this.state.lang == 'kk' ? '#00AEEF': '', color: this.state.lang == 'kk' ? '#ffffff' : '' }} onClick={() => this.setState({ lang: 'kk' })}>{this.props.userStore.languageList['Информация на казахском языке'] || 'Информация на казахском языке'}</div>
                            </div>
                            {
                                this.state.lang == 'ru' &&
                                <div className="data">
                                    <label>
                                        <span>{this.props.userStore.languageList["Описание"] || 'Описание'}</span>
                                        <ReactQuill
                                            value={this.state.infoRu}
                                            onChange={(text) => { this.setState({ infoRu: text })}}
                                        />
                                    </label>
                                </div>
                            }

                            {
                                this.state.lang == 'kk'  &&
                                <div className="data">
                                    <label>
                                        <span>{this.props.userStore.languageList["Описание"] || 'Описание'}</span>
                                        <ReactQuill
                                            value={this.state.infoKk}
                                            onChange={(text) => { this.setState({ infoKk: text }) }}
                                        />
                                    </label>
                                </div>
                            }
                            <div className="btns">
                                {/*<button className="cancel" onClick={this.toggleEditInfo}>Отменить</button>*/}
                                <button className="save" onClick={this.editContactsInfo}>{this.props.userStore.languageList["Сохранить"] || 'Сохранить'}</button>
                            </div>
                        </div>

                    </div>
                </div>
            </Layout>
        );
    }
}

export default inject('infoStore', 'permissionsStore', 'userStore')(observer(Contacts));