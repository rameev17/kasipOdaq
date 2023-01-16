import React, {Component} from 'react';
import {Link} from 'react-router-dom'
import Calendar from 'react-calendar'
import * as dateFns from 'date-fns'
import ReactQuill from "react-quill";
import {ReactComponent as CameraIcon} from "../../assets/icons/camera.svg";

class PersonEdit extends Component {

    state = {
        firstName: '',
        lastName: '',
        middleName: '',
        description: '',
        birthday: '',
        birthdayFormatted: '',
        backLink: '',
        showCalendar: false,
        img_id: null
    }

    render() {

        return (
            <div className='content member__wrapper'>
                <Link className='bread-crumbs' to={this.state.backLink}>Вернуться в список членов профсоюза</Link>
                <div className='panel member'>
                    <div className="profile">
                        <div className="toggle-lang">
                            {/*<div className="lang ru">Информация на русском языке</div>*/}
                            {/*<div className="lang kz">Информация на казахском языке</div>*/}
                        </div>
                        <div className="person data person__add">
                            <p className='subtitle'>
                                Личные данные
                            </p>
                            <div className="container top">
                                <div className="col-left">
                                    <label className="img__wrapper">
                                        <div className={`img ${(this.state.img ? 'with-image' : 'default')}`}
                                             style={{background: (this.state.img ? `url(${this.state.img}) no-repeat center center/ cover` : '')}}>
                                            <input type="file"
                                                   style={{display: 'none'}}
                                                   onChange={this.handleSetPhoto}
                                                   name="photo"/>
                                        </div>
                                        <div className='button'>
                                            <div className="icon">
                                                <CameraIcon/>
                                            </div>
                                            Загрузить фото
                                        </div>
                                    </label>

                                    <div className="label__wrapper">
                                        <label>
                                            <span>Имя</span>
                                            <input type="text" onChange={this.handleChangeField} name='firstName' value={this.state.firstName} placeholder='Имя'/>
                                        </label>
                                        <label>
                                            <span>Фамилия</span>
                                            <input type="text" onChange={this.handleChangeField} name='lastName' value={this.state.lastName} placeholder='Фамилия'/>
                                        </label>
                                        <label>
                                            <span>Отчество</span>
                                            <input type="text" onChange={this.handleChangeField} name='middleName' value={this.state.middleName} placeholder='Отчество'/>
                                        </label>
                                    </div>
                                </div>
                                <div className="col-right">
                                    <div className="label__wrapper">
                                        <label onClick={() => {this.setState({showCalendar: true})}}>
                                            <span>Дата рождения</span>
                                            <input type="text" value={this.state.birthdayFormated}/>
                                            <span className="calendar" style={{display: this.state.showCalendar ? 'block' : 'none'}}>
                                                <Calendar
                                                    onChange={this.changeDate}
                                                    value={this.state.birthday}
                                                />
                                            </span>
                                        </label>
                                        <label>
                                            <span>Должность</span>
                                            <input type="text" onChange={this.handleChangeField} name='post' value={this.state.post} placeholder='Должность'/>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="container bottom">
                                <label>
                                    <span>Описание</span>
                                    <ReactQuill
                                        value={this.state.description}
                                        onChange={this.changeDescription}
                                    />
                                </label>
                            </div>
                        </div>
                        <div className="btns">
                            <button className="cancel" onClick={this.handleCancel}>Отменить</button>
                            <button className="save" onClick={this.saveRequest}>Сохранить</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default PersonEdit;