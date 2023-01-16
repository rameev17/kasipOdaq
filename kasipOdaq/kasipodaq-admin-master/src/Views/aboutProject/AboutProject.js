import React, {Component} from 'react';
import {ReactComponent as EditIcon} from "../../assets/icons/edit.svg";
import ReactQuill from "react-quill";
import Layout from "../Containers/Layout";
import './index.scss'

class AboutProject extends Component {

    state = {
        isEditing: false,
        description: ''
    }

    toggleEditInfo = () => {
        this.setState({
            isEditing: !this.state.isEditing
        })
    }

    changeDescription = (text) => {
        this.setState({description: text})
    }

    handleTitleChange = e => {
        this.setState({
            title: e.target.value
        })
    }

    render() {

        return (
            <Layout title='О проекте'>
                <div className="about-project content">
                    <h1 className='title'>О проекте</h1>
                    <div className="panel">
                        <div className="histtory__wrapper">
                            <div className="title-wrapper">
                                <h2 className="subtitle">title</h2>
                                <div className="line"/>
                                <button  onClick={this.toggleEditInfo}>
                                    <div className="btn-action">
                                        <span className="icon">
                                            <EditIcon/>
                                        </span>
                                        <span>Редактировать</span>
                                    </div>
                                </button>
                            </div>
                            <div className="content">
                                description
                            </div>
                        </div>

                        <div className='histtory__wrapper'>
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
                                <button className="cancel" onClick={this.toggleEditInfo}>Отменить</button>
                                <button className="save" onClick={this.editArticle}>Сохранить</button>
                            </div>
                        </div>

                    </div>
                </div>
            </Layout>
        );
    }
}

export default AboutProject;