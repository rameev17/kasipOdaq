import React, {Component} from 'react';
import Calendar from 'react-calendar'
import { format } from 'date-fns'

import { Link } from "react-router-dom";

import {ReactComponent as AddIcon} from '../../assets/icons/add.svg';
import {ReactComponent as DeleteIcon} from '../../assets/icons/delete.svg';

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
        };

        this.createChildren = this.createChildren.bind(this);
        this.nameInputChange = this.nameInputChange.bind(this);
        this.familyInputChange = this.familyInputChange.bind(this);
        this.patronymicInputChange = this.patronymicInputChange.bind(this);
        this.birthdayInputChange = this.birthdayInputChange.bind(this);
        this.iinInputChange = this.iinInputChange.bind(this);
        this.deleteChild = this.deleteChild.bind(this)
    }

    componentDidMount() {
        this.loadPage();
        this.props.unionStore.memberId = this.props.match.params.id
    }

    componentWillMount() {
        this.loadPage()
    }

    loadPage(){
        this.props.unionStore.children = [];
        this.setState({ preloader: true });
        this.props.unionStore.childrenList(
            this.props.match.params.id,
            data => {
                this.props.unionStore.children = data;
                this.setState({ preloader: false })
            }, response => {
                if (Array.isArray(response.data)) {
                    response.data.forEach(error => {
                        this.setState({ preloader: false });
                        NotificationManager.error(error.message)
                    })
                } else {
                    this.setState({ preloader: false });
                    NotificationManager.error(response.data.message)
                }
            })
    }

    nameInputChange(event, index) {
        this.props.unionStore.children[index].first_name = event.target.value
    }

    familyInputChange(event, index) {
        this.props.unionStore.children[index].family_name = event.target.value
    }

    patronymicInputChange(event, index) {
        this.props.unionStore.children[index].patronymic = event.target.value
    }

    birthdayInputChange(event, index) {
        const date = event.target.value.replace('_', '');

        this.props.unionStore.children[index].birth_date = date
    }

    iinInputChange(event, index) {
        this.props.unionStore.children[index].personal_code = event.target.value
    }

    createChildren(event){
        event.preventDefault();

        this.props.unionStore.children.map( async child => {
            return child.is_new ?
                child.personal_code.length !== 12 ?
                    NotificationManager.error("ИИН должен состоять из 12 цифр")
                    :
                    child.birth_date.split('-')[1] > 12 ?
                        NotificationManager.error('Введите корректный месяц в поле "День рождения"')
                        :
                        child.birth_date.split('-')[0] > 31 || child.birth_date.split('-')[0] == '00' ?
                            NotificationManager.error('Введите корректное число в поле "День рождения"')
                            :
                        await this.props.unionStore.childrenCreate(
                        this.props.match.params.id,
                        child.first_name,
                        child.family_name,
                        child.patronymic,
                        child.sex,
                        new Date(Date.UTC(child.birth_date.split('-')[2], child.birth_date.split('-')[1] - 1, child.birth_date.split('-')[0])).toISOString(),
                        child.personal_code,
                        () => {
                        this.setState({ preloader: false });
                        NotificationManager.success("Успешно сохранено!");
                        this.props.history.goBack()
                    }, response => {
                        if (Array.isArray(response.data)) {
                        response.data.forEach(error => {
                        this.setState({ preloader: false });
                        NotificationManager.error(error.message)
                    })
                    } else {
                        this.setState({ preloader: false });
                        NotificationManager.error(response.data.message)
                    }
                    }
                        )
                : this.setState({ preloader: false })
        })
    }

    deleteChild(event){
        let id = event.target.dataset.id;
        if (id !== undefined){
            id = event.target.dataset.id
        }else{
            id = event.target.parentNode.dataset.id
        }

        this.setState({ preloader: true });

        this.props.unionStore.deleteChild(
            id,
            () => {
                this.loadPage();
                NotificationManager.success("Вы успешно удалили ребенка")
            }, response => {

                if (Array.isArray(response.data)) {
                    response.data.forEach(error => {
                        NotificationManager.error(error.message);
                        this.setState({ preloader: false })
                    })
                } else {
                    NotificationManager.error(response.data.message);
                    this.setState({ preloader: false })
                }
                if (response.status == 401){
                    this.setState({ preloader: false });
                    this.props.history.push('/')
                }
            }
        )
    }

    render() {

        return (
            <div className="profile">
                {
                    this.state.preloader &&
                    <Preloader/>
                }

                <NotificationContainer/>

                <div style={{ marginTop: 16, marginBottom: 16 }}>
                    <Link style={{color: '#0052A4'}} onClick={() => this.props.history.goBack()}>{this.props.userStore.languageList['Вернуться назад'] || 'Вернуться назад'}</Link>
                </div>

                <div className="toggle-lang">
                    {/*<div className="lang ru">Информация на русском языке</div>*/}
                    {/*<div className="lang kz">Информация на казахском языке</div>*/}
                </div>
                <form onSubmit={this.createChildren}>
                    <div className="person__wrapper">
                        <div className="add__person data">
                            <p className='subtitle'>
                                {this.props.userStore.languageList["Дети"] || 'Дети'}
                            </p>
                            {
                                this.props.unionStore.children.map((child, index) => {
                                    return <div className="container top" style={{
                                        border: "1px solid #E4E8F0",
                                        borderRadius: 8,
                                        marginBottom: 16,
                                        padding: 24,
                                        position: "relative",
                                    }} >

                                        {
                                            !child.is_new &&
                                                this.props.userStore.role == 'company' &&
                                            <div data-id={child.resource_id} style={{ position: "absolute", right: 0, top: 0, cursor: "pointer", display: "flex", alignItems: "center", padding: 10 }}>
                                                <Link to={`/union/member/children/edit/${child.resource_id}`} style={{ marginRight: 10, color: "#000000" }}>{this.props.userStore.languageList["Редактировать"] || 'Редактировать'}</Link>

                                                <DeleteIcon data-id={child.resource_id} onClick={this.deleteChild}/>
                                            </div>
                                        }

                                        <div className="col-left">

                                            <div className='label__wrapper'>
                                                <label>
                                                    <span>{this.props.userStore.languageList["Имя"] || 'Имя'}</span>
                                                    <input type="text"
                                                           value={child.first_name}
                                                           onChange={(event) => this.nameInputChange(event, index)}
                                                           required
                                                           disabled={!child.is_new}
                                                           name='firstName'
                                                           placeholder={this.props.userStore.languageList["Имя"] || 'Имя'}
                                                    />
                                                </label>
                                                <label>
                                                    <span>{this.props.userStore.languageList["Фамилия"] || 'Фамилия'}</span>
                                                    <input type="text"
                                                           value={child.family_name}
                                                           onChange={(event) => this.familyInputChange(event, index)}
                                                           required
                                                           disabled={!child.is_new}
                                                           name='familyName'
                                                           placeholder={this.props.userStore.languageList["Фамилия"] || 'Фамилия'}
                                                    />
                                                </label>
                                                <label>
                                                    <span>{this.props.userStore.languageList["Отчество"] || 'Отчество'}</span>
                                                    <input type="text"
                                                           value={child.patronymic}
                                                           onChange={(event) => this.patronymicInputChange(event, index)}
                                                           disabled={!child.is_new}
                                                           name='patronymic'
                                                           placeholder={this.props.userStore.languageList["Отчество"] || 'Отчество'}
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-right">
                                            <label>
                                                <span>
                                                    {this.props.userStore.languageList["Дата рождения"] || 'Дата рождения'}
                                                    {child.is_new && '(дд-мм-гггг)'}
                                                </span>
                                                <InputMask
                                                    mask="99-99-9999"
                                                    disabled={!child.is_new}
                                                    placeholder="дд-мм-гггг"
                                                    defaultValue={format(new Date(child.birth_date), "dd-MM-yyyy")}
                                                    onChange={(event) => this.birthdayInputChange(event, index)}
                                                    required
                                                />
                                            </label>
                                            <label>
                                                <span>{this.props.userStore.languageList["ИИН"] || 'ИИН'}</span>
                                                <input type="number"
                                                       disabled={!child.is_new}
                                                       value={child.personal_code}
                                                       onChange={(event) => this.iinInputChange(event, index)}
                                                       name='iin'
                                                       placeholder={this.props.userStore.languageList["ИИН"] || 'ИИН'}
                                                />
                                            </label>
                                            <div className="gender">
                                                <span>{this.props.userStore.languageList["Пол"] || 'Пол'}</span>
                                                <div className="gender__radios">
                                                    <label>
                                                        <input type="radio"
                                                               disabled={!child.is_new}
                                                               checked={child.sex == 1}
                                                               onChange={(e) => { this.props.unionStore.children[index].sex = 1 }}
                                                        />
                                                        <span className='radio'/>
                                                        <div className="text">
                                                            {this.props.userStore.languageList["Мужской"] || 'Мужской'}
                                                        </div>
                                                    </label>
                                                    <label>
                                                        <input type="radio"
                                                               disabled={!child.is_new}
                                                               checked={child.sex == 0}
                                                               onChange={(e) => { this.props.unionStore.children[index].sex = 0 }}
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
                                })
                            }

                            {
                                this.props.userStore.role == 'company' &&
                                <p style={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={() => this.props.unionStore.addChildren() } ><AddIcon style={{ marginRight: 8 }} /> {this.props.userStore.languageList["Добавить еще ребенка"] || 'Добавить еще ребенка'}</p>
                            }

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