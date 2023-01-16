import React, {Component} from 'react';
import {withRouter} from 'react-router-dom'
import ReactQuill from "react-quill";
import {ReactComponent as DownloadIcon} from '../../assets/icons/download.svg'
import {ReactComponent as RemoveIcon} from '../../assets/icons/delete.svg'
import {ReactComponent as AppendIcon} from '../../assets/icons/clip.svg'
import {ReactComponent as EditIcon} from '../../assets/icons/edit.svg'
import {connect} from "react-redux";

const ARTICLE_1_ID = 278
const ARTICLE_2_ID = 279
const ARTICLE_3_ID = 280
const ARTICLE_4_ID = 281

class Division extends Component {

    state = {
        isEditing: false,
        title: '',
        description: '',
        bufferTitle: '',
        bufferDescription: '',
        document: null,
        fileName: 'Прикрепить файл'
    }

    render() {

        return (
            <div className='division'>
                {/* <div className="add-document">
                    <div className="document-container">
                        <span>Прикрепите документ</span>
                        <div className="document">
                            <div className="placeholder">
                                {this.state.fileName}
                            </div>
                            {this.state.document &&
                                <a href='#' className="download">download</a>
                            }
                            <div className="icons__wrapper">
                                <div className="icon download">
                                    <DownloadIcon/>
                                </div>
                                <div className="icon remove" onClick={() => this.handleRemoveFile('document')}>
                                    <RemoveIcon/>
                                </div>
                                <div className="icon append" onClick={() => this.handleSetFile('document')}>
                                    <AppendIcon/>
                                </div>
                            </div>
                        </div>
                        <input type="file" name="document"
                               onChange={this.handleInputDocument}
                               style={{display: 'none'}}
                               ref={fileInput => this.documentInput = fileInput}/>
                    </div>
                </div> */}
                <div className="info">
                    <div className="title-wrapper">
                        <h2 className="subtitle">{this.state.title}</h2>
                        <div className="line"/>
                        {/*<button onClick={this.editInfo}>*/}
                        {/*    <div className="btn-action">*/}
                        {/*        <span className="icon">*/}
                        {/*            <EditIcon/>*/}
                        {/*        </span>*/}
                        {/*        <span>Редактировать</span>*/}
                        {/*    </div>*/}
                        {/*</button>*/}
                    </div>
                    <div className="content" >

                    </div>
                </div>
                <div className='info-edit'>
                    <div className="toggle-lang">
                        {/*<div className="lang ru">Информация на русском языке</div>*/}
                        {/*<div className="lang kz">Информация на казахском языке</div>*/}
                    </div>
                    <div className="data">
                        <label>
                            <span>Заголовок</span>
                            <input type="text"
                                   value={this.state.title}
                                   onChange={this.handleTitleChange}
                                   placeholder='Заголовок'/>
                        </label>
                        <label>
                            <span>Описание</span>
                            <ReactQuill
                                value={this.state.description}
                                onChange={this.changeDescription}
                            />
                        </label>
                    </div>
                    <div className="btns">
                        {/*<button className="cancel" onClick={this.cancelEditInfo}>Отменить</button>*/}
                        <button className="save" onClick={this.editArticle}>Сохранить</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Division);