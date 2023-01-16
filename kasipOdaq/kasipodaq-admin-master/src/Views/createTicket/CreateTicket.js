import React, {Component} from 'react';
import Layout from "../Containers/Layout";

import {ReactComponent as ClipIcon} from '../../assets/icons/clip.svg'

import './index.scss'

class CreateTicket extends Component {

    state = {
        theme: '',
        text: '',
        file: null
    }

    handleSubmit = (e) => {
        e.preventDefault()
        this.props.history.push('/preferences/support')
    }

    render() {

        return (

            <Layout title={this.props.title}>
                <div className="content">
                    <h1 class="title">Подать обращение</h1>
                    <div className="create-ticket panel">
                        <form className="form-send__request" onSubmit={this.handleSubmit}>
                            <label>
                                <span className="title">Тема:</span>
                                <input type="text" name="theme" className="theme"/>
                            </label>
                            <label>
                                <span className="text">Содержание:</span>
                                <textarea name="text" className="content"></textarea>
                            </label>
                            <label className='append-file'>
                            <span className="title">
                                    {!this.state.file ? 'Прикрепить файл' : this.state.file}
                            </span>
                                <div className="icon">
                                    <ClipIcon/>
                                </div>
                                <input type="file" name="file" onChange={this.handleSetFile}/>
                            </label>
                            <button type='submit' className="form-send__button">Отправить заявку</button>
                        </form>
                    </div>
                </div>
            </Layout>
        )
    }
}

export default CreateTicket;