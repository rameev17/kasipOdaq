import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import Layout from "../../fragments/layout/Layout";

import {NotificationContainer, NotificationManager} from 'react-notifications';
import { ModalCreateUnion } from '../../fragments/modals/Modal';

import {ReactComponent as LogoIcon} from '../../assets/icons/logo.svg';
import {ReactComponent as DeleteIcon} from '../../assets/icons/close.svg';
import {ReactComponent as DownloadIcon} from '../../assets/icons/download.svg';
import {ReactComponent as RightIcon} from '../../assets/icons/arrow.svg';

import './style.scss';

import { observer, inject } from "mobx-react";
import Preloader from "../../fragments/preloader/Preloader";
import CookieService from "../../services/CookieService";
import {ReactComponent as CheckedIcon} from "../../assets/icons/checked.svg";
import {Textbox} from "react-inputs-validation";

class UnionCreate extends Component{

    constructor(props){
        super(props)

        this.state = {
            preloader: false,
            protocolFileName: '',
            modalIsOpen: false,
            union_name: "",
            industryName: '',
            unionAssociation: ''
        }

        this.industryRef = React.createRef()
        this.protocolfileInput = React.createRef()
        this.positionFileInput = React.createRef()
        this.statementFileInput = React.createRef()

        this.protocolFileUpload = this.protocolFileUpload.bind(this)
        this.positionFileUpload = this.positionFileUpload.bind(this)
        this.statementFileUpload = this.statementFileUpload.bind(this)

        this.togglePass = this.togglePass.bind(this);
        this.toggleRepeatPass = this.toggleRepeatPass.bind(this);
        this.renderRedirect = this.renderRedirect.bind(this)
        this.industrySelect = this.industrySelect.bind(this)
        this.closeModal = this.closeModal.bind(this)
    }

    componentDidMount() {
        this.props.userStore.protocolFile = {
            name: this.props.userStore.languageList["Прикрепить протокол"] || 'Прикрепить протокол',
            id: null
        };
        this.props.userStore.positionFile = {
            name: this.props.userStore.languageList["Прикрепить положение"] || 'Прикрепить положение',
            id: null
        };
        this.props.userStore.statementFile = {
            name: this.props.userStore.languageList["Прикрепить заявление"] || 'Прикрепить заявление',
            id: null
        };
        this.setState({ industryName: this.props.unionStore.industry.name })
        this.setState({ unionAssociation: this.props.unionStore.unionAssociation.name })

        this.props.userStore.loadIndustries( () => {
            this.props.unionStore.unions = {}
        },response => {
            if (Array.isArray(response.data)) {
                response.data.forEach(error => {
                    this.setState({preloader: false})
                    NotificationManager.error(error.message)
                })
            } else {
                NotificationManager.error(response.data.message)
                this.setState({preloader: false})
            }
            if (response.status == 401){
                CookieService.remove('token')
                this.setState({ preloader: false })
                this.props.history.push('/auth')
            }
        });
    }

    protocolFileUpload(){
        this.props.userStore.protocolFile = this.protocolfileInput.current.files[0]
    }

    positionFileUpload(){
        this.props.userStore.positionFile = this.positionFileInput.current.files[0]
    }

    statementFileUpload(){
        this.props.userStore.statementFile = this.statementFileInput.current.files[0]
    }

    togglePass() {
        this.setState({showPass: !this.state.showPass})
    }

    toggleRepeatPass() {
        this.setState({showRepeatPass: !this.state.showRepeatPass})
    }

