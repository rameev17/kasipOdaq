import React, {Component} from 'react';
import {connect} from 'react-redux'
import {Link} from "react-router-dom";
import Calendar from 'react-calendar';
import * as dateFns from "date-fns";

import {ReactComponent as RejectIcon} from '../../assets/icons/delete.svg'
import {ReactComponent as CheckMarkIcon} from '../../assets/icons/check-mark.svg'
import {ReactComponent as DownLoadIcon} from "../../assets/icons/download.svg";
import {inject, observer} from "mobx-react";
import {NotificationContainer, NotificationManager} from "react-notifications";
import Preloader from "../../fragments/preloader/Preloader";

class UnionRequest extends Component {
    constructor(props){
        super(props);

        this.state = {
            preloaderUnion: true,
        };

        this.confirmApplication = this.confirmApplication.bind(this);
        this.rejectApplication = this.rejectApplication.bind(this)
    }

    componentDidMount() {
        this.props.unionStore.loadUnionApplication(
            this.props.match.params.id,
            () => {
                this.setState({ preloaderUnion: false })
            },
                response => {
            if (Array.isArray(response.data)) {
                response.data.forEach(error => {
                    this.setState({ preloaderUnion: false });
                    NotificationManager.error(error.message)
                })
            } else {
                this.setState({ preloaderUnion: false });
                NotificationManager.error(response.data.message)
            }
            if (response.status == 401){
                this.setState({ preloaderUnion: false });
                this.props.history.push('/')
            }
        })
    }

    confirmApplication(event){
        this.setState({ preloaderUnion: true });

        let id = event.target.dataset.id;
        this.props.unionStore.confirmApplication(id, () => {
            this.setState({ preloaderUnion: false });
            this.props.history.push('/requests')
        }, response => {
            if (Array.isArray(response.data)) {
                response.data.forEach(error => {
                    this.setState({ preloaderUnion: false });
                    NotificationManager.error(error.message)
                })
            } else {
                this.setState({ preloaderUnion: false });
                NotificationManager.error(response.data.message)
            }
            if (response.status == 401){
                this.setState({ preloaderUnion: false });
                this.props.history.push('/')
            }
        })
    }

    rejectApplication(event){
        this.setState({ preloaderUnion: true });

        let id = event.target.dataset.id;
        this.props.unionStore.rejectApplication(id, () => {
            this.setState({ preloaderUnion: false });
            this.props.history.push('/requests')
        }, response => {
            if (Array.isArray(response.data)) {
                response.data.forEach(error => {
                    this.setState({ preloaderUnion: false });
                    NotificationManager.error(error.message)
                })
            } else {
                this.setState({ preloaderUnion: false });
                NotificationManager.error(response.data.message)
            }
            if (response.status == 401){
                this.setState({ preloaderUnion: false });
                this.props.history.push('/')
            }
        })
    }

