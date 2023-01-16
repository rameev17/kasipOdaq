import React, {Component} from 'react';
import ReactQuill from 'react-quill'
import {connect} from 'react-redux'

class FprkFaqRequestEdit extends Component {
    state = {
        backLink: '',
        title: '',
        description: '',
    }

    componentDidMount() {

        this.props.history.push({
            state: { tabId: 2 }
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
                        <span>Тема</span>
                        <input type="text" onChange={this.handleChangeField} name='title'
                               value={this.state.title} placeholder='Наименование'/>
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
                    <button className="cancel" onClick={this.handleCancel}>Отменить</button>
                    <button className="save" onClick={this.saveRequest}>Сохранить</button>
                </div>
            </div>
        );
    }
}

export default FprkFaqRequestEdit;