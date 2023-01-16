import React, {Component} from 'react';
import ReactQuill from 'react-quill'
import {connect} from 'react-redux'

class FprkRequestAdd extends Component {
    state = {
        backLink: '/requests/faq',
        title: '',
        description: '',
    }

    componentDidMount() {

        this.setState({
            backLink: `/requests/faq`
        })

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
                        <input type="text" onChange={this.handleChangeField} name='title' value={this.state.name} placeholder='Наименование'/>
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
                    <button className="save" onClick={this.createRequest}>Сохранить</button>
                </div>
            </div>
        );
    }
}

export default FprkRequestAdd;