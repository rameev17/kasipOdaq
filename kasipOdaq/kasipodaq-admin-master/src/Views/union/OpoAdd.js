import React, {Component} from 'react';
import ReactQuill from 'react-quill'
import {connect} from 'react-redux'
import 'react-quill/dist/quill.snow.css';
import {ReactComponent as RemoveIcon} from "../../assets/icons/delete.svg";
import {ReactComponent as CameraIcon} from "../../assets/icons/camera.svg";
import {inject, observer} from "mobx-react";

class OpoAdd extends Component {

    state = {
        backLink: '',
        logoFile: null,
        logoUrl: null,
        name: '',
        unionDescription: '',
    }

    handleChangeField = ({target}) => {
        this.setState({[target.name]: target.value})
    }

    handleCancel = () => {
        this.props.history.push(this.state.backLink)
    }

    handleSetImage = () => {
        this.fileInput.click()
    }

    render() {

        return (
            <div className="ppo-edit">
                <div className="toggle-lang">
                    {/*<div className="lang ru">Информация на русском языке</div>*/}
                    {/*<div className="lang kz">Информация на казахском языке</div>*/}
                </div>
                <div className="person">
                    <div className="container top">
                        <div className="data">
                            <p className='subtitle'>
                                {this.props.userStore.languageList["Об отрасли"] || 'Об отрасли'}
                            </p>
                            {/*<div className="img__wrapper">*/}
                                {/*<div className={`img ${(this.state.logoUrl ? 'with-image' : 'default')}`}*/}
                                     {/*style={{background: (this.state.logoUrl ? `url(${this.state.logoUrl}) no-repeat center center/ cover` : '')}}*/}
                                     {/*onClick={this.handleSetImage}>*/}
                                    {/*<div className="remove-icon">*/}
                                        {/*<RemoveIcon/>*/}
                                    {/*</div>*/}
                                {/*</div>*/}
                                {/*<div className='button'>*/}
                                    {/*<div className="icon">*/}
                                        {/*<CameraIcon/>*/}
                                    {/*</div>Загрузить логотип*/}
                                {/*</div>*/}
                                {/*<input type="file"*/}
                                       {/*onChange={this.handleInputLogo}*/}
                                       {/*ref={fileInput => this.fileInput = fileInput}*/}
                                       {/*name="photo"/>*/}
                            {/*</div>*/}
                            <label>
                                <span>{this.props.userStore.languageList["Наименование"] || 'Наименование'}</span>
                                <input type="text"
                                       onChange={this.handleChangeField}
                                       name='name'
                                       value={this.state.name}
                                       placeholder={this.props.userStore.languageList["Наименование"] || 'Наименование'}
                                />
                            </label>
                            <label>
                                <span>{this.props.userStore.languageList["Описание"] || 'Описание'}</span>
                                <ReactQuill
                                    value={this.state.unionDescription}
                                    onChange={this.changeUnionDescription}
                                />
                            </label>
                        </div>
                    </div>
                    <div className="btns">
                        <button className="cancel" onClick={this.handleCancel}>{this.props.userStore.languageList["Отменить"] || 'Отменить'}</button>
                        <button className="save" onClick={this.saveOpo}>{this.props.userStore.languageList["Сохранить"] || 'Сохранить'}</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default inject('userStore')(observer(OpoAdd));