    renderRedirect(e) {
        e.preventDefault()

        this.props.userStore.setUnionName(this.props.unionStore.unionName);

        if (this.protocolfileInput.current.files.length <= 0 ){
            NotificationManager.error('Прикрепите пожалуйста протокол')
        }else if (this.positionFileInput.current.files.length <= 0){
            NotificationManager.error('Прикрепите пожалуйста положение')
        }else if (this.statementFileInput.current.files.length <= 0) {
            NotificationManager.error('Прикрепите пожалуйста заявление')
        }else if(this.state.industryName == undefined && this.state.unionAssociation == undefined){
            NotificationManager.error('Выберите, пожалуйста отраслевое объединение или профсоюзное объединение')
        }else{
            this.setState({ preloader: true })

            this.props.userStore.uploadFile(this.props.userStore.protocolFile, (data, headers) => {
                this.props.userStore.protocolFile.id = headers['x-entity-id']

                this.props.userStore.uploadFile(this.props.userStore.positionFile, (data, headers) => {
                    this.props.userStore.positionFile.id = headers['x-entity-id']

                    this.props.userStore.uploadFile(this.props.userStore.statementFile, (data, headers) => {
                        this.props.userStore.statementFile.id = headers['x-entity-id']

                        this.props.userStore.createUnion(
                            this.props.unionStore.unionAssociation.resource_id || null,
                            this.props.unionStore.industry.resource_id || null,
                            this.props.unionStore.place.resource_id || null,
                            data => {

                            this.setState({
                                preloader: false,
                                modalIsOpen: true
                            })

                        }, response => {
                            if (Array.isArray(response.data)) {
                                response.data.forEach(error => {
                                    this.setState({preloader: false})
                                    NotificationManager.error(error.message)
                                })
                            } else {
                                NotificationManager.error(response.data.message)
                                this.setState({preloader: false})
                            }
                            if (response.status == 401){
                                CookieService.remove('token')
                                this.setState({ preloader: false })
                                this.props.history.push('/auth')
                            }
                        })
                    },response => {
                        if (Array.isArray(response.data)) {
                            response.data.forEach(error => {
                                this.setState({ preloader: false })
                                NotificationManager.error(error.message)
                            })
                        } else {
                            this.setState({ preloader: false })
                            NotificationManager.error(response.data.message)
                        }
                        if (response.status == 401){
                            CookieService.remove('token')
                            this.setState({ preloader: false })
                            this.props.history.push('/auth')
                        }
                    })
                },response => {
                    if (Array.isArray(response.data)) {
                        response.data.forEach(error => {
                            this.setState({ preloader: false })
                            NotificationManager.error(error.message)
                        })
                    } else {
                        this.setState({ preloader: false })
                        NotificationManager.error(response.data.message)
                    }
                    if (response.status == 401){
                        CookieService.remove('token')
                        this.setState({ preloader: false })
                        this.props.history.push('/auth')
                    }
                })
            },response => {
                if (Array.isArray(response.data)) {
                    response.data.forEach(error => {
                        this.setState({ preloader: false })
                        NotificationManager.error(error.message)
                    })
                } else {
                    this.setState({ preloader: false })
                    NotificationManager.error(response.data.message)
                }
                if (response.status == 401){
                    CookieService.remove('token')
                    this.setState({ preloader: false })
                    this.props.history.push('/auth')
                }
            });
        }
    }

    industrySelect(){
        this.props.userStore.setIndustry(this.industryRef.current.value)
        this.props.unionStore.loadUnions(this.industryRef.current.value)
    }

    closeModal() {
        this.setState({
            modalIsOpen: false
        })
    }

