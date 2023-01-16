import React, {Component} from 'react';
import {connect} from 'react-redux'
import {Link} from "react-router-dom";
import Calendar from 'react-calendar'
import * as dateFns from "date-fns";

import {ReactComponent as RejectIcon} from '../../assets/icons/delete.svg'
import {ReactComponent as CheckMarkIcon} from '../../assets/icons/check-mark.svg'
import {ReactComponent as DownLoadIcon} from "../../assets/icons/download.svg";

class JoinRequest extends Component {
    constructor(props){
        super(props)

        this.state = {
            showCalendar: false
        }
    }

    handleClickOutside = () => {
        this.setState({showCalendar: false})
    }

    changeDate = (date) => {
        this.setState({birthdayFormated: dateFns.format(date,'dd.MM.yyyy')})
    }

    render() {

        return (
            <div className='member'>
                <div className="profile personal__wrapper">
                    <div className="add__person data">
                        <p className='subtitle'>
                            Личные данные rr
                        </p>
                        <div className="container top">
                            <div className="col-left">
                                <div className="label__wrapper-text">
                                    <label>
                                        <span>Имя</span>
                                        <input
                                            type="text"
                                            onChange={this.handleChangeField}
                                            name='firstName'
                                            value={this.state.firstName}
                                            placeholder='Имя'
                                            disabled/>
                                    </label>
                                    <label>
                                        <span>Фамилия</span>
                                        <input
                                            type="text"
                                            onChange={this.handleChangeField}
                                            name='lastName'
                                            value={this.state.lastName}
                                            placeholder='Фамилия'
                                            disabled/>
                                    </label>
                                    <label>
                                        <span>Отчество</span>
                                        <input
                                            type="text"
                                            onChange={this.handleChangeField}
                                            name='middleName'
                                            value={this.state.middleName}
                                            placeholder='Отчество'
                                            disabled/>
                                    </label>
                                </div>
                            </div>
                            <div className="col-right">
                                <label onClick={() => {this.setState({showCalendar: true})}}>
                                    <span>Дата рождения</span>
                                    <input
                                        type="text"
                                        value={this.state.birthdayFormated}
                                        disabled/>
                                    {/*<span className="calendar" style={{display: this.state.showCalendar ? 'block' : 'none'}}>*/}
                                    {/*    <Calendar*/}
                                    {/*        onChange={this.changeDate}*/}
                                    {/*        value={this.state.birthday}*/}
                                    {/*    />*/}
                                    {/*</span>*/}
                                </label>
                                <label>
                                    <span>ИИН</span>
                                    <input type="text"
                                           onChange={this.handleChangeField}
                                           name='iin'
                                           value={this.state.iin}
                                           placeholder='ИИН'
                                           disabled/>
                                </label>
                                <div className="gender">
                                    <span>Пол</span>
                                    <div className="gender__radios">
                                        <label>
                                            <input
                                                type="radio"
                                                name='gender'
                                                checked={this.state.gender == 55}
                                                value='Мужской'
                                                disabled/>
                                            <span className='radio'/>
                                            <div className="text">
                                                Мужской
                                            </div>
                                        </label>
                                        <label>
                                            <input type="radio"
                                                   name='gender'
                                                   checked={this.state.gender == 54}
                                                   value='Женский'
                                                   disabled/>
                                            <span className='radio'/>
                                            <div className="text">
                                                Женский
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="container bottom">
                            <div className="col-left">
                                <p className='subtitle'>
                                    Контактные данные
                                </p>
                                <label>
                                    <span>Адрес</span>
                                    <input
                                        type="text"
                                        name='address'
                                        value={this.state.address}
                                        onChange={this.handleChangeField}
                                        placeholder='Адрес'
                                        disabled/>
                                </label>
                                <label>
                                    <span>Телефон</span>
                                    <input
                                        type="text"
                                        name='phone'
                                        value={this.state.phone}
                                        onChange={this.handleChangeField}
                                        placeholder='Телефон'
                                        disabled/>
                                </label>
                                <label>
                                    <span>E-mail</span>
                                    <input
                                        type="email"
                                        name='email'
                                        value={this.state.email}
                                        onChange={this.handleChangeField}
                                        placeholder='E-mail'
                                        disabled/>
                                </label>
                            </div>
                            <div className="col-right">
                                <p className='subtitle'>
                                    Должностные данные
                                </p>
                                <label>
                                    <span>Должность</span>
                                    <input
                                        type="text"
                                        onChange={this.handleChangeField}
                                        value={this.state.post}
                                        name='post'
                                        placeholder='Должность'
                                        disabled/>
                                </label>
                                <ul className="documents">
                                    <li>
                                        <a href='#' className="download__link">
                                            name
                                            <div className="icon">
                                                <DownLoadIcon/>
                                            </div>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="btns">
                        <button className="btn-action cancel">
                            <span className="icon">
                                <RejectIcon/>
                            </span>
                            <span>Отклонить</span>
                        </button>
                        <button className="btn-action save">
                            <span className="icon">
                                <CheckMarkIcon/>
                            </span>
                            <span>Принять</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default JoinRequest;