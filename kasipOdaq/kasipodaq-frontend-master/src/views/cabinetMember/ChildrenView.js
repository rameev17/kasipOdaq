import React, {Component} from 'react'

import {ReactComponent as AddIcon} from '../../assets/icons/add.svg'
import {ReactComponent as DeleteIcon} from '../../assets/icons/delete.svg'

import './style.scss'
import {Link, Route} from 'react-router-dom'
import {inject, observer} from "mobx-react";

import Preloader from "../../fragments/preloader/Preloader";
import {NotificationContainer, NotificationManager} from 'react-notifications';
import InputMask from "react-input-mask";
import CookieService from "../../services/CookieService";
import format from 'date-fns/format'
import toDate from 'date-fns/toDate'
import parse from 'date-fns/parse'
import isValid from 'date-fns/isValid'

const dateFormat = require('dateformat')

class Children extends Component {
    constructor(props) {
        super(props);

        this.state = {
            preloader: true,
            newChild: false,
            updateChild: false,
        }

        this.nameRef = React.createRef()
        this.familyNameRef = React.createRef()
        this.patronymicRef = React.createRef()

        this.updateProfile = this.updateProfile.bind(this)
        this.nameInputChange = this.nameInputChange.bind(this)
        this.familyInputChange = this.familyInputChange.bind(this)
        this.patronymicInputChange = this.patronymicInputChange.bind(this)
        this.birthdayInputChange = this.birthdayInputChange.bind(this)
        this.iinInputChange = this.iinInputChange.bind(this)
        this.sexChange = this.sexChange.bind(this)
        this.deleteChildren = this.deleteChildren.bind(this)
    }

    loadPage(){
        this.props.userStore.childrenInfo( data => {
            if (data.length == 0){
                this.props.userStore.addChildren()
            }
            this.setState({ preloader: false })
        }, response => {
            if (Array.isArray(response.data)) {
                response.data.forEach(error => {
                    this.setState({ preloader: false })
                    NotificationManager.error(error.message)
                })
            } else {
                this.setState({ preloader: false })
                NotificationManager.error(response.data.message)
            }
        })
    }

    componentDidMount() {
        this.loadPage()
    }

    nameInputChange(event, index) {
        this.props.userStore.childrens[index].first_name = event.target.value
    }

    familyInputChange(event, index) {
        this.props.userStore.childrens[index].family_name = event.target.value
    }

    patronymicInputChange(event, index) {
        this.props.userStore.childrens[index].patronymic = event.target.value
    }

    birthdayInputChange(event, index) {
        const date = event.target.value

        this.props.userStore.childrens[index].birthday = date
    }

    iinInputChange(event, index) {
        this.props.userStore.childrens[index].personal_code = event.target.value
    }

    sexChange(e, index){
        this.props.userStore.childrens[index].sex = e.target.value
    }

