import React, {Component} from 'react';
import {Link} from "react-router-dom";
import ReactQuill from 'react-quill'
import {connect} from 'react-redux'
import 'react-quill/dist/quill.snow.css';

import {ReactComponent as DownloadIcon} from '../../assets/icons/download.svg'
import {ReactComponent as RemoveIcon} from '../../assets/icons/delete.svg'
import {ReactComponent as AppendIcon} from '../../assets/icons/clip.svg'
import {ReactComponent as CameraIcon} from '../../assets/icons/camera.svg'
import {inject, observer} from "mobx-react";
import Preloader from "../../fragments/preloader/Preloader";
import {NotificationContainer, NotificationManager} from "react-notifications";

import axios from "axios";
import {ReactComponent as LeftArrowIcon} from "../../assets/icons/arrow.svg";


class TopEdit extends Component {

    constructor(props) {
        super(props);

        this.state = {
            preloader: false,
            isNewPicture: false,
            isNewProtocol: false,
            isNewPosition: false,
            isNewStatement: false,
            isNewAgreement: false,
        }

        this.fileUploadRef = React.createRef()
        this.titleRef = React.createRef()

        this.protocolRef = React.createRef()
        this.positionRef = React.createRef()
        this.collectiveAgreementRef = React.createRef()
        this.statementRef = React.createRef()

        this.fileChange = this.fileChange.bind(this)
        this.savePpo = this.savePpo.bind(this)
        this.protocolChange = this.protocolChange.bind(this)
        this.collectiveAgreementChange = this.collectiveAgreementChange.bind(this)
        this.positionChange = this.positionChange.bind(this)
        this.statementChange = this.statementChange.bind(this)
        this.deletePicture = this.deletePicture.bind(this)
    }


