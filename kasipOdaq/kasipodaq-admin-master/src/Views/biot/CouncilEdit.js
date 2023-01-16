import React, {Component} from 'react';
import ReactQuill from 'react-quill'
import {inject, observer} from "mobx-react";

class CouncilEdit extends Component {

    state = {
        backLink: '/biot/council',
        name: '',
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

    componentDidMount() {
        this.props.history.push({
            state: { tabId: 2 }
        })
    }

    render() {

        return (
            <div className='council-edit'>
                <div className="toggle-lang">
                    {/*<div className="lang ru">Информация на русском языке</div>*/}
                    {/*<div className="lang kz">Информация на казахском языке</div>*/}
                </div>
                <div className="data">
                    <label>
                        <span>{this.props.userStore.languageList["Наименование"] || 'Наименование'}</span>
                        <input type="text" onChange={this.handleChangeField} name='name' value={this.state.name}
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
                    <button className="save">{this.props.userStore.languageList["Сохранить"] || 'Сохранить'}</button>
                </div>
            </div>
        );
    }
}

export default inject('userStore')(observer(CouncilEdit));