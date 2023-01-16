import React, {Component} from 'react';
import TabsLayout from "../Containers/TabsLayout";
import {Route, Switch} from "react-router";
import {withRouter} from 'react-router-dom'
import AddDocument from './AddDocument'
import OrdersList from './OrdersList'
import {inject, observer} from "mobx-react";
import {ReactComponent as EditIcon} from "../../assets/icons/edit.svg";
import ReactQuill from "react-quill";
import {NotificationContainer, NotificationManager} from "react-notifications";
import CookieService from "../../services/CookieService";

class Ppo extends Component {

    constructor(props){
        super(props);

        this.state = {
            preloader: false,
            editText: false,
            lang: CookieService.get('language-admin'),
            infoRu: '',
            infoKk: ''
        };

        this.articleSave = this.articleSave.bind(this)
    }

    loadPage(){
        if (this.props.match.params.id !== undefined && this.props.match.params.id !== 'undefined'){

            this.props.unionStore.loadUnion(this.props.match.params.id);

            this.props.infoStore.loadInfo(
                this.props.match.params.id,
                null,
                this.props.infoStore.INFO_KEY_BIOT,
                'ru',
                data => {
                    this.setState({ infoRu: data[0].content }, () => {
                        this.props.infoStore.aboutBiotInfoId = data[0].resource_id
                    });

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
                this.props.infoStore.INFO_KEY_BIOT,
                'kk',
                data => {
                    this.setState({ infoKk: data[0].content }, () => {
                        this.props.infoStore.aboutBiotInfoId = data[0].resource_id;
                        console.log(this.props.infoStore.aboutBiotInfoId)
                    })
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

            this.props.unionStore.loadUnion(this.props.userStore.profile.union.resource_id);

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
    }

    componentDidMount() {
        this.loadPage()
    }

    articleSave(){

        if (this.state.infoRu !== ''){
            this.setState({ preloader: true });
            this.props.infoStore.updateInfo(
                this.props.infoStore.aboutBiotInfoId,
                this.props.infoStore.aboutBiotInfoId,
                this.state.infoRu,
                this.state.infoKk,
                () => {
                    NotificationManager.success('Вы успешно обновили информацию!');
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
                    NotificationManager.success('Вы успешно обновили информацию!');
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

                {
                    this.props.userStore.role !== 'association' &&
                    <AddDocument />
                }

                <OrdersList title={this.props.userStore.languageList["Приказы"] || 'Приказы'}
                            unionName={this.props.unionStore.union.name}/>


                {/*<OrdersList title={`Приказы `}*/}
                {/*            orders={this.props.ppoWorkOrders}*/}
                {/*            headers={this.props.ppoWorkOrdersHeaders}*/}
                {/*            deleteOrder={this.deleteOrder}*/}
                {/*            editOrder={this.editOrder}*/}
                {/*            from='self'/>*/}

                {/*<OrdersList title={`Приказы`}*/}
                {/*            orders={this.props.opoWorkOrders}*/}
                {/*            headers={this.props.opoWorkOrdersHeaders}*/}
                {/*            deleteOrder={this.deleteOrder}*/}
                {/*            editOrder={this.editOrder}*/}
                {/*            from='opo'/> }*/}

                {/*<OrdersList title={`Приказы `}*/}
                {/*            orders={this.props.ppoWorkOrders}*/}
                {/*            headers={this.props.ppoWorkOrdersHeaders}*/}
                {/*            deleteOrder={this.deleteOrder}*/}
                {/*            editOrder={this.editOrder}*/}
                {/*            from='ppo'/>*/}


                {/*<OrdersList title={`Приказы`}*/}
                {/*            orders={this.props.ppoWorkOrders}*/}
                {/*            headers={this.props.ppoWorkOrdersHeaders}*/}
                {/*            deleteOrder={this.deleteOrder}*/}
                {/*            editOrder={this.editOrder}*/}
                {/*            from='fprk'/>*/}

                {/*<OrdersList title={`Приказы`}*/}
                {/*            orders={this.props.opoWorkOrders}*/}
                {/*            headers={this.props.opoWorkOrdersHeaders}*/}
                {/*            deleteOrder={this.deleteOrder}*/}
                {/*            editOrder={this.editOrder}*/}
                {/*            from='opo'/> }*/}

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
                            this.props.userStore.role == 'company' &&
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

            </React.Fragment>
        );
    }
}

export default withRouter(inject('biotStore', 'permissionsStore', 'infoStore', 'userStore', 'unionStore')(observer(Ppo)));