    render(){
        return(
            <Layout title={'Создать профсоюз'}>
                {
                    this.state.preloader &&
                    <Preloader/>
                }
                <NotificationContainer/>
                <div className='step step-registration step-order-append'>
                    <form className="form" onSubmit={ this.renderRedirect } style={{ marginBottom: '120px' }}>
                        <div className="logo-wrapper">
                            <LogoIcon/>
                        </div>
                        <label>
                            <p className="label">{this.props.userStore.languageList["Первичная организация"] || 'Первичная организация'} <span>*</span></p>
                            <Textbox
                                attributesInput={{
                                    id: 'union_name',
                                    name: 'union_name',
                                    value: this.props.unionStore.unionName,
                                    type: 'text',
                                    placeholder: this.props.userStore.languageList["Заполните поле"] || 'Заполните поле',
                                    required: true,
                                }}
                                onChange={(union_name) => { this.props.unionStore.unionName = union_name }}
                                onBlur={() => {}}
                                validationOption={{
                                    name: 'Поле',
                                    check: true,
                                    required: true,
                                    locale: "ru",
                                }}
                            />
                        </label>

                        <label>
                            <Link to={"/create-union/places"}>
                                <div className="doc" style={{ display: 'flex', justifyContent: 'space-between', alignItems: "center" }}>
                                    <span className="title" style={{ color: "#9A9B9C" }}>
                                        { this.props.unionStore.place.name ?
                                            this.props.unionStore.place?.name
                                            : this.props.userStore.languageList["Город/область"] || 'Город/область'
                                        }
                                    </span>
                                    <div className="icon" style={{ display: 'block' }} >
                                        <RightIcon />
                                    </div>
                                </div>
                            </Link>
                        </label>

                        <label>
                            <Link to={"/create-union/industries"}>
                                <div className="doc" style={{ display: 'flex', justifyContent: 'space-between', alignItems: "center" }}>
                                    <span className="title" style={{ color: "#9A9B9C" }}>
                                        { this.props.unionStore.industry.name ?
                                            this.props.unionStore.industry.name
                                            : this.props.userStore.languageList["Отраслевое объединение"] || 'Отраслевое объединение'
                                        }
                                    </span>
                                    <div className="icon" style={{ display: 'block' }} >
                                        <RightIcon />
                                    </div>
                                </div>
                            </Link>
                        </label>

                        <label>
                            <Link to={"/create-union/unions"}>
                                <div className="doc" style={{ display: 'flex', justifyContent: 'space-between', alignItems: "center" }}>
                                    <span className="title" style={{ color: "#9A9B9C" }}>
                                        { this.props.unionStore.unionAssociation.name ?
                                            this.props.unionStore.unionAssociation?.name
                                            : this.props.userStore.languageList["Профсоюзное объединение"] || 'Профсоюзное объединение'
                                        }
                                    </span>
                                    <div className="icon" style={{ display: 'block' }} >
                                        <RightIcon />
                                    </div>
                                </div>
                            </Link>
                        </label>

                        {/*<label>*/}
                        {/*    <select style={{ width: '100%', border: '1px solid #E4E8F0', padding: '10px', borderRadius: '5px', fontSize: '16px', color: '#cfd2dc' }}*/}
                        {/*            ref={this.industryRef}*/}
                        {/*            name="industry"*/}
                        {/*            onChange={this.industrySelect}*/}
                        {/*            required*/}
                        {/*    >*/}
                        {/*        <option value=''>Отраслевое объединение</option>*/}

                        {/*        {*/}
                        {/*            this.props.userStore.industriesList.map((industry, index) => {*/}
                        {/*                return <option value={industry.resource_id} key={index}>{ industry.name }</option>*/}
                        {/*            })*/}
                        {/*        }*/}

                        {/*    </select>*/}
                        {/*</label>*/}

                        <label>
                            <a href={this.props.unionStore.unions.protocol_sample ? this.props.unionStore.unions.protocol_sample.uri : "#"}>
                                <div className="doc" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span className="title">
                                    { this.props.unionStore.unions.protocol_sample ?
                                        this.props.unionStore.unions.protocol_sample?.name
                                        : this.props.userStore.languageList["Проект протокола"] || 'Проект протокола'
                                    }
                                </span>
                                    <div className="icon" style={{ display: 'block' }} >
                                        <DownloadIcon />
                                    </div>
                                </div>
                            </a>
                        </label>

                        <label>
                            <a href={this.props.unionStore.unions.position_sample ? this.props.unionStore.unions.position_sample.uri : "#"}>
                                <div className="doc" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span className="title">
                                    { this.props.unionStore.unions.position_sample ?
                                        this.props.unionStore.unions.position_sample?.name
                                        : this.props.userStore.languageList["Проект положения"] || 'Проект положения'
                                    }
                                </span>
                                    <div className="icon" style={{ display: 'block' }} >
                                        <DownloadIcon />
                                    </div>
                                </div>
                            </a>
                        </label>

                        <label>
                            <a href={this.props.unionStore.unions.statement_sample ? this.props.unionStore.unions.statement_sample.uri : "#"}>
                                <div className="doc" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span className="title">
                                    { this.props.unionStore.unions.statement_sample ?
                                        this.props.unionStore.unions.statement_sample?.name
                                        : this.props.userStore.languageList["Скачать заявление"] || 'Скачать заявление'
                                    }
                                </span>
                                    <div className="icon" style={{ display: 'block' }} >
                                        <DownloadIcon />
                                    </div>
                                </div>
                            </a>
                        </label>


                        <label>
                            <div className="doc">
                            <span className="title">
                                {
                                    this.props.userStore.protocolFile.name
                                }
                            </span>
                                <input type="file"
                                       multiple
                                       onChange={this.protocolFileUpload}
                                       ref={ this.protocolfileInput }
                                />
                                <div className="icon" >
                                    <DeleteIcon/>
                                </div>
                            </div>
                        </label>
                        <label>
                            <div className="doc">
                            <span className="title">
                                {
                                    this.props.userStore.positionFile.name
                                }
                            </span>
                                <input type="file"
                                       onChange={this.positionFileUpload}
                                       ref={ this.positionFileInput }
                                />
                                <div className="icon">
                                    <DeleteIcon/>
                                </div>
                            </div>
                        </label>
                        <label>
                            <div className="doc">
                            <span className="title">
                                {
                                    this.props.userStore.statementFile.name
                                }
                            </span>
                                <input type="file"
                                       onChange={this.statementFileUpload}
                                       ref={ this.statementFileInput }
                                />
                                <div className="icon">
                                    <DeleteIcon/>
                                </div>
                            </div>
                        </label>

                        <button type='submit'>{this.props.userStore.languageList["Отправить заявку"] || 'Отправить заявку'}</button>
                    </form>

                    <p>
                        <CheckedIcon/> {this.props.userStore.languageList["Нажимая на кнопку, Вы соглашаетесь на обработку персональных данных"] || 'Нажимая на кнопку, Вы соглашаетесь на обработку персональных данных'}
                    </p>
                    {
                        this.state.modalIsOpen &&
                        <ModalCreateUnion
                            closeModal = {this.closeModal}
                        />
                    }
                </div>

            </Layout>
        )
    }
}

export default inject('userStore', 'unionStore', 'permissionsStore')(observer(UnionCreate));
