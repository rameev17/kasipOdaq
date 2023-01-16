import React, {Component} from 'react';
import {ReactComponent as EditIcon} from "../../assets/icons/edit.svg";
import ReactQuill from "react-quill";

class AboutHistory extends Component{

    state = {
        isEditing: false,
    }

    editInfo() {
        this.setState({
            isEditing: true
        })
    }

     cancelEditInfo() {
        this.setState({
            isEditing: false,
        })
    }

    render() {
        return (
            <React.Fragment>
                <div className="content">
                    <h1 className='title'>История</h1>
                    <div className="panel">
                        <div className="histtory__wrapper">
                            <div className="title-wrapper">
                                <div className="line"/>
                                <button className='btn__wrapper' onClick={this.editInfo}>
                                    <div className="btn-action">
                                        <div className="icon">
                                            <EditIcon/>
                                        </div>
                                        <span>Редактировать</span>
                                    </div>
                                </button>
                            </div>
                            <div className="content">
                                description
                            </div>
                        </div>

                        {
                            this.state.isEditing &&
                            <div className='histtory__wrapper'>
                                <div className="toggle-lang">
                                    {/*<div className="lang ru">Информация на русском языке</div>*/}
                                    {/*<div className="lang kz">Информация на казахском языке</div>*/}
                                </div>
                                <div className="data">
                                    <label>
                                        <span>Описание</span>
                                        <ReactQuill
                                            value={this.state.description}
                                            onChange={this.changeDescription}
                                        />
                                    </label>
                                </div>
                                <div className="btns">
                                    <button className="cancel" onClick={this.cancelEditInfo}>Отменить</button>
                                    <button className="save" onClick={this.saveEditInfo}>Сохранить</button>
                                </div>
                            </div>
                        }

                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default AboutHistory;