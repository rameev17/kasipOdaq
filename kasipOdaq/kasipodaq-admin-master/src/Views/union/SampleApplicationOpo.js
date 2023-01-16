import React, {Component} from 'react';
import {Link} from "react-router-dom";
import ReactQuill from 'react-quill'
import {connect} from 'react-redux'
import 'react-quill/dist/quill.snow.css';

import {ReactComponent as DownloadIcon} from '../../assets/icons/download.svg'
import {ReactComponent as RemoveIcon} from '../../assets/icons/delete.svg'
import {ReactComponent as AppendIcon} from '../../assets/icons/clip.svg'
import {ReactComponent as CameraIcon} from '../../assets/icons/camera.svg'
import {ReactComponent as ApplicationAdd} from "../../assets/icons/answer-add.svg";
import {inject, observer} from "mobx-react";
import Preloader from "../../fragments/preloader/Preloader";
import {NotificationContainer, NotificationManager} from "react-notifications";

import axios from "axios";
import {ReactComponent as LeftArrowIcon} from "../../assets/icons/arrow.svg";

class SampleApplicationOpo extends Component {

    constructor(props) {
        super(props);

        this.state = {
            preloader: false,
            deleteFiles: [],
        };

        this.entrySample = React.createRef();
        this.holdSample = React.createRef();
        this.positionSample = React.createRef();
        this.protocolSample = React.createRef();
        this.statementSample = React.createRef();

        this.deleteFile = this.deleteFile.bind(this);

        this.entrySampleChange = this.entrySampleChange.bind(this);
        this.holdSampleChange = this.holdSampleChange.bind(this);
        this.positionSampleChange = this.positionSampleChange.bind(this);
        this.protocolSampleChange = this.protocolSampleChange.bind(this);
        this.statementSampleChange = this.statementSampleChange.bind(this)
    }

    async entrySampleChange(){
        this.props.unionStore.entrySampleFile = this.entrySample.current.files[0];

        await this.props.unionStore.uploadFile(
            this.props.unionStore.entrySampleFile, (data, headers) => {
                this.props.unionStore.entrySampleFile.id = headers['x-entity-id']
            }
        );

        await this.props.unionStore.sampleFilesUpload(
            this.props.match.params.id, () => {
                NotificationManager.success("Файл успешно загружен");
                this.loadPage()
            }
        )
    }

    async holdSampleChange(){
        this.props.unionStore.holdSampleFile = this.holdSample.current.files[0];

        await this.props.unionStore.uploadFile(
            this.props.unionStore.holdSampleFile, (data, headers) => {
                this.props.unionStore.holdSampleFile.id = headers['x-entity-id']
            }
        );

        await this.props.unionStore.sampleFilesUpload(
            this.props.match.params.id, () => {
                NotificationManager.success("Файл успешно загружен");
                this.loadPage()
            }
        )
    }

    async positionSampleChange(){
        this.props.unionStore.positionSampleFile = this.positionSample.current.files[0];

        await this.props.unionStore.uploadFile(
            this.props.unionStore.positionSampleFile, (data, headers) => {
                this.props.unionStore.positionSampleFile.id = headers['x-entity-id']
            }
        );

        await this.props.unionStore.sampleFilesUpload(
            this.props.match.params.id, () => {
                NotificationManager.success("Файл успешно загружен");
                this.loadPage()
            }
        )
    }

    async protocolSampleChange(){
        this.props.unionStore.protocolSampleFile = this.protocolSample.current.files[0];

        await this.props.unionStore.uploadFile(
            this.props.unionStore.protocolSampleFile, (data, headers) => {
                this.props.unionStore.protocolSampleFile.id = headers['x-entity-id']
            }
        );

        await this.props.unionStore.sampleFilesUpload(
            this.props.match.params.id, () => {
                NotificationManager.success("Файл успешно загружен");
                this.loadPage()
            }
        )
    }

