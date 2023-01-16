import React, {Component} from 'react';
import {Link} from "react-router-dom";
import TabsLayout from "../Containers/TabsLayout";
import ReactQuill from 'react-quill'
import {ReactComponent as EditIcon} from "../../assets/icons/edit.svg";
import {inject, observer} from "mobx-react";
import {NotificationContainer, NotificationManager} from "react-notifications";
import Preloader from "../../fragments/preloader/Preloader";
import CookieService from "../../services/CookieService";

const DisputeDirectionInfo = inject('disputeStore', 'infoStore', 'permissionsStore', 'userStore')(observer(class DisputeDirectionInfo extends Component {
    constructor(props){
        super(props);

        this.state = {
            tabs: [
                {name: this.props.userStore.languageList["Споры"] || 'Споры'},
                {name: this.props.userStore.languageList["Информация"] || 'Информация'}
            ],
            preloader: true,
            lang: CookieService.get('language-admin'),
            infoRu: '',
            infoKk: ''
        };

        this.changeTabCallback = this.changeTabCallback.bind(this);
        this.saveEditInfo = this.saveEditInfo.bind(this);
        this.infoChange = this.infoChange.bind(this)
    }

    loadInfo(){
        this.props.infoStore.infoDispute = '';
        this.props.infoStore.infoDisputeId = null;

        this.props.infoStore.loadInfo(
            null,
            this.props.match.params.id,
            this.props.infoStore.INFO_KEY_DISPUTE,
            'ru',
            data => {
                if (data.length > 0){
                    this.setState({ infoRu: data[0].content });
                    this.props.infoStore.infoDisputeId = data[0].resource_id
                }
                this.setState({
                    preloader: false
                })
            }, response => {
                if (Array.isArray(response.data)) {
                    response.data.forEach(error => {
                        this.setState({ preloader: false })
                    })
                } else {
                    this.setState({ preloader: false })
                }
                if (response.status == 401){
                    this.setState({ preloader: false });
                    this.props.history.push('/')
                }
            });

        this.props.infoStore.loadInfo(
            null,
            this.props.match.params.id,
            this.props.infoStore.INFO_KEY_DISPUTE,
            'kk',
            data => {
                if (data.length > 0){
                    this.setState({ infoKk: data[0].content })
                }
                this.setState({
                    preloader: false
                })
            }, response => {
                if (Array.isArray(response.data)) {
                    response.data.forEach(error => {
                        this.setState({ preloader: false })
                    })
                } else {
                    this.setState({ preloader: false })
                }
                if (response.status == 401){
                    this.setState({ preloader: false });
                    this.props.history.push('/')
                }
            });

        this.props.disputeStore.loadCategoryInfoDispute(() => {
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

    componentDidMount() {
        this.loadInfo()
    }

    changeTabCallback = (tab) => {
        switch (tab) {
            case '1':
                this.props.userStore.role == 'company' ?
                    this.props.history.push({
                        pathname:`/dispute`,
                        state: { tabId: 1 }
                    })
                    :
                    this.props.history.goBack();
                break;
            case '2':
                this.props.history.push({
                    pathname: `/dispute/info`,
                    state: { tabId: 2 }
                });
                break;
            default:
                this.props.history.push({
                    pathname:`/dispute`,
                    state: { tabId: 1 }
                })
        }
    };

    saveEditInfo(){
        this.setState({ preloader: true });

        if (this.props.infoStore.infoDisputeId !== null) {
            this.props.infoStore.updateInfo(
                this.props.infoStore.infoDisputeId,
                this.props.infoStore.infoDisputeId,
                this.state.infoRu,
                this.state.infoKk,
                () => {
                NotificationManager.success('Вы успешно обновили информацию!');
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
            this.props.infoStore.createInfo(
                this.props.match.params.id,
                this.state.infoRu,
                this.props.infoStore.INFO_KEY_DISPUTE,
                this.props.userStore.profile.union.resource_id,
                this.state.infoKk,
                () => {
                NotificationManager.success('Вы успешно обновили информацию!');
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

    infoChange(text){
        this.props.infoStore.infoDispute = text
    }

    render() {

        return (
            <div className='dispute-info content'>

                {
                    this.state.preloader &&
                    <Preloader/>
                }
                <NotificationContainer/>

                <div className="title-wrapper">
                    <h1 className="title">{this.props.userStore.languageList["Трудовой спор"] || 'Трудовой спор'}</h1>
                    {
                        this.props.userStore.role !== 'fprk' &&
                        <>
                            {
                                this.props.match.params.id !== undefined && this.props.match.params.id !== 'undefined' ?
                                    <Link
                                        to={{pathname:`/dispute/add-dispute/` + this.props.match.params.id }}>
                                        {this.props.userStore.languageList["Добавить спор"] || 'Добавить спор'}
                                    </Link>
                                    :
                                    <Link
                                        to={{pathname:`/dispute/add-dispute/` + this.props.userStore.profile.union.resource_id }}>
                                        {this.props.userStore.languageList["Добавить спор"] || 'Добавить спор'}
                                    </Link>
                            }
                        </>
                    }
                </div>
                <div className="panel">
                    <TabsLayout tabs={this.state.tabs}
                                changeTabCallback={this.changeTabCallback}>
                        <div className='subtitle-wrapper'>

                            <div style={{ marginBottom: 16, marginTop: 16 }}>
                                <Link style={{ color: '#0052A4' }} to={`/dispute/info`}>{this.props.userStore.languageList['Информация'] || 'Информация'}</Link>
                                <span> -> </span>
                                <Link style={{ color: '#0052A4' }}>{
                                    this.props.disputeStore.disputeInfoCategory.map(category => {
                                        return category.resource_id == this.props.match.params.id && this.props.userStore.languageList[category.name]
                                    })
                                }</Link>
                            </div>

                            {/*<h2 className="subtitle">Трудовой спор</h2>*/}

                                {/*<React.Fragment>*/}
                                {/*    <div className="line"/>*/}
                                {/*    <button onClick={this.editText}>*/}
                                {/*        <div className="btn-action">*/}
                                {/*            <div className="icon">*/}
                                {/*                <EditIcon/>*/}
                                {/*            </div>*/}
                                {/*            <span>Редактировать</span>*/}
                                {/*        </div>*/}
                                {/*    </button>*/}
                                {/*</React.Fragment>*/}

                        </div>

                        {/*<div>*/}
                        {/*    description*/}
                        {/*</div>*/}

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
                                <button className="cancel" onClick={() => { this.props.history.goBack() }}>{this.props.userStore.languageList["Отменить"] || 'Отменить'}</button>
                                <button className="save" onClick={this.saveEditInfo}>{this.props.userStore.languageList["Сохранить"] || 'Сохранить'}</button>
                            </div>
                        </div>
                    </TabsLayout>
                </div>
            </div>
        );
    }
}));

export default inject('disputeStore', 'permissionsStore', 'userStore')(observer(DisputeDirectionInfo));