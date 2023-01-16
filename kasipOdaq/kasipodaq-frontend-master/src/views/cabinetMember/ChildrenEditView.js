import React, {Component} from 'react'

import {ReactComponent as AddIcon} from '../../assets/icons/add.svg'
import {ReactComponent as DeleteIcon} from '../../assets/icons/delete.svg'

import './style.scss'
import {inject, observer} from "mobx-react";
import Preloader from "../../fragments/preloader/Preloader";
import {NotificationContainer, NotificationManager} from 'react-notifications';
import InputMask from "react-input-mask";
import CookieService from "../../services/CookieService";

import format from 'date-fns/format'
import formatISO from 'date-fns/formatISO'
import parse from 'date-fns/parse'
import toDate from 'date-fns/toDate'

const dateFormat = require('dateformat')

class ChildrenEdit extends Component {
    constructor(props) {
        super(props);

        this.state = {
            preloader: true,
            birthday: null,
        }

        this.firstNameRef = React.createRef()
        this.familyNameRef = React.createRef()
        this.patronymicRef = React.createRef()
        this.sexRef = React.createRef()
        this.birthdateRef = React.createRef()
        this.personalCodeRef = React.createRef()

        this.updateChildren = this.updateChildren.bind(this)
        this.birthdayInputChange = this.birthdayInputChange.bind(this)
    }

    loadPage(){
        this.props.userStore.childrenInfoById(this.props.match.params.id, data => {
            this.setState({ preloader: false })
            this.setState({
                birthday: format(new Date(data.birth_date), "dd-MM-yyyy")
            },() => {
                console.log(this.state.birthday)
            })
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

    birthdayInputChange(event){
        const date = event.target.value

        this.setState({
            birthday: date
        })
    }

    updateChildren(e){
        e.preventDefault()

        let parseDate = parse(this.state.birthday, 'dd-MM-yyyy', new Date())
        console.log(new Date(parseDate).toISOString())

        // if (this.personalCodeRef.current.value.length !== 12){
        //     NotificationManager.error("ИИН должен состоять из 12 цифр")
        // }else{
        //     let date = format(parseISO(new Date(this.state.birthday)), 'dd-MM-yyyy')
        //     this.setState({ preloader: true })
        //     this.props.userStore.childrenUpdate(
        //         this.props.match.params.id,
        //         this.firstNameRef.current.value,
        //         this.familyNameRef.current.value,
        //         this.patronymicRef.current.value,
        //         this.sexRef.current.value,
        //         new Date(date).toISOString(),
        //         this.personalCodeRef.current.value,
        //         () => {
        //             this.setState({ preloader: false })
        //             this.props.history.push('/cabinet')
        //             NotificationManager.success("Успешно сохранено!")
        //         }, response => {
        //             if (Array.isArray(response.data)) {
        //                 response.data.forEach(error => {
        //                     this.setState({ preloader: false })
        //                     NotificationManager.error(error.message)
        //                 })
        //             } else {
        //                 this.setState({ preloader: false })
        //                 NotificationManager.error(response.data.message)
        //             }
        //         }
        //     )
        // }
    }

    render() {
        return (
            <div className="plate-wrapper plate-wrapper__height">
                {
                    this.state.preloader &&
                    <Preloader/>
                }

                <NotificationContainer/>

                <div className='edit-profile'>
                    <div className="main">
                        <form className='upload-image form' onSubmit={this.updateChildren}>

                            <div style={{ border: "1px solid #E4E8F0", borderRadius: 8, marginBottom: 16 }}>

                                <div className="field second_name">
                                    <label>{this.props.userStore.languageList["Пол"] || 'Пол'}*</label>
                                    <select style={{ width: '100%', border: '1px solid #E4E8F0', padding: '10px', borderRadius: '5px', fontSize: '16px', color: '#cfd2dc' }}
                                            name="industry"
                                            ref={this.sexRef}
                                            onChange={(e) => { this.sexRef.current.value = e.target.value }}
                                            defaultValue={ this.props.userStore.children.sex ? 1 : 0 }
                                            required
                                    >
                                        <option value=''>{this.props.userStore.languageList["Выберите пол"] || 'Выберите пол'}</option>
                                        <option value={1}>{this.props.userStore.languageList["Мужской"] || 'Мужской'}</option>
                                        <option value={0}>{this.props.userStore.languageList["Женский"] || 'Женский'}</option>
                                    </select>
                                </div>

                                <div className="field first_name">
                                    <label>{this.props.userStore.languageList["Имя"] || 'Имя'}*</label>
                                    <input type="text"
                                           ref={this.firstNameRef}
                                           defaultValue={this.props.userStore.children.first_name}
                                           onChange={(event) => this.firstNameRef.current.value = event.target.value }
                                           placeholder={this.props.userStore.languageList["Заполните поле"] || 'Заполните поле'}
                                           name='first_name'/>
                                </div>
                                <div className="field last_name">
                                    <label>{this.props.userStore.languageList["Фамилия"] || 'Фамилия'}*</label>
                                    <input type="text"
                                           ref={this.familyNameRef}
                                           defaultValue={this.props.userStore.children.family_name}
                                           onChange={(event) => this.familyNameRef.current.value = event.target.value }
                                           placeholder={this.props.userStore.languageList["Заполните поле"] || 'Заполните поле'}
                                           name='last_name'/>
                                </div>
                                <div className="field">
                                    <label>{this.props.userStore.languageList["Отчество"] || 'Отчество'}*</label>
                                    <input type="text"
                                           ref={this.patronymicRef}
                                           defaultValue={this.props.userStore.children.patronymic}
                                           onChange={(event) => this.patronymicRef.current.value = event.target.value }
                                           placeholder={this.props.userStore.languageList["Заполните поле"] || 'Заполните поле'}
                                           name='middle_name'/>
                                </div>
                                <div className="field">
                                    <label>{this.props.userStore.languageList["Дата рождения"] || 'Дата рождения'}*</label>
                                    {/*<input type="date" id="start" name="trip-start"*/}
                                    {/*       value={dateFormat(this.props.userStore.children.birth_date,"yyyy-mm-dd")}*/}
                                    {/*       required*/}
                                    {/*       onChange={(event) => this.birthdayInputChange(event)}*/}
                                    {/*       min="1970-01-01"*/}
                                    {/*       max="2020-12-31"/>*/}
                                    <InputMask
                                        mask="99-99-9999"
                                        ref={this.birthdateRef}
                                        value={this.state.birthday}
                                        onChange={(event) => this.birthdayInputChange(event)}
                                    />
                                </div>
                                <div className="field second_name">
                                    <label>{this.props.userStore.languageList["ИИН"] || 'ИИН'}*</label>
                                    <input type="number"
                                           ref={this.personalCodeRef}
                                           defaultValue={this.props.userStore.children.personal_code}
                                           onChange={(event) => this.personalCodeRef.current.value = event.target.value }
                                           placeholder={this.props.userStore.languageList["Заполните поле"] || 'Заполните поле'}
                                           name='middle_name'/>
                                </div>
                            </div>

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

export default inject('userStore', 'permissionsStore')(observer(ChildrenEdit));