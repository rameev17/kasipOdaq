import React, {Component} from 'react';
import Calendar from 'react-calendar'
import { format } from 'date-fns'

import { Link } from "react-router-dom";

import {ReactComponent as AddIcon} from '../../assets/icons/add.svg'

import {ReactComponent as CameraIcon} from '../../assets/icons/camera.svg'
import {ReactComponent as RemoveIcon} from "../../assets/icons/remove.svg";
import {withRouter} from "react-router-dom";
import {inject, observer} from "mobx-react";
import Preloader from "../../fragments/preloader/Preloader";
import {NotificationContainer, NotificationManager} from "react-notifications";
import InputMask from "react-input-mask"

class ChildrenMember extends Component {

    constructor(props) {
        super(props);

        this.state = {
            preloader: true,
            sex: null,
            birthday: null,
        }

        this.firstNameRef = React.createRef()
        this.familyNameRef = React.createRef()
        this.patronymicRef = React.createRef()
        this.birthdayRef = React.createRef()
        this.iinRef = React.createRef()

        this.updateChild = this.updateChild.bind(this)
    }

    componentDidMount() {
        this.loadPage()
    }

    componentWillMount() {
        this.loadPage()
    }

    loadPage(){
        this.props.unionStore.child = {}
        this.setState({ preloader: true })
        this.props.unionStore.childrenInfoById(
            this.props.match.params.id,
            data => {
                this.setState({ preloader: false })
                this.setState({
                    sex: data.sex,
                    birthday: format(new Date(data.birth_date), "dd-MM-yyyy")
                })
                this.props.unionStore.child = data
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

    updateChild(event){
        event.preventDefault()
        const birthday = this.state.birthday.split('-')

        if (birthday[1] > 12){
            NotificationManager.error('Введите корректный месяц в поле "День рождения"')
        }else if (birthday[0] > 31 || birthday[0] == '00'){
            NotificationManager.error('Введите корректное число в поле "День рождения"')
        }else if (this.iinRef.current.value.length !== 12){
            NotificationManager.error("ИИН должен состоять из 12 цифр")
        }else{
            this.props.unionStore.childrenUpdate(
                this.props.match.params.id,
                this.firstNameRef.current.value,
                this.familyNameRef.current.value,
                this.patronymicRef.current.value,
                this.state.sex,
                new Date(Date.UTC(birthday[2], birthday[1] - 1, birthday[0])).toISOString(),
                this.iinRef.current.value,
                () => {
                    this.setState({ preloader: false })
                    NotificationManager.success("Успешно сохранено!")
                    this.props.history.push(`/union/ppo/undefined/members/${this.props.unionStore.memberId}`)
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
        }
    }

    render() {

        return (
            <div className="profile">
                {
                    this.state.preloader &&
                    <Preloader/>
                }

                <NotificationContainer/>

                <div className="toggle-lang">
                    {/*<div className="lang ru">Информация на русском языке</div>*/}
                    {/*<div className="lang kz">Информация на казахском языке</div>*/}
                </div>
                <form onSubmit={this.updateChild}>
                    <div className="person__wrapper">
                        <div className="add__person data">
                            <p className='subtitle'>
                                {this.props.userStore.languageList["Дети"] || 'Дети'}
                            </p>
                            <div className="container top" style={{
                                border: "1px solid #E4E8F0",
                                borderRadius: 8,
                                marginBottom: 16,
                                padding: 14,
                                position: "relative",
                            }} >
                                <div className="col-left">

                                    <div className='label__wrapper'>
                                        <label>
                                            <span>{this.props.userStore.languageList["Имя"] || 'Имя'}</span>
                                            <input type="text"
                                                   ref={this.firstNameRef}
                                                   value={this.props.unionStore.child.first_name}
                                                   onChange={() => this.props.unionStore.child.first_name = this.firstNameRef.current.value}
                                                   required
                                                   name='firstName'
                                                   placeholder={this.props.userStore.languageList["Имя"] || 'Имя'}
                                            />
                                        </label>
                                        <label>
                                            <span>{this.props.userStore.languageList["Фамилия"] || 'Фамилия'}</span>
                                            <input type="text"
                                                   ref={this.familyNameRef}
                                                   value={this.props.unionStore.child.family_name}
                                                   onChange={() => this.props.unionStore.child.family_name = this.familyNameRef.current.value}
                                                   required
                                                   name='familyName'
                                                   placeholder={this.props.userStore.languageList["Фамилия"] || 'Фамилия'}
                                            />
                                        </label>
                                        <label>
                                            <span>{this.props.userStore.languageList["Отчество"] || 'Отчество'}</span>
                                            <input type="text"
                                                   ref={this.patronymicRef}
                                                   value={this.props.unionStore.child.patronymic || ''}
                                                   onChange={() => this.props.unionStore.child.patronymic = this.patronymicRef.current.value}
                                                   name='patronymic'
                                                   placeholder={this.props.userStore.languageList["Отчество"] || 'Отчество'}
                                            />
                                        </label>
                                    </div>
                                </div>
                                <div className="col-right">
                                    <label>
                                        <span>{this.props.userStore.languageList["Дата рождения"] || 'Дата рождения'}</span>
                                        <InputMask
                                            mask="99-99-9999"
                                            ref={this.birthdayRef}
                                            placeholder="дд-мм-гггг"
                                            value={this.state.birthday}
                                            onChange={() =>
                                                this.setState({
                                                    birthday: this.birthdayRef.current.value
                                                })
                                            }
                                            required
                                        />
                                    </label>
                                    <label>
                                        <span>{this.props.userStore.languageList["ИИН"] || 'ИИН'}</span>
                                        <input type="number"
                                               ref={this.iinRef}
                                               value={this.props.unionStore.child.personal_code}
                                               onChange={() => this.props.unionStore.child.personal_code = this.iinRef.current.value}
                                               name='iin'
                                               placeholder={this.props.userStore.languageList["ИИН"] || 'ИИН'}
                                        />
                                    </label>
                                    <div className="gender">
                                        <span>{this.props.userStore.languageList["Пол"] || 'Пол'}</span>
                                        <div className="gender__radios">
                                            <label>
                                                <input type="radio"
                                                       name='gender'
                                                       checked={this.state.sex == 1}
                                                       onChange={() => this.setState({ sex: 1 })}
                                                />
                                                <span className='radio'/>
                                                <div className="text">
                                                    {this.props.userStore.languageList["Мужской"] || 'Мужской'}
                                                </div>
                                            </label>
                                            <label>
                                                <input type="radio"
                                                       name='gender'
                                                       checked={this.state.sex == 0}
                                                       onChange={() => this.setState({ sex: 0 })}
                                                />
                                                <span className='radio'/>
                                                <div className="text">
                                                    {this.props.userStore.languageList["Женский"] || 'Женский'}
                                                </div>
                                            </label>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                        {
                            this.props.userStore.role == 'company' &&
                            <div className="btns">
                                <button className="cancel" onClick={() => this.props.history.goBack()}>{this.props.userStore.languageList["Отменить"] || 'Отменить'}</button>
                                <button className="save" type="submit">{this.props.userStore.languageList["Сохранить"] || 'Сохранить'}</button>
                            </div>
                        }
                    </div>
                </form>
            </div>
        );
    }
}

export default withRouter(inject('unionStore', 'permissionsStore', 'userStore')(observer(ChildrenMember)));