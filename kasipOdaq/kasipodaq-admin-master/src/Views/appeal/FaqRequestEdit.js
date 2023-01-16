import React, {Component} from 'react';
import ReactQuill from 'react-quill';
import {inject, observer} from "mobx-react";

class FaqRequestEdit extends Component {
    state = {
        backLink: '',
        title: '',
        description: '',
    }

    handleChangeField = ({target}) => {
        this.setState({[target.name]: target.value})
    }

    handleCancel = () => {
        this.props.history.push({
            pathname: this.state.backLink,
            state: { tabId: 2 }
        })
    }

    changeDescription = (text) => {
        this.setState({description: text})
    }

    render() {
        return (
            <div className='law-request-edit'>
                <div className="toggle-lang">
                    {/*<div className="lang ru">Информация на русском языке</div>*/}
                    {/*<div className="lang kz">Информация на казахском языке</div>*/}
                </div>
                <div className="data">
                    <label>
                        <span>{this.props.userStore.languageList["Тема"] || 'Тема'}</span>
                        <input type="text" onChange={this.handleChangeField} name='title'
                               value={this.state.title}
                               placeholder={this.props.userStore.languageList["Наименование"] || 'Наименование'}
                        />
                    </label>
                    <label>
                        <span>{this.props.userStore.languageList["Описание"] || 'Описание'}</span>
                        <ReactQuill
                            value={this.state.description}
                            onChange={this.changeDescription}
                        />
                    </label>
                </div>
                <div className="btns">
                    <button className="cancel" onClick={this.handleCancel}>{this.props.userStore.languageList["Отменить"] || 'Отменить'}</button>
                    <button className="save" onClick={this.saveRequest}>{this.props.userStore.languageList["Сохранить"] || 'Сохранить'}</button>
                </div>
            </div>
        );
    }
}

export default inject('userStore')(observer(FaqRequestEdit));