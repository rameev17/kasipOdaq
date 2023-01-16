import React, {Component} from 'react';
import {Link, withRouter} from "react-router-dom";
import ReactQuill from 'react-quill'
import {connect} from 'react-redux'
import 'react-quill/dist/quill.snow.css';

import {ReactComponent as DownloadIcon} from '../../assets/icons/download.svg'
import {ReactComponent as RemoveIcon} from '../../assets/icons/delete.svg'
import {ReactComponent as AppendIcon} from '../../assets/icons/clip.svg'
import {ReactComponent as CameraIcon} from '../../assets/icons/camera.svg'
import {inject, observer} from "mobx-react";


class PpoAdd extends Component {

    constructor(props){
        super(props)

        this.state = {
            preloader: false,
        }
    }

    createPpo(){

    }

    state = {
        backLink: '',
        logoFile: null,
        logoUrl: null,
        name: '',
        companyDescription: '',
        unionDescription: '',
        protocol: null,
        position: null,
        statement: null,
        agreement: null,
        order: null
    }

    render() {

        return (
            <div className="ppo-edit">
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
                            {/*<div className="img__wrapper">*/}
                                {/*<div className={`img ${(this.state.logoUrl ? 'with-image' : 'default')}`}*/}
                                     {/*style={{background: (this.state.logoUrl ? `url(${this.state.logoUrl}) no-repeat center center/ cover` : '')}}*/}
                                     {/*onClick={this.handleSetImage}>*/}
                                    {/*<div className="remove-icon">*/}
                                        {/*<RemoveIcon/>*/}
                                    {/*</div>*/}
                                {/*</div>*/}
                                {/*<div className='button' onClick={this.handleSetImage}>*/}
                                    {/*<div className="icon">*/}
                                        {/*<CameraIcon/>*/}
                                    {/*</div>*/}
                                    {/*Загрузить логотип*/}
                                {/*</div>*/}
                                {/*<input type="file"*/}
                                       {/*onChange={this.handleInputLogo}*/}
                                       {/*ref={fileInput => this.fileInput = fileInput}*/}
                                       {/*name="photo"/>*/}
                            {/*</div>*/}
                            <div>
                                <label>
                                    <span>{this.props.userStore.languageList["Наименование"] || 'Наименование'}</span>
                                    <input
                                        type="text"
                                        name='name'
                                        ref={this.titleRef}
                                        placeholder={this.props.userStore.languageList["Наименование"] || 'Наименование'}
                                    />
                                </label>
                                <label>
                                    <span>{this.props.userStore.languageList["Описание"] || 'Описание'}</span>
                                    <ReactQuill
                                        value={this.state.companyDescription}
                                        onChange={this.changeCompanyDescription}
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
                                    value={this.state.unionDescription}
                                    onChange={this.changeUnionDescription}
                                />
                            </label>
                            <label>
                                <span>{this.props.userStore.languageList["Документы"] || 'Документы'}</span>
                                <div className="documents">
                                    <div className="document">
                                        <span>{this.props.userStore.languageList["Протокол"] || 'Протокол'}</span>
                                        <div className="icons__wrapper">
                                            <div className="icon download">
                                                <DownloadIcon/>
                                            </div>
                                            <div className="icon remove"
                                                 onClick={() => this.handleRemoveFile('protocol')}>
                                                <RemoveIcon/>
                                            </div>
                                            <div className="icon append" onClick={() => this.handleSetFile('protocol')}>
                                                <AppendIcon/>
                                            </div>
                                        </div>
                                        <input type="file" name='protocol'
                                               onChange={this.handleInputDocument}
                                               ref={fileInput => this.protocolInput = fileInput}
                                        />
                                    </div>
                                    <div className="document">
                                        <span>{this.props.userStore.languageList["Коллективный договор"] || 'Коллективный договор'}</span>
                                        <div className="icons__wrapper">
                                            <div className="icon download">
                                                <DownloadIcon/>
                                            </div>
                                            <div className="icon remove"
                                                 onClick={() => this.handleRemoveFile('agreement')}>
                                                <RemoveIcon/>
                                            </div>
                                            <div className="icon append"
                                                 onClick={() => this.handleSetFile('agreement')}>
                                                <AppendIcon/>
                                            </div>
                                        </div>
                                        <input type="file" name='agreement'
                                               onChange={this.handleInputDocument}
                                               ref={fileInput => this.agreementInput = fileInput}
                                        />
                                    </div>
                                    <div className="document">
                                        <span>{this.props.userStore.languageList["Положение"] || 'Положение'}</span>
                                        <div className="icons__wrapper">
                                            <div className="icon download">
                                                <DownloadIcon/>
                                            </div>
                                            <div className="icon remove"
                                                 onClick={() => this.handleRemoveFile('position')}>
                                                <RemoveIcon/>
                                            </div>
                                            <div className="icon append" onClick={() => this.handleSetFile('position')}>
                                                <AppendIcon/>
                                            </div>
                                        </div>
                                        <input type="file" name='position'
                                               onChange={this.handleInputDocument}
                                               ref={fileInput => this.positionInput = fileInput}
                                        />
                                    </div>
                                    <div className="document">
                                        <span>{this.props.userStore.languageList["Устав"] || 'Устав'}</span>
                                        <div className="icons__wrapper">
                                            <div className="icon download">
                                                <DownloadIcon/>
                                            </div>
                                            <div className="icon remove"
                                                 onClick={() => this.handleRemoveFile('statement')}>
                                                <RemoveIcon/>
                                            </div>
                                            <div className="icon append"
                                                 onClick={() => this.handleSetFile('statement')}>
                                                <AppendIcon/>
                                            </div>
                                        </div>
                                        <input type="file" name='statement'
                                               onChange={this.handleInputDocument}
                                               ref={fileInput => this.statementInput = fileInput}
                                        />
                                    </div>
                                    <div className="document">
                                        <span>{this.props.userStore.languageList["Заявление"] || 'Заявление'}</span>
                                        <div className="icons__wrapper">
                                            <div className="icon download">
                                                <DownloadIcon/>
                                            </div>
                                            <div className="icon remove" onClick={() => this.handleRemoveFile('order')}>
                                                <RemoveIcon/>
                                            </div>
                                            <div className="icon append" onClick={() => this.handleSetFile('order')}>
                                                <AppendIcon/>
                                            </div>
                                        </div>
                                        <input type="file" name='order'
                                               onChange={this.handleInputDocument}
                                               ref={fileInput => this.orderInput = fileInput}
                                        />
                                    </div>
                                </div>
                            </label>
                        </div>
                    </div>
                    <div className="btns">
                        <button className="cancel" onClick={this.handleCancel}>{this.props.userStore.languageList["Отменить"] || 'Отменить'}</button>
                        <button className="save" onClick={this.savePpo}>{this.props.userStore.languageList["Сохранить"] || 'Сохранить'}</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default inject('userStore')(observer(withRouter(PpoAdd)));