    createUpdateChildren(){
        this.props.userStore.childrens.map( async children => {
            return children.is_new ?
                children.personal_code.length !== 12 ?
                    NotificationManager.error("ИИН должен состоять из 12 цифр")
                    :
                    children.birthday.split('-')[1] > 12 ?
                        NotificationManager.error('Введите корректный месяц в поле "День рождения"')
                    :
                        children.birthday.split('-')[0] > 31 || children.birthday.split('-')[0] == '00' ?
                            NotificationManager.error('Введите корректное число в поле "День рождения"')
                            :
                    await this.props.userStore.childrenCreate(
                        children.first_name,
                        children.family_name,
                        children.patronymic,
                        children.sex,
                        new Date(Date.UTC(children.birthday.split('-')[2], children.birthday.split('-')[1] - 1, children.birthday.split('-')[0])).toISOString(),
                        children.personal_code,
                        () => {
                            this.setState({
                                preloader: false,
                                newChild: true
                            })
                            this.props.history.push('/cabinet')
                            NotificationManager.success("Успешно сохранено!")
                        }, response => {
                            if (Array.isArray(response.data)) {
                                response.data.forEach(error => {
                                    this.setState({ preloader: false })
                                    NotificationManager.error(error.message)
                                })
                            } else {
                                this.setState({ preloader: false })
                                NotificationManager.error(response.data.message)
                            }
                        }
                    )
                : this.setState({ preloader: false })
        })

        // this.props.userStore.childrens.map(children => {
        //     return children.resource_id ?
        //         console.log(format(new Date(children.birth_date),"dd-MM-yyyy").split('-')[1])
        //         : ''
        // })

        this.props.userStore.childrens.map( async children => {
            return children.resource_id ?
                children.personal_code.toString().length != 12 ?
                    NotificationManager.error("ИИН должен состоять из 12 цифр")
                    :
                    children.birthday?.split('-')[1] > 12 ?
                        NotificationManager.error('Введите корректный месяц в поле "День рождения"')
                        :
                        children.birthday?.split('-')[0] > 31
                        || children.birthday?.split('-')[0] == '00' ?
                            NotificationManager.error('Введите корректное число в поле "День рождения"')
                            :
                await this.props.userStore.childrenUpdate(
                    children.resource_id,
                    children.first_name,
                    children.family_name,
                    children.patronymic,
                    children.sex == 1,
                    children.birthday ?
                    new Date(Date.UTC(children.birthday.split('-')[2], children.birthday.split('-')[1] - 1, children.birthday.split('-')[0])).toISOString()
                    :
                    new Date(Date.UTC(format(new Date(children.birth_date), "dd-MM-yyyy").split('-')[2], format(new Date(children.birth_date), "dd-MM-yyyy").split('-')[1] - 1, format(new Date(children.birth_date),"dd-MM-yyyy").split('-')[0])).toISOString(),
                    children.personal_code.toString(),
                    () => {
                        this.setState({
                            preloader: false,
                            updateChild: true
                        })
                        this.props.history.push('/cabinet')
                        NotificationManager.success("Успешно отредактировано!")
                    }, response => {
                        if (Array.isArray(response.data)) {
                            response.data.forEach(error => {
                                this.setState({ preloader: false })
                                NotificationManager.error(error.message)
                            })
                        } else {
                            this.setState({ preloader: false })
                            NotificationManager.error(response.data.message)
                        }
                    }
                )
                : this.setState({ preloader: false })
        })
    }

    updateProfile(e){
        e.preventDefault()

        Promise.resolve(this.createUpdateChildren()).then(() => {
            if (this.state.newChild || this.state.updateChild){
                this.props.history.push('/cabinet')
            }
        })
    }

    deleteChildren(event){
        this.setState({ preloader: true })

        let id = event.target.dataset.id
        if (id !== undefined){
            id = event.target.dataset.id
        }else{
            id = event.target.parentNode.dataset.id
        }

        this.props.userStore.deleteChildren(
            id,
            () => {
                this.loadPage()
                window.location.reload()
            }, response => {

                if (Array.isArray(response.data)) {
                    response.data.forEach(error => {
                        NotificationManager.error(error.message)
                        this.setState({ preloader: false })
                    })
                } else {
                    NotificationManager.error(response.data.message)
                    this.setState({ preloader: false })
                }
                if (response.status == 401){
                    this.setState({ preloader: false })
                    this.props.history.push('/')
                }
            }
        )
    }

