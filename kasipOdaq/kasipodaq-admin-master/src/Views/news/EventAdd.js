import React, {Component} from 'react';
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css';

import {ReactComponent as RemoveIcon} from '../../assets/icons/delete.svg'
import {ReactComponent as CameraIcon} from '../../assets/icons/camera.svg'
import {inject, observer} from "mobx-react";

class EventAdd extends Component {

    constructor(props) {
        super(props)
    }

    state = {
        backLink: `/news/ppo/${this.props.id}`,
        title: '',
        content: '',
        source: '',
        status: 0,
        logoFile: null,
        logoUrl: null,
        headers: null
    };

    handleChangeField = ({target}) => {
        this.setState({[target.name]: target.value})
    };

    handleCancel = () => {
        this.props.history.push(this.state.backLink)
    };

    render() {
        return (
            <div className='article-edit content'>
                <h1 className="title">
                    <span>{this.props.userStore.languageList["Добавить событие"] || 'Добавить событие'}</span>
                </h1>
                <div className="panel">
                    <div className="toggle-lang">
                        {/*<div className="lang ru">Информация на русском языке</div>*/}
                        {/*<div className="lang kz">Информация на казахском языке</div>*/}
                    </div>
                    <div className="container top">
                        <div className="data">
                            <div className="img__wrapper">
                                <div className={`img ${(this.state.img ? 'with-image' : 'default')}`}
                                     style={{background: (this.state.img ? `url(${this.state.img}) no-repeat center center/ cover` : '')}}
                                     onClick={this.handleSetImage}>
                                    <div className="remove-icon">
                                        <RemoveIcon/>
                                    </div>
                                </div>
                                <div className='button' onClick={this.handleSetImage}>
                                    <div className="icon">
                                        <CameraIcon/>
                                    </div>
                                    {this.props.userStore.languageList["Загрузить изображение"] || 'Загрузить изображение'}
                                </div>
                                <input type="file"
                                       onChange={this.handleInputLogo}
                                       ref={fileInput => this.fileInput = fileInput}
                                       name="photo"/>
                            </div>
                            <label>
                                <span>{this.props.userStore.languageList["Название"] || 'Название'}</span>
                                <input type="text" onChange={this.handleChangeField} name='title'
                                       value={this.state.title}
                                       placeholder={this.props.userStore.languageList["Наименование"] || 'Наименование'}
                                />
                            </label>
                            <label>
                                <span>{this.props.userStore.languageList["Контент"] || 'Контент'}</span>
                                <ReactQuill
                                    value={this.state.content}
                                    onChange={this.changeContent}
                                />
                            </label>
                            <label>
                                <span>{this.props.userStore.languageList["Источник"] || 'Источник'}</span>
                                <input type="text" onChange={this.handleChangeField} name='source'
                                       value={this.state.source}
                                       placeholder={this.props.userStore.languageList["Источник"] || 'Источник'}
                                />
                            </label>
                            <div className='checkbox'>
                                <input type="checkbox"
                                       checked={this.state.status}
                                       onClick={this.handleStatusCheck}
                                       id="source"
                                       name='source'
                                />
                                <label htmlFor="source">
                                    <div>{this.props.userStore.languageList["Опубликовать"] || 'Опубликовать'}</div>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="btns">
                        <button className="cancel" onClick={this.handleCancel}>{this.props.userStore.languageList["Отменить"] || 'Отменить'}</button>
                        <button className="save" onClick={this.addArticle}>{this.props.userStore.languageList["Сохранить"] || 'Сохранить'}</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default inject('userStore')(observer(EventAdd));