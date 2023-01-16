import React, {Component} from 'react';
import ReactQuill from 'react-quill';
import {inject, observer} from "mobx-react";

class FaqRequestAdd extends Component {
    state = {
        backLink: '/law-requests/faq',
        title: '',
        description: '',
    }

    componentDidMount() {

        this.setState({
            backLink: `/law-requests/faq`
        })
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
                        <input type="text" name='title' value={this.state.name}
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
                    <button className="save" onClick={this.createRequest}>{this.props.userStore.languageList["Сохранить"] || 'Сохранить'}</button>
                </div>
            </div>
        );
    }
}

export default inject('userStore')(observer(FaqRequestAdd));