    render() {
        return (
            <div className="plate-wrapper plate-wrapper__height">
                {
                    this.state.preloader &&
                    <Preloader/>
                }

                <NotificationContainer/>

                <div style={{ marginBottom: 16 }}>
                    <Link style={{ color: '#0052A4' }} to={'/cabinet'}>Личный кабинет</Link>
                    <span> -> </span>
                    <Link style={{ color: '#0052A4' }} to={'/cabinet/edit'}>Редактирование личных данных</Link>
                    <span> -> </span>
                    <Link style={{ color: '#0052A4', borderBottom: '1px solid #0052A4' }}>Дети</Link>
                </div>

                <div className='edit-profile'>
                    <div className="main">
                        <form className='upload-image form' onSubmit={this.updateProfile}>

                            {
                                this.props.userStore.childrens.map((children, index) => {
                                    return <div style={{ border: "1px solid #E4E8F0", borderRadius: 8, marginBottom: 16, position: "relative" }}>

                                        {
                                            !children.is_new &&
                                            <div data-id={children.resource_id} style={{ position: "absolute", right: 0, top: 0, cursor: "pointer", display: "flex", alignItems: "center" }}>
                                                {/*<Link to={'/cabinet/children/' + children.resource_id} style={{ marginRight: 10, color: "#000000" }}>{this.props.userStore.languageList["Редактировать"] || 'Редактировать'}</Link>*/}
                                                <DeleteIcon data-id={children.resource_id} onClick={this.deleteChildren}/>
                                            </div>
                                        }

                                        <div className="field second_name">
                                            <label>{this.props.userStore.languageList["Пол"] || 'Пол'}*</label>
                                            <select style={{ width: '100%', border: '1px solid #E4E8F0', padding: '10px', borderRadius: '5px', fontSize: '16px', color: '#cfd2dc' }}
                                                    name="industry"
                                                    onChange={(e) => { this.sexChange(e, index) }}
                                                    defaultValue={children.sex == null && 'null' || children.sex && 1 || !children.sex && 0}
                                                    required
                                            >
                                                <option value=''>{this.props.userStore.languageList["Выберите пол"] || 'Выберите пол'}</option>
                                                <option value='0'>{this.props.userStore.languageList["Женский"] || 'Женский'}</option>
                                                <option value='1'>{this.props.userStore.languageList["Мужской"] || 'Мужской'}</option>
                                            </select>
                                        </div>

                                        <div className="field first_name">
                                            <label>{this.props.userStore.languageList["Имя"] || 'Имя'}*</label>
                                            <input type="text"
                                                   defaultValue={children.first_name}
                                                   style={{ background: "transparent" }}
                                                   onChange={(event) => this.nameInputChange(event, index)}
                                                   placeholder={this.props.userStore.languageList["Заполните поле"] || 'Заполните поле'}
                                                   required
                                                   name='first_name'/>
                                        </div>
                                        <div className="field last_name">
                                            <label>{this.props.userStore.languageList["Фамилия"] || 'Фамилия'}*</label>
                                            <input type="text"
                                                   defaultValue={children.family_name}
                                                   style={{ background: "transparent" }}
                                                   onChange={(event) => this.familyInputChange(event, index)}
                                                   placeholder={this.props.userStore.languageList["Заполните поле"] || 'Заполните поле'}
                                                   required
                                                   name='last_name'/>
                                        </div>
                                        <div className="field">
                                            <label>{this.props.userStore.languageList["Отчество"] || 'Отчество'}</label>
                                            <input type="text"
                                                   defaultValue={children.patronymic}
                                                   style={{ background: "transparent" }}
                                                   onChange={(event) => this.patronymicInputChange(event, index)}
                                                   placeholder={this.props.userStore.languageList["Заполните поле"] || 'Заполните поле'}
                                                   name='middle_name'/>
                                        </div>
                                        <div className="field">
                                            <label>
                                                {this.props.userStore.languageList["Дата рождения"] || 'Дата рождения'}
                                                { children.is_new && ' (дд-мм-гггг) ' }
                                                *
                                            </label>
                                            {/*<input type="date" id="start" name="trip-start"*/}
                                            {/*       value={dateFormat(children.birth_date, "yyyy-mm-dd") || ''}*/}
                                            {/*       required*/}
                                            {/*       onChange={(event) => this.birthdayInputChange(event, index)}*/}
                                            {/*       min="1970-01-01"*/}
                                            {/*       max="2020-12-31"/>*/}
                                            <InputMask
                                                mask="99-99-9999"
                                                defaultValue={!children.is_new && format(new Date(children.birth_date), 'dd-MM-yyyy')}
                                                style={{ background: "transparent" }}
                                                required
                                                onChange={(event) => this.birthdayInputChange(event, index)}
                                            />
                                            {/*<InputMask*/}
                                            {/*    mask="99-99-9999"*/}
                                            {/*    value={!children.is_new ? dateFormat(children.birth_date, "dd-mm-yyyy") : ''}*/}
                                            {/*    onChange={(event) => this.birthdayInputChange(event, index)}*/}
                                            {/*/>*/}
                                        </div>
                                        <div className="field second_name">
                                            <label>{this.props.userStore.languageList["ИИН"] || 'ИИН'}*</label>
                                            <input type="number"
                                                   required
                                                   value={children.personal_code}
                                                   style={{ background: "transparent" }}
                                                   onChange={(event) => this.iinInputChange(event, index)}
                                                   placeholder={this.props.userStore.languageList["Заполните поле"] || 'Заполните поле'}
                                                   name='middle_name'/>
                                        </div>
                                    </div>
                                })
                            }

                            <p style={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={ () => this.props.userStore.addChildren() } ><AddIcon style={{ marginRight: 8 }} /> Добавить еще</p>

                            <div className="btns">
                                <button type="submit">{this.props.userStore.languageList["Сохранить"] || 'Сохранить'}</button>
                                <button onClick={() => { this.props.history.push('/cabinet') }}>{this.props.userStore.languageList["Отменить"] || 'Отменить'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default inject('userStore', 'permissionsStore')(observer(Children));