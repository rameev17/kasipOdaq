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

class SampleApplication extends Component {

    constructor(props) {
        super(props);

        this.state = {
            preloader: false,
            deleteFiles: [],
        };

        this.applicationFile = React.createRef();

        this.entrySample = React.createRef();
        this.holdSample = React.createRef();
        this.positionSample = React.createRef();
        this.protocolSample = React.createRef();
        this.statementSample = React.createRef();

        this.applicationChange = this.applicationChange.bind(this);
        this.applicationUpload = this.applicationUpload.bind(this);
        this.deleteFile = this.deleteFile.bind(this);
        this.deleteApplication = this.deleteApplication.bind(this);

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

    applicationChange(event, index) {
        this.props.unionStore.applications[index] = event.target.files[0];

        this.props.unionStore.applications.map(application => {
            this.props.unionStore.applicationFiles.push(application)
        });

        this.setState({ preloader: true });
        this.props.unionStore.applicationFiles.map(application => {
            return application.size &&
                this.props.unionStore.uploadFile(
                    application,(data, headers) => {
                        application.id = headers['x-entity-id'];
                        this.setState({ preloader: false }, () => {

                        })
                    }
                )
        })
    }

    applicationUpload() {

        let used = {};
        let arr = this.props.unionStore.applicationFiles;
        const files = arr.map(file =>
            file.id).join(",");

        let filtered = arr.filter(function(obj) {

            return obj != null && obj.id in used ? 0:(used[obj.id]=1);
        });

        let array2 = filtered.filter(element => element != "");

        const id = array2.map(file =>
            file.id).join(",").replace(/^,/,'');

        if (this.props.unionStore.applications[0].resource_id){
            const old_files = this.props.unionStore.applications.map(file =>
                file.resource_id).join(",");

                const new_files = old_files + id;
                console.log(new_files);
            this.props.unionStore.applicationFilesUpload(this.props.match.params.id, new_files, () => {
                NotificationManager.success("Образцы успешно загружены");
                this.loadPage();
                window.location.reload()
            })
        }else{
            console.log(id);
            this.props.unionStore.applicationFilesUpload(this.props.match.params.id, id, () => {
                NotificationManager.success("Образцы успешно загружены");
                this.loadPage();
                window.location.reload()
            })
        }
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
            NotificationManager.success("Образец успешно удален");
            this.loadPage()
        })
    }

    deleteApplication(id){
        console.log(id);
        this.props.unionStore.deleteSample(id, () => {
            NotificationManager.success('Образец удален');
            this.loadPage()
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

    render() {

        return (
            <div className="ppo-edit">

                {
                    this.state.preloader &&
                    <Preloader/>
                }

                <NotificationContainer/>

                <div style={{ marginBottom: 16 }}>
                    <Link style={{ color: '#0052A4' }} onClick={() => this.props.history.goBack()}>{this.props.userStore.languageList['Вернуться назад'] || 'Вернуться назад'}</Link>
                </div>

                <div className="toggle-lang">
                    {/*<div className="lang ru">Информация на русском языке</div>*/}
                    {/*<div className="lang kz">Информация на казахском языке</div>*/}
                </div>
                <div className="person">
                    <div className="data">
                        <div className="container bottom">

                            <div style={{ display: "flex", flexWrap: "wrap"}}>
                                <div style={{ marginRight: 20 }}>
                                    <span>{this.props.userStore.languageList["Образец вступления"] || 'Образец вступления'}</span>
                                    <div className="documents" style={{ flexWrap: 'nowrap'}}>
                                        <label className="document" style={{ width: "100%", padding: '0px 10px' }}>
                                        <span>
                                            {
                                                this.props.unionStore.entrySampleFile ?
                                                    this.props.unionStore.entrySampleFile.name
                                                    :
                                                    this.props.userStore.languageList["Образец вступления"] || 'Образец вступления'
                                            }
                                        </span>
                                            <input type="file"
                                                   name='protocol'
                                                   ref={this.entrySample}
                                                   onChange={this.entrySampleChange}
                                            />
                                        </label>
                                        <div className="icons__wrapper" style={{
                                            height: '100%',
                                            border: '1px solid #E4E8F0'
                                        }}>
                                            {
                                                this.props.unionStore.union.entry_sample &&
                                                <a href={this.props.unionStore.union.entry_sample.uri} className="icon download">
                                                    <DownloadIcon/>
                                                </a>
                                            }
                                            {this.props.unionStore.union.entry_sample &&
                                            <div className="icon remove" onClick={() => this.deleteApplication(this.props.unionStore.union.entry_sample?.link_id)}>
                                                <RemoveIcon/>
                                            </div>
                                            }
                                            {/*<div className="icon append">*/}
                                            {/*    <AppendIcon/>*/}
                                            {/*</div>*/}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ marginRight: 20 }}>
                                    <span>{this.props.userStore.languageList["Образец на удержание"] || 'Образец на удержание'}</span>
                                    <div className={"documents"} style={{ flexWrap: 'nowrap'}}>
                                        <label className="document" style={{ width: "100%", padding: '0px 10px' }}>
                                        <span>
                                            {
                                                this.props.unionStore.holdSampleFile ?
                                                    this.props.unionStore.holdSampleFile.name
                                                    :
                                                    this.props.userStore.languageList["Образец на удержание"] || 'Образец на удержание'
                                            }
                                        </span>
                                            <input type="file"
                                                   name='protocol'
                                                   ref={this.holdSample}
                                                   onChange={this.holdSampleChange}
                                            />
                                        </label>
                                        <div className="icons__wrapper" style={{
                                            height: '100%',
                                            border: '1px solid #E4E8F0'
                                        }}>
                                            {
                                                this.props.unionStore.union.hold_sample &&
                                                <a href={ this.props.unionStore.union.hold_sample.uri } className="icon download">
                                                    <DownloadIcon/>
                                                </a>
                                            }
                                            {
                                                this.props.unionStore.union.hold_sample &&
                                            <div className="icon remove" onClick={() => this.deleteApplication(this.props.unionStore.union.hold_sample?.link_id)}>
                                                <RemoveIcon/>
                                            </div>
                                            }
                                            {/*<div className="icon append">*/}
                                            {/*    <AppendIcon/>*/}
                                            {/*</div>*/}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ marginRight: 20 }}>
                                    <span>{this.props.userStore.languageList["Образец положения"] || 'Образец положения'}</span>
                                    <div className={"documents"} style={{ flexWrap: 'nowrap' }}>
                                        <label className="document" style={{ width: "100%", padding: '0px 10px' }}>
                                        <span>
                                            {
                                                this.props.unionStore.positionSampleFile ?
                                                    this.props.unionStore.positionSampleFile.name
                                                    :
                                                    this.props.userStore.languageList["Образец положения"] || 'Образец положения'
                                            }
                                        </span>
                                            <input type="file"
                                                   name='protocol'
                                                   ref={this.positionSample}
                                                   onChange={this.positionSampleChange}
                                            />
                                        </label>
                                        <div className="icons__wrapper" style={{
                                            height: '100%',
                                            border: '1px solid #E4E8F0'
                                        }}>
                                            {
                                                this.props.unionStore.union.position_sample &&
                                                <a href={ this.props.unionStore.union.position_sample.uri } className="icon download">
                                                    <DownloadIcon/>
                                                </a>
                                            }
                                            {
                                                this.props.unionStore.union.position_sample &&
                                                <div className="icon remove" onClick={() => this.deleteApplication(this.props.unionStore.union.position_sample?.link_id)}>
                                                    <RemoveIcon/>
                                                </div>
                                            }
                                            {/*<div className="icon append">*/}
                                            {/*    <AppendIcon/>*/}
                                            {/*</div>*/}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ marginRight: 20 }}>
                                    <span>{this.props.userStore.languageList["Образец протокола"] || 'Образец протокола'}</span>
                                    <div className={"documents"} style={{ flexWrap: 'nowrap' }}>
                                        <label className="document" style={{ width: "100%", padding: '0px 10px' }}>
                                            {
                                                this.props.unionStore.protocolSampleFile !== undefined ?
                                                    <span>{ this.props.unionStore.protocolSampleFile.name }</span>
                                                    :
                                                    <span>{this.props.userStore.languageList["Образец протокола"] || 'Образец протокола'}</span>
                                            }
                                            <input type="file"
                                                   name='protocol'
                                                   ref={this.protocolSample}
                                                   onChange={this.protocolSampleChange}
                                            />
                                        </label>
                                        <div className="icons__wrapper" style={{
                                            height: '100%',
                                            border: '1px solid #E4E8F0'
                                        }}>
                                            {
                                                this.props.unionStore.union.protocol_sample &&
                                                <a href={ this.props.unionStore.union.protocol_sample.uri } className="icon download">
                                                    <DownloadIcon/>
                                                </a>
                                            }
                                            {
                                                this.props.unionStore.union.protocol_sample &&
                                                <div className="icon remove" onClick={() => this.deleteApplication(this.props.unionStore.union.protocol_sample?.link_id)}>
                                                    <RemoveIcon/>
                                                </div>
                                            }
                                            {/*<div className="icon append">*/}
                                            {/*    <AppendIcon/>*/}
                                            {/*</div>*/}
                                        </div>
                                    </div>
                                </div>

                                <div style={{marginRight: 10}}>
                                    <span>{this.props.userStore.languageList["Образец заявления"] || 'Образец заявления'}</span>
                                    <div className={"documents"} style={{ flexWrap: 'nowrap' }}>
                                        <label className="document" style={{ width: "100%", padding: '0px 10px' }}>
                                            {
                                                this.props.unionStore.statementSampleFile !== undefined ?
                                                    <span>{ this.props.unionStore.statementSampleFile.name }</span>
                                                    :
                                                    <span>{this.props.userStore.languageList["Образец заявления"] || 'Образец заявления'}</span>
                                            }
                                            <input type="file"
                                                   name='protocol'
                                                   ref={this.statementSample}
                                                   onChange={this.statementSampleChange}
                                            />
                                        </label>
                                        <div className="icons__wrapper" style={{
                                            height: '100%',
                                            border: '1px solid #E4E8F0'
                                        }}>
                                            {
                                                this.props.unionStore.union.statement_sample &&
                                                <a href={ this.props.unionStore.union.statement_sample.uri } className="icon download">
                                                    <DownloadIcon/>
                                                </a>
                                            }
                                            {
                                                this.props.unionStore.union.statement_sample &&
                                                <div className="icon remove" onClick={() => this.deleteApplication(this.props.unionStore.union.statement_sample?.link_id)}>
                                                    <RemoveIcon/>
                                                </div>
                                            }
                                            {/*<div className="icon append">*/}
                                            {/*    <AppendIcon/>*/}
                                            {/*</div>*/}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <span>{this.props.userStore.languageList["Шаблон импорта детей"] || 'Шаблон импорта детей'}</span>
                                    <div className={"documents"} style={{ flexWrap: 'nowrap' }}>
                                        <label className="document" style={{ width: "100%", padding: '0px 10px' }}>
                                            <span>{this.props.userStore.languageList["Шаблон для импорта детей.xlsx"] || 'Шаблон для импорта детей.xlsx'}</span>
                                        </label>
                                        <div className="icons__wrapper" style={{
                                            height: '100%',
                                            border: '1px solid #E4E8F0'
                                        }}>
                                            <a href="https://storage.kasipodaq.org/9a0253ed91594acd968f7f75ac47b1d8.xlsx"  className="icon download">
                                                <DownloadIcon/>
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                <div style={{marginRight: 10}}>
                                    <span>{this.props.userStore.languageList["Шаблон импорта членов"] || 'Шаблон импорта членов'}</span>
                                    <div className={"documents"} style={{ flexWrap: 'nowrap' }}>
                                        <label className="document" style={{ width: "100%", padding: '0px 10px' }}>
                                            <span>{this.props.userStore.languageList["Шаблон для импорта членов.xlsx"] || 'Шаблон для импорта членов.xlsx'}</span>
                                        </label>
                                        <div className="icons__wrapper" style={{
                                            height: '100%',
                                            border: '1px solid #E4E8F0'
                                        }}>
                                            <a href="https://storage.kasipodaq.org/0c818552a30f5f7245387f8f112f1851.xlsx"  className="icon download">
                                                <DownloadIcon/>
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                <div style={{marginRight: 10}}>
                                    <span>{this.props.userStore.languageList["Образец импорта членов профсоюза"] || 'Образец импорта членов профсоюза'}</span>
                                    <div className={"documents"} style={{ flexWrap: 'nowrap' }}>
                                        <label className="document" style={{ width: "100%", padding: '0px 10px' }}>
                                            <span>{this.props.userStore.languageList["Образец импорта членов профсоюза.xlsx"] || 'Образец импорта членов профсоюза.xlsx'}</span>
                                        </label>
                                        <div className="icons__wrapper" style={{
                                            height: '100%',
                                            border: '1px solid #E4E8F0'
                                        }}>
                                            <a href="https://storage.kasipodaq.org/de3f56d18f0870e57e797b152998df3c.xlsx"  className="icon download">
                                                <DownloadIcon/>
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <span>{this.props.userStore.languageList["Образец импорта детей членов профсоюза"] || 'Образец импорта детей членов профсоюза'}</span>
                                    <div className={"documents"} style={{ flexWrap: 'nowrap' }}>
                                        <label className="document" style={{ width: "100%", padding: '0px 10px' }}>
                                            <span>{this.props.userStore.languageList["Образец импорта детей членов профсоюза.xlsx"] || 'Образец импорта детей членов профсоюза.xlsx'}</span>
                                        </label>
                                        <div className="icons__wrapper" style={{
                                            height: '100%',
                                            border: '1px solid #E4E8F0'
                                        }}>
                                            <a href="https://storage.kasipodaq.org/9254dc6ab19f7e95d680f9e31fd53bf3.xlsx"  className="icon download">
                                                <DownloadIcon/>
                                            </a>
                                        </div>
                                    </div>
                                </div>

                        </div>

                            <div style={{ border: "1px solid #E4E8F0", padding: 20 }}>
                                <div>
                                    <span>{this.props.userStore.languageList["Образцы"] || 'Образцы'}</span>
                                    <div className="documents">

                                        {
                                            this.props.unionStore.applications.map((application, index) => {
                                                return  <div className='documents' style={{ flexWrap: 'nowrap' }}>
                                                    <label className="document" style={{ width: '100%' }}>
                                                    <span>
                                                        {
                                                            application.name ?
                                                                application.name :
                                                                this.props.userStore.languageList["Документ"] || 'Документ'
                                                        }
                                                    </span>

                                                        {
                                                            !application.name &&
                                                                <div className={'icons__wrapper'}>
                                                                    <div className="icon append">
                                                                        <AppendIcon/>
                                                                    </div>
                                                                </div>
                                                        }

                                                        <input type="file"
                                                               ref={this.applicationFile}
                                                               disabled={application.uri && true }
                                                               onChange={(event) => this.applicationChange(event, index)}
                                                        />
                                                    </label>
                                                        {
                                                            application.name &&
                                                            <div className="icons__wrapper" style={{
                                                                height: '75%',
                                                                border: '1px solid #E4E8F0'
                                                            }}>
                                                                {
                                                                    application.uri &&
                                                                    <a href={application.uri} className="icon download">
                                                                        <DownloadIcon/>
                                                                    </a>
                                                                }
                                                                {
                                                                    application.name &&
                                                                    <div className="icon remove" onClick={() => this.deleteFile(application.resource_id)}>
                                                                        <RemoveIcon/>
                                                                    </div>
                                                                }
                                                            </div>
                                                        }
                                                </div>
                                            })
                                        }
                                    </div>
                                </div>

                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 30}}>
                                    <p onClick={() => this.props.unionStore.addApplication()} style={{ display: "flex", alignItems: "center", cursor: "pointer" }}><ApplicationAdd style={{ marginRight: 10 }}/>{this.props.userStore.languageList["Добавить документ"] || 'Добавить документ'}</p>
                                    <p onClick={this.applicationUpload} className={'btn-action-sample'}>{this.props.userStore.languageList["Загрузить"] || 'Загрузить'}</p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default inject('unionStore', 'userStore', 'permissionsStore')(observer(SampleApplication));