    async statementSampleChange(){
        this.props.unionStore.statementSampleFile = this.statementSample.current.files[0];

        await this.props.unionStore.uploadFile(
            this.props.unionStore.statementSampleFile, (data, headers) => {
                this.props.unionStore.statementSampleFile.id = headers['x-entity-id']
            }
        );

        await this.props.unionStore.sampleFilesUpload(
            this.props.match.params.id, () => {
                NotificationManager.success("Файл успешно загружен");
                this.loadPage()
            }
        )
    }

    componentDidMount() {
        this.loadPage()
    }

    loadPage(){
        this.props.unionStore.loadUnion(this.props.match.params.id, data => {

            this.props.unionStore.applications = data;

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

    deleteFile(id){
        const files = this.props.unionStore.applications.map(file =>
            file.resource_id).join(",");

        let array = JSON.parse("[" + files + "]");

        let index = array.indexOf(id);
        if (index > -1) {
            array.splice(index, 1);
        }

        let string  = array.toString();

        this.setState({ preloader: true });
        this.props.unionStore.applicationFilesUpload(this.props.match.params.id, string, () => {
            this.setState({ preloader: false });
            NotificationManager.success("Файл успешно удален");
            this.loadPage()
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
                    <div className="lang ru">{this.props.userStore.languageList['Информация на русском языке'] || 'Информация на русском языке'}</div>
                    {/*<div className="lang kz">Информация на казахском языке</div>*/}
                </div>
                <div className="person">
                    <div className="data">
                        <div className="container bottom">

                            <div style={{ display: "flex", flexWrap: "wrap"}}>
                                <label>
                                    <span>{this.props.userStore.languageList["Образец вступления"] || 'Образец вступления'}</span>
                                    <div className="documents">
                                        <label className="document" style={{ width: "100%", marginRight: 20  }}>
                                        <span>
                                            {
                                                this.props.unionStore.entrySampleFile ?
                                                    this.props.unionStore.entrySampleFile.name
                                                    :
                                                    this.props.userStore.languageList["Образец вступления"] || 'Образец вступления'
                                            }
                                        </span>

                                            <div className="icons__wrapper">
                                                {
                                                    this.props.unionStore.union.entry_sample &&
                                                    <a href={this.props.unionStore.union.entry_sample.uri} className="icon download">
                                                        <DownloadIcon/>
                                                    </a>
                                                }
                                                {this.state.claim &&
                                                <div className="icon remove" onClick={(e) => this.handleRemoveFile(e,'claim_id')}>
                                                    <RemoveIcon/>
                                                </div>
                                                }
                                                <div className="icon append">
                                                    <AppendIcon/>
                                                </div>
                                            </div>
                                            <input type="file"
                                                   name='protocol'
                                                   ref={this.entrySample}
                                                   onChange={this.entrySampleChange}
                                            />
                                        </label>
                                    </div>
                                </label>

                                <label>
                                    <span>{this.props.userStore.languageList["Образец на удержание"] || 'Образец на удержание'}</span>
                                    <div className={"documents"}>
                                        <label className="document" style={{ width: "100%", marginRight: 20  }}>
                                        <span>
                                            {
                                                this.props.unionStore.holdSampleFile ?
                                                    this.props.unionStore.holdSampleFile.name
                                                    :
                                                    this.props.userStore.languageList["Образец на удержание"] || 'Образец на удержание'
                                            }
                                        </span>

                                            <div className="icons__wrapper">
                                                {
                                                    this.props.unionStore.union.hold_sample &&
                                                    <a href={ this.props.unionStore.union.hold_sample.uri } className="icon download">
                                                        <DownloadIcon/>
                                                    </a>
                                                }
                                                {/*{this.state.claim &&*/}
                                                {/*<div className="icon remove" onClick={(e) => this.handleRemoveFile(e,'claim_id')}>*/}
                                                {/*    <RemoveIcon/>*/}
                                                {/*</div>*/}
                                                {/*}*/}
                                                <div className="icon append">
                                                    <AppendIcon/>
                                                </div>
                                            </div>
                                            <input type="file"
                                                   name='protocol'
                                                   ref={this.holdSample}
                                                   onChange={this.holdSampleChange}
                                            />
                                        </label>
                                    </div>
                                </label>

                                <label>
                                    <span>{this.props.userStore.languageList["Образец положения"] || 'Образец положения'}</span>
                                    <div className={"documents"}>
                                        <label className="document" style={{ width: "100%", marginRight: 20  }}>
                                        <span>
                                            {
                                                this.props.unionStore.positionSampleFile ?
                                                    this.props.unionStore.positionSampleFile.name
                                                    :
                                                    this.props.userStore.languageList["Образец положения"] || 'Образец положения'
                                            }
                                        </span>

                                            <div className="icons__wrapper">
                                                {
                                                    this.props.unionStore.union.position_sample &&
                                                    <a href={ this.props.unionStore.union.position_sample.uri } className="icon download">
                                                        <DownloadIcon/>
                                                    </a>
                                                }
                                                {/*{this.state.claim &&*/}
                                                {/*<div className="icon remove" onClick={(e) => this.handleRemoveFile(e,'claim_id')}>*/}
                                                {/*    <RemoveIcon/>*/}
                                                {/*</div>*/}
                                                {/*}*/}
                                                <div className="icon append">
                                                    <AppendIcon/>
                                                </div>
                                            </div>
                                            <input type="file"
                                                   name='protocol'
                                                   ref={this.positionSample}
                                                   onChange={this.positionSampleChange}
                                            />
                                        </label>
                                    </div>
                                </label>

                                <label>
                                    <span>{this.props.userStore.languageList["Образец протокола"] || 'Образец протокола'}</span>
                                    <div className={"documents"}>
                                        <label className="document" style={{ width: "100%", marginRight: 20 }}>
                                            {
                                                this.props.unionStore.protocolSampleFile !== undefined ?
                                                    <span>{ this.props.unionStore.protocolSampleFile.name }</span>
                                                    :
                                                    <span>{this.props.userStore.languageList["Образец протокола"] || 'Образец протокола'}</span>
                                            }

                                            <div className="icons__wrapper">
                                                {
                                                    this.props.unionStore.union.protocol_sample &&
                                                    <a href={ this.props.unionStore.union.protocol_sample.uri } className="icon download">
                                                        <DownloadIcon/>
                                                    </a>
                                                }
                                                {/*{this.state.claim &&*/}
                                                {/*<div className="icon remove" onClick={(e) => this.handleRemoveFile(e,'claim_id')}>*/}
                                                {/*    <RemoveIcon/>*/}
                                                {/*</div>*/}
                                                {/*}*/}
                                                <div className="icon append">
                                                    <AppendIcon/>
                                                </div>
                                            </div>
                                            <input type="file"
                                                   name='protocol'
                                                   ref={this.protocolSample}
                                                   onChange={this.protocolSampleChange}
                                            />
                                        </label>
                                    </div>
                                </label>

                                <label>
                                    <span>{this.props.userStore.languageList["Образец заявления"] || 'Образец заявления'}</span>
                                    <div className={"documents"}>
                                        <label className="document" style={{ width: "100%" }}>
                                            {
                                                this.props.unionStore.statementSampleFile !== undefined ?
                                                    <span>{ this.props.unionStore.statementSampleFile.name }</span>
                                                    :
                                                    <span>{this.props.userStore.languageList["Образец заявления"] || 'Образец заялвения'}</span>
                                            }

                                            <div className="icons__wrapper">
                                                {
                                                    this.props.unionStore.union.statement_sample &&
                                                    <a href={ this.props.unionStore.union.statement_sample.uri } className="icon download">
                                                        <DownloadIcon/>
                                                    </a>
                                                }
                                                {/*{this.state.claim &&*/}
                                                {/*<div className="icon remove" onClick={(e) => this.handleRemoveFile(e,'claim_id')}>*/}
                                                {/*    <RemoveIcon/>*/}
                                                {/*</div>*/}
                                                {/*}*/}
                                                <div className="icon append">
                                                    <AppendIcon/>
                                                </div>
                                            </div>
                                            <input type="file"
                                                   name='protocol'
                                                   ref={this.statementSample}
                                                   onChange={this.statementSampleChange}
                                            />
                                        </label>
                                    </div>
                                </label>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


export default inject('unionStore', 'userStore', 'permissionsStore')(observer(SampleApplicationOpo));