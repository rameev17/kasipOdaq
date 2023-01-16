import React, {Component} from 'react';
import {connect} from 'react-redux'
import ReactQuill from 'react-quill'
import * as dateFns from 'date-fns'
import {ReactComponent as RemoveIcon} from "../../assets/icons/delete.svg";
import {ReactComponent as AppendIcon} from "../../assets/icons/clip.svg";
import {ReactComponent as DownloadIcon} from "../../assets/icons/download.svg";

class RequestSingle extends Component {

    state = {
        answer: '',
        backLink: '/requests',
        file: '',
        fileHeaders: {}
    }

    handleDeleteFile = e => {
        e.preventDefault()

        this.setState({
            answerAttachment: null,
            fileHeaders: {}
        })
    }

    render() {

        return (
            <div className='request-single'>
                <h3 className="name">person</h3>
                <div className="request__wrapper">
                    <h2 className="subject">title</h2>
                    <div className="date">dd.MM.yyyy hh:mm:ss</div>
                    <div className="question"> question</div>
                <ul className="documents">
                    <li>
                        <a href='#' className="download__link">
                            name
                            <div className="icon">
                                <DownloadIcon/>
                            </div>
                        </a>
                    </li>
                </ul>
                </div>
                <div className="answer__wrapper">
                    <label className='answer'>
                        <span className='text'>Ответ</span>
                        <ReactQuill
                            value={this.state.answer}
                            onChange={this.changeAnswer}
                        />
                    </label>
                </div>
                <label className={'document append-file' + (this.state.answerAttachment ? ' is-attached' : '')}>
                    <span className="placeholder">
                            {!this.state.answerAttachment ? 'Прикрепить файл' : this.state.answerAttachment.file_name}
                    </span>
                    <input type="file" name="file" style={{display: 'none'}} onChange={this.handleSetFile}/>
                    <div className="icons__wrapper">
                        <div className="icon append">
                            <AppendIcon/>
                        </div>

                        <React.Fragment>
                            <div className="icon download">
                                <a href={this.state.answerAttachment.url.download}
                                   target='_block'
                                   onClick={(e) => {
                                       e.stopPropagation()
                                   }}>
                                    <DownloadIcon/>
                                </a>
                            </div>
                            <div className="icon remove" onClick={this.handleDeleteFile}>
                                <RemoveIcon/>
                            </div>
                        </React.Fragment>

                    </div>
                </label>
                <div className="btns">
                    <button className="cancel" onClick={this.handleCancel}>Отменить</button>
                    <button className="save" onClick={this.answerRequest}>Ответить</button>
                </div>
            </div>
        );
    }
}

export default RequestSingle;