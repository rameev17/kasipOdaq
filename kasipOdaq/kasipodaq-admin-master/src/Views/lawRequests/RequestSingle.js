import React, {Component} from 'react';
import ReactQuill from 'react-quill'
import {ReactComponent as AppendIcon} from "../../assets/icons/clip.svg";
import {ReactComponent as DownloadIcon} from "../../assets/icons/download.svg";
import {ReactComponent as AddIcon} from '../../assets/icons/add.svg';
import {ReactComponent as RemoveIcon} from "../../assets/icons/delete.svg";
import {NotificationContainer, NotificationManager} from "react-notifications";
import {inject, observer} from "mobx-react";
import Preloader from "../../fragments/preloader/Preloader";
import {Link} from "react-router-dom";
const dateFormat = require('dateformat');

class RequestSingle extends Component {
    constructor(props){
        super(props)

        this.state = {
            preloader: true,
        }

        this.fileRef = React.createRef()

        this.answerAdd = this.answerAdd.bind(this)
        this.fileUpload = this.fileUpload.bind(this)
        this.deleteFile = this.deleteFile.bind(this)
    }

    componentDidMount() {
        this.props.appealStore.loadAppeal(this.props.match.params.id, 0, () => {
            this.setState({ preloader: false })
            this.props.appealStore.answerAppealText = '';
            this.props.appealStore.applicationFiles = []
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
                this.setState({ preloader: false })
                this.props.history.push('/')
            }
        })
    }

    answerAdd() {
        if (this.props.appealStore.answerAppealText == ''){
            NotificationManager.error('Заполните поле "Ответ"')
        }else{
            this.setState({preloader: true})

            let used = {};
            let arr = this.props.appealStore.applicationFiles
            const files = arr.map(file =>
                file.id).join(",");

            let filtered = arr.filter(function(obj) {
                return obj != null && obj.id in used ? 0:(used[obj.id]=1);
            });

            let array2 = filtered.filter(element => element != "");

            const id = array2.map(file =>
                file.id).filter(function (obj) {
                return obj != undefined
            })

            const newId = id.map(file =>
                file).toString()

            this.props.appealStore.answerAppeal(
                this.props.match.params.id,
                newId,
                () => {
                    this.props.appealStore.files = []
                    this.props.appealStore.file = { name: 'Прикрепить файл' }
                    this.setState({preloader: false})
                    this.props.history.push('/law-requests')
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
                        this.setState({ preloader: false })
                        this.props.history.push('/')
                    }
                })
        }
    }

    fileUpload(event, index){
        this.props.appealStore.answerFiles[index] = event.target.files[0]

        this.props.appealStore.answerFiles.map(file => {
            this.props.appealStore.applicationFiles.push(file)
        })

        this.setState({ preloader: true })
        this.props.appealStore.applicationFiles.map(application => {
            return application.size &&
                this.props.appealStore.uploadFile(
                    application,(data, headers) => {
                        application.id = headers['x-entity-id']
                        this.setState({
                            preloader: false,
                            fileUpload: true
                        })
                    }
                )
        })
    }

    deleteFile() {
        this.fileRef.current.files = null
        this.props.appealStore.file = { name: "Прикрепить файл" }
    }

    render() {

        return (
            <div className='request-single'>
                {
                    this.state.preloader &&
                    <Preloader/>
                }
                <NotificationContainer/>

                <div style={{ marginBottom: 16 }}>
                    <Link style={{ color: '#0052A4' }} to={`/appeal`}>Обращения</Link>
                    <span> -> </span>
                    <Link style={{ color: '#0052A4' }}>{this.props.appealStore.appeal.title}</Link>
                </div>

                <h3 className="name">
                    {
                        this.props.appealStore.appeal.person.patronymic !== null ?
                            `${this.props.appealStore.appeal.person.first_name} ${this.props.appealStore.appeal.person.family_name}  ${this.props.appealStore.appeal.person.patronymic}`
                            :
                            `${this.props.appealStore.appeal.person.first_name} ${this.props.appealStore.appeal.person.family_name}`
                    }
                </h3>
                <div className="request__wrapper">
                    <h1 className="subject">{this.props.appealStore.appeal.title}</h1>
                    <div className="date">{ dateFormat(this.props.appealStore.appeal.created_date, 'dd.mm.yyyy, hh:mm:ss') }</div>
                    <div className="question">{this.props.appealStore.appeal.content}</div>

                    <ul className="documents">
                        {this.props.appealStore.appeal.files.map((file, index) => {
                            return <li key={index}>
                                <a href={file.uri} className="download__link" target={'_blank'} style={{ minHeight: '44px', height: 'auto' }}>
                                    { file.name }
                                    <div className="icon">
                                        <DownloadIcon/>
                                    </div>
                                </a>
                            </li>
                        })}
                    </ul>

                </div>
                <div className="answer__wrapper">
                    <label className='answer'>
                        <span className='text'>{this.props.userStore.languageList["Ответ"] || 'Ответ'}</span>
                        <ReactQuill
                            value={ this.props.appealStore.appeal.answer && this.props.appealStore.appeal.answer.content || this.props.appealStore.answerAppealText}
                            onChange={(text) => { this.props.appealStore.answerAppealText = text }}
                        />
                    </label>
                </div>
                {
                    this.props.appealStore.appeal.answer.files &&
                    this.props.appealStore.appeal.answer.files.length > 0 ?
                        <ul className="documents">
                            { this.props.appealStore.appeal.answer.files.map(file => {
                                return <li>
                                    <a href={file.uri} className="download__link" target={'_blank'} style={{ minHeight: '44px', height: 'auto' }}>
                                        { file.name }
                                        <div className="icon">
                                            <DownloadIcon/>
                                        </div>
                                    </a>
                                </li>
                            }) }
                        </ul>
                        :
                        this.props.appealStore.answerFiles.map((file, index) => {
                            return <label className={'document append-file' + (this.state.answerAttachment ? ' is-attached' : '')}>
                    <span className="placeholder">
                           { file.name || "Прикрепить файл" }
                    </span>
                                <input type="file" name="file" style={{display: 'none'}} onChange={(event) => this.fileUpload(event, index)} ref={this.fileRef}/>
                                <div className="icons__wrapper">

                                    <div className="icon append">
                                        <AppendIcon/>
                                    </div>

                                    <React.Fragment>
                                        {/*<div className="icon download">*/}
                                        {/*    <a href="#"*/}
                                        {/*       target='_block'*/}
                                        {/*       onClick={(e) => {*/}
                                        {/*           e.stopPropagation()*/}
                                        {/*       }}>*/}
                                        {/*        <DownloadIcon/>*/}
                                        {/*    </a>*/}
                                        {/*</div>*/}
                                        {/*{*/}
                                        {/*    file.name &&*/}
                                        {/*    <div className="icon remove" onClick={this.deleteFile}>*/}
                                        {/*        <RemoveIcon/>*/}
                                        {/*    </div>*/}
                                        {/*}*/}

                                    </React.Fragment>

                                </div>
                            </label>
                        })
                }

                {
                    !this.props.appealStore.appeal.answer.files &&
                    <p onClick={() => this.props.appealStore.addFileToAppeal()} style={{ display: "flex", alignItems: "center", cursor: "pointer" }}><AddIcon style={{ marginRight: 10 }}/>{this.props.userStore.languageList["Прикрепить еще файл"] || 'Прикрепить еще файл'}</p>
                }

                {
                    !this.props.appealStore.appeal.answer.content &&
                    <div className="btns">
                        <button className="cancel" onClick={() => { this.props.history.push('/appeal') }}>{this.props.userStore.languageList["Отменить"] || 'Отменить'}</button>
                        <button className="save" onClick={this.answerAdd}>{this.props.userStore.languageList["Ответить"] || 'Ответить'}</button>
                    </div>
                }

            </div>
        );
    }
}

export default inject('appealStore', 'userStore', 'permissionsStore')(observer(RequestSingle));