    loadPage(){
        this.props.unionStore.loadUnion(this.props.match.params.id, response => {

            this.props.unionStore.pictureFile = null;

        }, response => {
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
                this.setState({ preloader: false })
                this.props.history.push('/')
            }
        })
    }

    componentDidMount() {
        this.loadPage()
    }

    protocolChange(){
        let file = this.protocolRef.current.files[0]
        this.props.unionStore.protocolFile = file

        this.setState({ isNewProtocol: true })
    }

    collectiveAgreementChange(){
        this.props.unionStore.collectiveAgreementFile = this.collectiveAgreementRef.current.files[0]
        this.setState({ isNewAgreement: true })
    }

    positionChange(){
        this.props.unionStore.positionFile = this.positionRef.current.files[0]
        this.setState({ isNewPosition: true })
    }

    statementChange(){
        this.props.unionStore.statementFile = this.statementRef.current.files[0]
        this.setState({ isNewStatement: true })
    }

    fileChange(){
        this.setState({ preloader: true })
        let file = this.fileUploadRef.current.files[0]

        this.props.unionStore.pictureFile = file

        this.setState({ preloader: false, isNewPicture: true })
    }

    async uploadFiles() {
        if (this.state.isNewPicture) {
            this.setState({isNewPicture: false})

            await this.props.unionStore.uploadPictureFile()
        }

        if (this.state.isNewProtocol){
            this.setState({isNewProtocol: false})

            await this.props.unionStore.uploadFile(
                this.props.unionStore.protocolFile,(data, headers) => {
                    this.props.unionStore.protocolFile.id = headers['x-entity-id']
                }
            )
        }

        if (this.state.isNewPosition){
            this.setState({isNewPosition: false})

            await this.props.unionStore.uploadFile(
                this.props.unionStore.positionFile, (data, headers) => {
                    this.props.unionStore.positionFile.id = headers['x-entity-id']
                }
            )
        }

        if (this.state.isNewStatement){
            this.setState({isNewStatement: false})

            await this.props.unionStore.uploadFile(
                this.props.unionStore.statementFile, (data, headers) => {
                    this.props.unionStore.statementFile.id = headers['x-entity-id']
                }
            )
        }

        if (this.state.isNewAgreement){
            this.setState({isNewAgreement: false})

            await this.props.unionStore.uploadFile(
                this.props.unionStore.collectiveAgreementFile, (data, headers) => {
                    this.props.unionStore.collectiveAgreementFile.id = headers['x-entity-id']
                }
            )
        }
    }

    deletePicture(){
        this.props.unionStore.deleteFile(
            this.props.match.params.id,
            () => {
                this.loadPage()
            }, response => {
                if (Array.isArray(response.data)) {
                    response.data.forEach(error => {
                        this.setState({ preloader: false })
                        NotificationManager.error(error.message)
                    })
                } else {
                    this.setState({ preloader: false })
                    NotificationManager.error(response.message)
                }
                if (response.status == 401){
                    this.setState({ preloader: false })
                    this.props.history.push('/')
                }
            }
        )
    }

    savePpo(){
        // if(this.charterRef.current.files.length <= 0){
        //      NotificationManager.error('Прикрепите пожалуйста устав')
        //  }else if(this.claimRef.current.files.length <= 0) {
        //      NotificationManager.error('Прикрепите пожалуйста заявление')
        //  }else{

        this.setState({ preloader: true })

        Promise.resolve(this.uploadFiles()).then(() => {
            this.props.unionStore.editUnion(
                this.props.match.params.id,
                this.titleRef.current.value,
                this.props.unionStore.union.about_company,
                this.props.unionStore.union.about_union,
                () => {
                    this.setState({preloader: false})
                    this.props.history.goBack()
                }, response => {
                    if (Array.isArray(response.data)) {
                        response.data.forEach(error => {
                            this.setState({preloader: false})
                            NotificationManager.error(error.message)
                        })
                    } else {
                        this.setState({preloader: false})
                        NotificationManager.error(response.data.message)
                    }
                    if (response.status == 401) {
                        this.setState({preloader: false})
                        this.props.history.push('/')
                    }
                }
            )
        })
    }

    render() {

        return (
            <div className="ppo-edit">

                {
                    this.state.preloader &&
                    <Preloader/>
                }

                <NotificationContainer/>

                <div className="toggle-lang">
                    {/*<div className="lang ru">Информация на русском языке</div>*/}
                    {/*<div className="lang kz">Информация на казахском языке</div>*/}
                </div>
                <div className="person">
                    <div className="data">
                        <p className='subtitle'>
                            {this.props.userStore.languageList["О компании"] || 'О компании'}
                        </p>
                        <div className="container top">
                            <div className="img__wrapper">
                                <label className='logo'>
                                    {
                                        this.props.unionStore.pictureFile ?
                                            <div className={`img ${(this.props.unionStore.union.picture ? 'with-image' : 'default')}`}
                                                 style={{background: (this.props.unionStore.pictureFile ? `url(${URL.createObjectURL(this.props.unionStore.pictureFile)}) no-repeat center center/ cover` : '' )}}
                                                 onClick={this.handleSetImage}>
                                                {
                                                    this.props.unionStore.union.picture &&
                                                    <div className="remove-icon" onClick={this.deletePicture}>
                                                        <RemoveIcon/>
                                                    </div>
                                                }
                                            </div>
                                            :
                                            <div className={`img ${(this.props.unionStore.union.picture ? 'with-image' : 'default')}`}
                                                 style={{background: (this.props.unionStore.union.picture ? `url(${this.props.unionStore.union.picture.uri}) no-repeat center center/ cover` : '' )}}
                                                 onClick={this.handleSetImage}>
                                                {
                                                    this.props.unionStore.union.picture &&
                                                    <div className="remove-icon" onClick={this.deletePicture}>
                                                        <RemoveIcon/>
                                                    </div>
                                                }
                                            </div>
                                    }
                                    <div className='button'>
                                        <div className="icon">
                                            <CameraIcon/>
                                        </div>
                                        {this.props.userStore.languageList["Загрузить логотип"] || 'Загрузить логотип'}
                                    </div>
                                    <input type="file"
                                           onChange={this.fileChange}
                                           style={{display: 'none'}}
                                           ref={this.fileUploadRef}
                                           name="logo"/>
                                </label>
                            </div>
                            <div>
                                <label>
                                    <span>{this.props.userStore.languageList["Наименование"] || 'Наименование'}</span>
                                    <input type="text"
                                           onChange={() => { this.props.unionStore.union.name = this.titleRef.current.value }}
                                           name='name'
                                           ref={this.titleRef}
                                           value={this.props.unionStore.union.name}
                                           placeholder={this.props.userStore.languageList["Наименование"] || 'Наименование'}
                                    />
                                </label>
                                <label>
                                    <span>{this.props.userStore.languageList["Описание"] || 'Описание'}</span>
                                    <ReactQuill
                                        value={this.props.unionStore.union.about_company || ''}
                                        onChange={(text) => { this.props.unionStore.union.about_company = text }}
                                    />
                                </label>
                            </div>
                        </div>
                        <p className='subtitle about-union'>
                            {this.props.userStore.languageList["О профсоюзе"] || 'О профсоюзе'}
                        </p>
                        <div className="container bottom">
                            <label>
                                <span>{this.props.userStore.languageList["Описание"] || 'Описание'}</span>
                                <ReactQuill
                                    value={this.props.unionStore.union.about_union || ''}
                                    onChange={(text) => { this.props.unionStore.union.about_union = text }}
                                />
                            </label>
                            {/*<label>*/}
                            {/*    <span>Документы</span>*/}
                            {/*    <div className="documents">*/}
                            {/*        /!*<label className="document">*!/*/}
                            {/*        /!*    <span>*!/*/}
                            {/*        /!*        {*!/*/}
                            {/*        /!*            this.props.unionStore.protocolFile ?*!/*/}
                            {/*        /!*                this.props.unionStore.protocolFile.name*!/*/}
                            {/*        /!*                :*!/*/}
                            {/*        /!*                'Протокол'*!/*/}
                            {/*        /!*        }*!/*/}
                            {/*        /!*    </span>*!/*/}

                            {/*        /!*    <div className="icons__wrapper">*!/*/}
                            {/*        /!*        {*!/*/}
                            {/*        /!*            this.props.unionStore.union.protocol &&*!/*/}
                            {/*        /!*            <a href={this.props.unionStore.union.protocol.uri} className="icon download">*!/*/}
                            {/*        /!*                <DownloadIcon/>*!/*/}
                            {/*        /!*            </a>*!/*/}
                            {/*        /!*        }*!/*/}
                            {/*        /!*        {this.state.claim &&*!/*/}
                            {/*        /!*        <div className="icon remove" onClick={(e) => this.handleRemoveFile(e,'claim_id')}>*!/*/}
                            {/*        /!*            <RemoveIcon/>*!/*/}
                            {/*        /!*        </div>*!/*/}
                            {/*        /!*        }*!/*/}
                            {/*        /!*        <div className="icon append">*!/*/}
                            {/*        /!*            <AppendIcon/>*!/*/}
                            {/*        /!*        </div>*!/*/}
                            {/*        /!*    </div>*!/*/}
                            {/*        /!*    <input type="file"*!/*/}
                            {/*        /!*           name='protocol'*!/*/}
                            {/*        /!*           ref={this.protocolRef}*!/*/}
                            {/*        /!*           onChange={this.protocolChange}*!/*/}
                            {/*        /!*    />*!/*/}
                            {/*        /!*</label>*!/*/}

                            {/*        /!*<label className="document">*!/*/}
                            {/*        /!*    <span>*!/*/}
                            {/*        /!*        {*!/*/}
                            {/*        /!*            this.props.unionStore.positionFile ?*!/*/}
                            {/*        /!*                this.props.unionStore.positionFile.name*!/*/}
                            {/*        /!*                :*!/*/}
                            {/*        /!*                'Положение'*!/*/}
                            {/*        /!*        }*!/*/}
                            {/*        /!*    </span>*!/*/}

                            {/*        /!*    <div className="icons__wrapper">*!/*/}
                            {/*        /!*        {*!/*/}
                            {/*        /!*            this.props.unionStore.union.position &&*!/*/}
                            {/*        /!*            <a href={ this.props.unionStore.union.position.uri } className="icon download">*!/*/}
                            {/*        /!*                <DownloadIcon/>*!/*/}
                            {/*        /!*            </a>*!/*/}
                            {/*        /!*        }*!/*/}
                            {/*        /!*        /!*{this.state.claim &&*!/*!/*/}
                            {/*        /!*        /!*<div className="icon remove" onClick={(e) => this.handleRemoveFile(e,'claim_id')}>*!/*!/*/}
                            {/*        /!*        /!*    <RemoveIcon/>*!/*!/*/}
                            {/*        /!*        /!*</div>*!/*!/*/}
                            {/*        /!*        /!*}*!/*!/*/}
                            {/*        /!*        <div className="icon append">*!/*/}
                            {/*        /!*            <AppendIcon/>*!/*/}
                            {/*        /!*        </div>*!/*/}
                            {/*        /!*    </div>*!/*/}
                            {/*        /!*    <input type="file"*!/*/}
                            {/*        /!*           name='protocol'*!/*/}
                            {/*        /!*           ref={this.positionRef}*!/*/}
                            {/*        /!*           onChange={this.positionChange}*!/*/}
                            {/*        /!*    />*!/*/}
                            {/*        /!*</label>*!/*/}

                            {/*        /!*<label className="document">*!/*/}
                            {/*        /!*    <span>*!/*/}
                            {/*        /!*        {*!/*/}
                            {/*        /!*            this.props.unionStore.statementFile ?*!/*/}
                            {/*        /!*                this.props.unionStore.statementFile.name*!/*/}
                            {/*        /!*                :*!/*/}
                            {/*        /!*                'Заявление'*!/*/}
                            {/*        /!*        }*!/*/}
                            {/*        /!*    </span>*!/*/}

                            {/*        /!*    <div className="icons__wrapper">*!/*/}
                            {/*        /!*        {*!/*/}
                            {/*        /!*            this.props.unionStore.union.statement &&*!/*/}
                            {/*        /!*            <a href={ this.props.unionStore.union.statement.uri } className="icon download">*!/*/}
                            {/*        /!*                <DownloadIcon/>*!/*/}
                            {/*        /!*            </a>*!/*/}
                            {/*        /!*        }*!/*/}
                            {/*        /!*        /!*{this.state.claim &&*!/*!/*/}
                            {/*        /!*        /!*<div className="icon remove" onClick={(e) => this.handleRemoveFile(e,'claim_id')}>*!/*!/*/}
                            {/*        /!*        /!*    <RemoveIcon/>*!/*!/*/}
                            {/*        /!*        /!*</div>*!/*!/*/}
                            {/*        /!*        /!*}*!/*!/*/}
                            {/*        /!*        <div className="icon append">*!/*/}
                            {/*        /!*            <AppendIcon/>*!/*/}
                            {/*        /!*        </div>*!/*/}
                            {/*        /!*    </div>*!/*/}
                            {/*        /!*    <input type="file"*!/*/}
                            {/*        /!*           name='protocol'*!/*/}
                            {/*        /!*           ref={this.statementRef}*!/*/}
                            {/*        /!*           onChange={this.statementChange}*!/*/}
                            {/*        /!*    />*!/*/}
                            {/*        /!*</label>*!/*/}

                            {/*        /!*<label className="document">*!/*/}
                            {/*        /!*    {*!/*/}
                            {/*        /!*        this.props.unionStore.collectiveAgreementFile !== undefined ?*!/*/}
                            {/*        /!*            <span>{ this.props.unionStore.collectiveAgreementFile.name }</span>*!/*/}
                            {/*        /!*            :*!/*/}
                            {/*        /!*            <span>Коллективный договор</span>*!/*/}
                            {/*        /!*    }*!/*/}

                            {/*        /!*    <div className="icons__wrapper">*!/*/}
                            {/*        /!*        {*!/*/}
                            {/*        /!*            this.props.unionStore.union.agreement &&*!/*/}
                            {/*        /!*            <a href={ this.props.unionStore.union.agreement.uri } className="icon download">*!/*/}
                            {/*        /!*                <DownloadIcon/>*!/*/}
                            {/*        /!*            </a>*!/*/}
                            {/*        /!*        }*!/*/}
                            {/*        /!*        /!*{this.state.claim &&*!/*!/*/}
                            {/*        /!*        /!*<div className="icon remove" onClick={(e) => this.handleRemoveFile(e,'claim_id')}>*!/*!/*/}
                            {/*        /!*        /!*    <RemoveIcon/>*!/*!/*/}
                            {/*        /!*        /!*</div>*!/*!/*/}
                            {/*        /!*        /!*}*!/*!/*/}
                            {/*        /!*        <div className="icon append">*!/*/}
                            {/*        /!*            <AppendIcon/>*!/*/}
                            {/*        /!*        </div>*!/*/}
                            {/*        /!*    </div>*!/*/}
                            {/*        /!*    <input type="file"*!/*/}
                            {/*        /!*           name='protocol'*!/*/}
                            {/*        /!*           ref={this.collectiveAgreementRef}*!/*/}
                            {/*        /!*           onChange={this.collectiveAgreementChange}*!/*/}
                            {/*        /!*    />*!/*/}
                            {/*        /!*</label>*!/*/}

                            {/*        /!*<label className="document">*!/*/}
                            {/*        /!*    <a href={`/union/ppo/${this.props.unionStore.union.resource_id}/sample_application`} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>*!/*/}
                            {/*        /!*        <span style={{ width: "100%", borderRight: "1px solid #E4E8F0" }}>Образцы заявлений</span>*!/*/}
                            {/*        /!*        <div className="icons__wrapper" style={{ padding: 5 }}>*!/*/}
                            {/*        /!*            <LeftArrowIcon />*!/*/}
                            {/*        /!*        </div>*!/*/}
                            {/*        /!*    </a>*!/*/}
                            {/*        /!*</label>*!/*/}

                            {/*        /!*<label className="document">*!/*/}

                            {/*        /!*    {*!/*/}
                            {/*        /!*        this.props.unionStore.protocolFile !== null ?*!/*/}
                            {/*        /!*            <span>{ this.props.unionStore.protocolFile.name }</span>*!/*/}
                            {/*        /!*            :*!/*/}
                            {/*        /!*            <span>Протокол</span>*!/*/}
                            {/*        /!*    }*!/*/}

                            {/*        /!*    <div className="icons__wrapper">*!/*/}
                            {/*        /!*        {this.state.protocol &&*!/*/}
                            {/*        /!*        <a href={this.state.protocol.url.download} className="icon download">*!/*/}
                            {/*        /!*            <DownloadIcon/>*!/*/}
                            {/*        /!*        </a>*!/*/}
                            {/*        /!*        }*!/*/}
                            {/*        /!*        {this.state.protocol &&*!/*/}
                            {/*        /!*        <div className="icon remove"*!/*/}
                            {/*        /!*             onClick={(e) => this.handleRemoveFile(e,'protocol_id')}>*!/*/}
                            {/*        /!*            <RemoveIcon/>*!/*/}
                            {/*        /!*        </div>*!/*/}
                            {/*        /!*        }*!/*/}
                            {/*        /!*        <div className="icon append">*!/*/}
                            {/*        /!*            <AppendIcon/>*!/*/}
                            {/*        /!*        </div>*!/*/}
                            {/*        /!*    </div>*!/*/}
                            {/*        /!*    <input type="file"*!/*/}
                            {/*        /!*           name='protocol'*!/*/}
                            {/*        /!*           ref={this.protocolRef}*!/*/}
                            {/*        /!*           onChange={this.protocolChange}*!/*/}
                            {/*        /!*    />*!/*/}
                            {/*        /!*</label>*!/*/}
                            {/*        /!*<label className="document">*!/*/}

                            {/*        /!*    {*!/*/}
                            {/*        /!*        this.props.unionStore.collectiveAgreementFile !== null ?*!/*/}
                            {/*        /!*            <span>{ this.props.unionStore.collectiveAgreementFile.name }</span>*!/*/}
                            {/*        /!*            :*!/*/}
                            {/*        /!*            <span>Коллективный договор</span>*!/*/}
                            {/*        /!*    }*!/*/}

                            {/*        /!*    <div className="icons__wrapper">*!/*/}
                            {/*        /!*        {this.state.collectiveAgreement &&*!/*/}
                            {/*        /!*        <a href={this.state.collectiveAgreement.url.download} className="icon download">*!/*/}
                            {/*        /!*            <DownloadIcon/>*!/*/}
                            {/*        /!*        </a>*!/*/}
                            {/*        /!*        }*!/*/}
                            {/*        /!*        {this.state.collectiveAgreement &&*!/*/}
                            {/*        /!*        <div className="icon remove"*!/*/}
                            {/*        /!*             onClick={(e) => this.handleRemoveFile(e,'collective_agreement_id')}>*!/*/}
                            {/*        /!*            <RemoveIcon/>*!/*/}
                            {/*        /!*        </div>*!/*/}
                            {/*        /!*        }*!/*/}
                            {/*        /!*        <div className="icon append">*!/*/}
                            {/*        /!*            <AppendIcon/>*!/*/}
                            {/*        /!*        </div>*!/*/}
                            {/*        /!*    </div>*!/*/}
                            {/*        /!*    <input type="file"*!/*/}
                            {/*        /!*           name='collective_agreement'*!/*/}
                            {/*        /!*           ref={this.collectiveAgreementRef}*!/*/}
                            {/*        /!*           onChange={this.collectiveAgreementChange}*!/*/}
                            {/*        /!*    />*!/*/}
                            {/*        /!*</label>*!/*/}
                            {/*        /!*<label className="document">*!/*/}
                            {/*        /!*    {*!/*/}
                            {/*        /!*        this.props.unionStore.conditionFile !== null ?*!/*/}
                            {/*        /!*            <span>{ this.props.unionStore.conditionFile.name }</span>*!/*/}
                            {/*        /!*            :*!/*/}
                            {/*        /!*            <span>Положение</span>*!/*/}
                            {/*        /!*    }*!/*/}
                            {/*        /!*    <div className="icons__wrapper">*!/*/}
                            {/*        /!*        {this.state.condition &&*!/*/}
                            {/*        /!*        <a href={this.state.condition.url.download} className="icon download">*!/*/}
                            {/*        /!*            <DownloadIcon/>*!/*/}
                            {/*        /!*        </a>*!/*/}
                            {/*        /!*        }*!/*/}
                            {/*        /!*        {this.state.condition &&*!/*/}
                            {/*        /!*        <div className="icon remove"*!/*/}
                            {/*        /!*             onClick={(e) => this.handleRemoveFile(e,'condition_id')}>*!/*/}
                            {/*        /!*            <RemoveIcon/>*!/*/}
                            {/*        /!*        </div>*!/*/}
                            {/*        /!*        }*!/*/}
                            {/*        /!*        <div className="icon append">*!/*/}
                            {/*        /!*            <AppendIcon/>*!/*/}
                            {/*        /!*        </div>*!/*/}
                            {/*        /!*    </div>*!/*/}
                            {/*        /!*    <input type="file"*!/*/}
                            {/*        /!*           name='condition'*!/*/}
                            {/*        /!*           ref={this.conditionRef}*!/*/}
                            {/*        /!*           onChange={this.conditionChange}*!/*/}
                            {/*        /!*    />*!/*/}
                            {/*        /!*</label>*!/*/}

                            {/*    </div>*/}
                            {/*</label>*/}
                        </div>
                    </div>
                    <div className="btns">
                        <button className="cancel" onClick={() => { this.props.history.goBack() }}>{this.props.userStore.languageList["Отменить"] || 'Отменить'}</button>
                        <button className="save" onClick={this.savePpo}>{this.props.userStore.languageList["Сохранить"] || 'Сохранить'}</button>
                    </div>
                </div>
            </div>
        );
    }
}


export default inject('unionStore', 'userStore', 'permissionsStore')(observer(TopEdit));