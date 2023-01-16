import React, {Component} from 'react';
import ReactQuill from 'react-quill'
import {ReactComponent as AppendIcon} from "../../assets/icons/clip.svg";
import {ReactComponent as DownloadIcon} from "../../assets/icons/download.svg";
import {ReactComponent as RemoveIcon} from "../../assets/icons/delete.svg";
import {NotificationContainer, NotificationManager} from "react-notifications";
import {inject, observer} from "mobx-react";
import Preloader from "../../fragments/preloader/Preloader";
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
        this.props.appealStore.loadAppeal(this.props.match.params.id, 4, () => {
            this.setState({ preloader: false })
            this.props.appealStore.answerAppealText = '';
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
        this.setState({preloader: true})

        let id = this.props.match.params.id

        if (this.fileRef.current != null && this.fileRef.current.files.length > 0) {

            this.props.appealStore.uploadFile(data => {
                this.props.appealStore.answerAppeal(id, () => {
                    this.props.appealStore.files = []
                    this.props.appealStore.file = { name: 'Прикрепить файл' }
                    this.setState({preloader: false})
                    this.props.history.push('/support')
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
            })
        }else{
            this.props.appealStore.answerAppeal(id,() => {
                this.props.appealStore.files = []
                this.props.appealStore.file = { name: 'Прикрепить файл' }
                this.setState({preloader: false})
                this.props.history.push('/support')
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

    fileUpload(){
        let file = this.fileRef.current.files[0]
        this.props.appealStore.file = file
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
                        <label className={'document append-file' + (this.state.answerAttachment ? ' is-attached' : '')}>
                    <span className="placeholder">
                           { this.props.appealStore.file.name || "Прикрепить файл" }
                    </span>
                            <input type="file" name="file" style={{display: 'none'}} onChange={this.fileUpload} ref={this.fileRef}/>
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
                                    {
                                        this.props.appealStore.file.name &&
                                        <div className="icon remove" onClick={this.deleteFile}>
                                            <RemoveIcon/>
                                        </div>
                                    }

                                </React.Fragment>

                            </div>
                        </label>
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