    render() {

        return (
            <div className='member'>
                {
                    this.state.preloaderUnion &&
                        <Preloader/>
                }
                <NotificationContainer/>

                <div className="profile personal__wrapper">
                    <div className="add__person data">
                        <p className='subtitle'>
                            {this.props.userStore.languageList['Личные данные'] || 'Личные данные'}
                        </p>
                        <div className="container top">
                            <div className="col-left">
                                <div className="label__wrapper-text">
                                    <label>
                                        <span>{this.props.userStore.languageList['Имя'] || 'Имя'}</span>
                                        <input type="text"
                                               name='firstName'
                                               value={this.props.unionStore.unionApplication.person.first_name}
                                               placeholder={this.props.userStore.languageList['Имя'] || 'Имя'}
                                               disabled/>
                                    </label>
                                    <label>
                                        <span>{this.props.userStore.languageList['Фамилия'] || 'Фаилия'}</span>
                                        <input type="text"
                                               name='lastName'
                                               value={this.props.unionStore.unionApplication.person.family_name}
                                               placeholder={this.props.userStore.languageList['Фамилия'] || 'Фамилия'}
                                               disabled/>
                                    </label>
                                    <label>
                                        <span>{this.props.userStore.languageList['Отчество'] || 'Отчество'}</span>
                                        <input type="text"
                                               name='middleName'
                                               value={this.props.unionStore.unionApplication.person.patronymic}
                                               placeholder={this.props.userStore.languageList['Отчество'] || 'Отчество'}
                                               disabled/>
                                    </label>
                                </div>
                            </div>
                            <div className="col-right">
                                <label>
                                    <span>{this.props.userStore.languageList['Дата рождения'] || 'Дата рождения'}</span>
                                    <input type="text"
                                           value={this.props.unionStore.unionApplication.person.birthday}
                                           disabled />
                                    <span className="calendar" style={{display: this.state.showCalendar ? 'block' : 'none'}}>
                                        {/*<Calendar*/}
                                        {/*    onChange={this.changeDate}*/}
                                        {/*    value={this.state.birthday}*/}
                                        {/*/>*/}
                                    </span>
                                </label>
                                <label>
                                    <span>{this.props.userStore.languageList['ИИН'] || 'ИИН'}</span>
                                    <input type="text"
                                           name='iin'
                                           value={this.props.unionStore.unionApplication.person.individual_number}
                                           placeholder={this.props.userStore.languageList['ИИН'] || 'ИИН'}
                                           disabled />
                                </label>
                                <div className="gender">
                                    <span>{this.props.userStore.languageList['Пол'] || 'Пол'}</span>
                                    <div className="gender__radios">
                                        <label>
                                            <input type="radio" name='gender'
                                                   checked={this.props.unionStore.unionApplication.person.sex == 1}
                                                   value='Мужской'
                                                   disabled />
                                            <span className='radio'/>
                                            <div className="text">
                                                {this.props.userStore.languageList['Мужской'] || 'Мужской'}
                                            </div>
                                        </label>
                                        <label>
                                            <input type="radio" name='gender'
                                                   checked={this.props.unionStore.unionApplication.person.sex == 0}
                                                   value='Женский'
                                                   disabled />
                                            <span className='radio'/>
                                            <div className="text">
                                                {this.props.userStore.languageList['Женский'] || 'Женский'}
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="container bottom">
                            <div className="col-left">
                                <p className='subtitle'>
                                    {this.props.userStore.languageList['Контактные данные'] || 'Контактные данные'}
                                </p>
                                <label>
                                    <span>{this.props.userStore.languageList['Адрес'] || 'Адрес'}</span>
                                    <input type="text"
                                           name='address'
                                           value={this.props.unionStore.unionApplication.person.physical_address}
                                           placeholder='Адрес'
                                           disabled />
                                </label>
                                <label>
                                    <span>{this.props.userStore.languageList['Телефон'] || 'Телефон'}</span>
                                    <input type="text"
                                           name='phone'
                                           value={this.props.unionStore.unionApplication.person.phone}
                                           placeholder='Телефон'
                                           disabled />
                                </label>
                                <label>
                                    <span>E-mail</span>
                                    <input type="email"
                                           name='email'
                                           value={this.state.email}
                                           onChange={this.handleChangeField}
                                           placeholder='E-mail'
                                           disabled />
                                </label>
                            </div>
                            <div className="col-right">
                                <p className='subtitle'>
                                    {this.props.userStore.languageList['Документы'] || 'Документы'}
                                </p>
                                <ul className="documents">

                                    {
                                        this.props.unionStore.unionApplication.status == 0 &&

                                            this.props.unionStore.unionApplication.files.map((file, index) => {
                                                return <li key={index}>
                                                    <a href={file.uri} className="download__link">
                                                        {file.name}
                                                        <div className="icon">
                                                            <DownLoadIcon/>
                                                        </div>
                                                    </a>
                                                </li>
                                            })
                                    }

                                    {
                                      this.props.unionStore.unionApplication.status == 100 &&
                                        <>
                                        <li>
                                            <a href={this.props.unionStore.unionApplication.union.protocol?.uri} className="download__link">
                                                {this.props.unionStore.unionApplication.union.protocol?.name}
                                                <div className="icon">
                                                    <DownLoadIcon/>
                                                </div>
                                            </a>
                                        </li>

                                        <li>
                                            <a href={this.props.unionStore.unionApplication.union.position?.uri} className="download__link">
                                                {this.props.unionStore.unionApplication.union.position?.name}
                                                <div className="icon">
                                                    <DownLoadIcon/>
                                                </div>
                                            </a>
                                        </li>

                                        <li>
                                            <a href={this.props.unionStore.unionApplication.union.statement?.uri} className="download__link">
                                                {this.props.unionStore.unionApplication.union.statement?.name}
                                                <div className="icon">
                                                    <DownLoadIcon/>
                                                </div>
                                            </a>
                                        </li>

                                            {
                                                this.props.unionStore.unionApplication.union.agreement &&
                                                <li>
                                                    <a href={this.props.unionStore.unionApplication.union.agreement?.uri} className="download__link">
                                                        {this.props.unionStore.unionApplication.union.agreement?.name}
                                                        <div className="icon">
                                                            <DownLoadIcon/>
                                                        </div>
                                                    </a>
                                                </li>
                                            }

                                        </>
                                    }

                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="btns">
                        <button className="btn-action cancel">
                            <span className="icon">
                                <RejectIcon/>
                            </span>
                            <span
                                data-id={this.props.unionStore.unionApplication.resource_id}
                                onClick={this.rejectApplication}
                            >{this.props.userStore.languageList['Отклонить'] || 'Отклонить'}</span>
                        </button>
                        <button className="btn-action save">
                            <span className="icon">
                                <CheckMarkIcon/>
                            </span>
                            <span
                                data-id={this.props.unionStore.unionApplication.resource_id}
                                onClick={this.confirmApplication}
                            >{this.props.userStore.languageList['Принять'] || 'Принять'}</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}


export default inject('unionStore', 'userStore', 'permissionsStore')(observer(UnionRequest));
