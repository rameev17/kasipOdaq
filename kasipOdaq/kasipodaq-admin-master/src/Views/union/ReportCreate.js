import React, {Component} from 'react';
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css';

import {ReactComponent as RemoveIcon} from '../../assets/icons/delete.svg'
import {ReactComponent as CameraIcon} from '../../assets/icons/camera.svg'
import {inject, observer} from "mobx-react";
import Preloader from "../../fragments/preloader/Preloader";
import {NotificationContainer, NotificationManager} from "react-notifications";

const queryString = require("query-string");

class ReportCreate extends Component {

    constructor(props) {
        super(props);

        this.state = {
            preloader: false,
            fullName: 0,
            parents: 0,
            personalCode: 0,
            sex: 0,
            birthDate: 0,
            membersCount: 0,
            fields: []
        };

        this.fullNameRef = React.createRef();
        this.parentsRef = React.createRef();
        this.personalCodeRef = React.createRef();
        this.sexRef = React.createRef();
        this.birthDateRef = React.createRef();
        this.membersCountRef = React.createRef();

        this.createReport = this.createReport.bind(this);
        this.handleFullNameCheck = this.handleFullNameCheck.bind(this);
        this.handleParentsCheck = this.handleParentsCheck.bind(this);
        this.handlePersonalCodeCheck = this.handlePersonalCodeCheck.bind(this);
        this.handleSexCheck = this.handleSexCheck.bind(this);
        this.handleBirthDateCheck = this.handleBirthDateCheck.bind(this);
        this.handleMembersCountCheck = this.handleMembersCountCheck.bind(this);
    }

    componentDidMount() {
        this.loadPage()
    }

    loadPage(){
        this.props.unionStore.getReportList(
            queryString.parse(this.props.location.search).union_id,
            (data) => {
                data.map(report => {
                    if (report.type?.resource_id == this.props.match.params.id){
                        this.props.unionStore.report = report;

                        report.fields.map(field => {
                            switch(field.key) {
                                case('full_name'):
                                    this.setState({
                                        fullName: 1
                                    },() => this.state.fields.push('full_name'));
                                    break;
                                case('parents'):
                                    this.setState({
                                        parents: 1
                                    },() => this.state.fields.push('parents'));
                                    break;
                                case('personal_code'):
                                    this.setState({
                                        personalCode: 1
                                    }, () => this.state.fields.push('personal_code'));
                                    break;
                                case('sex'):
                                    this.setState({
                                        sex: 1
                                    }, () => this.state.fields.push('sex'));
                                    break;
                                case('birth_date'):
                                    this.setState({
                                        birthDate: 1
                                    }, () => this.state.fields.push('birth_date'));
                                    break;
                                case('members_count'):
                                    this.setState({
                                        membersCount: 1
                                    }, () => this.state.fields.push('members_count'));
                                    break;
                                default:
                            }
                        })
                    }
                });
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
            if (response.status == 401){
                this.setState({ preloader: false });
                this.props.history.push('/')
            }
        })
    }

    handleFullNameCheck(){
        this.setState({
            fullName: !this.state.fullName
        }, () => {
            if (this.state.fullName){
                this.state.fields.push('full_name')
            }else if (!this.state.fullName){
                let array = this.state.fields;
                let newArray = array.filter(function(item) {
                    return item !== 'full_name'
                });
                this.setState({ fields: newArray })
            }
        })
    }

    handleParentsCheck(){
        this.setState({
            parents: !this.state.parents
        }, () => {
            if (this.state.parents){
                this.state.fields.push('parents')
            }else{
                let array = this.state.fields;
                let newArray = array.filter(function(item) {
                    return item !== 'parents'
                });
                this.setState({ fields: newArray })
            }
        })
    }

    handlePersonalCodeCheck(){
        this.setState({
            personalCode: !this.state.personalCode
        }, () => {
            if (this.state.personalCode){
                this.state.fields.push('personal_code');
                console.log(this.state.fields)
            }else{
                let array = this.state.fields;
                let newArray = array.filter(function(item) {
                    return item !== 'personal_code'
                });
                this.setState({ fields: newArray })
            }
        })
    }

    handleSexCheck(){
        this.setState({
            sex: !this.state.sex
        }, () => {
            if (this.state.sex){
                this.state.fields.push('sex')
            }else{
                let array = this.state.fields;
                let newArray = array.filter(function(item) {
                    return item !== 'sex'
                });
                this.setState({ fields: newArray })
            }
        })
    }

    handleBirthDateCheck(){
        this.setState({
            birthDate: !this.state.birthDate
        }, () => {
            if (this.state.birthDate){
                this.state.fields.push('birth_date')
            }else{
                let array = this.state.fields;
                let newArray = array.filter(function(item) {
                    return item !== 'birth_date'
                });
                this.setState({ fields: newArray }, () => console.log(this.state.fields))
            }
        })
    }

    handleMembersCountCheck(){
        this.setState({
            membersCount: !this.state.membersCount
        }, () => {
            if (this.state.membersCount){
                this.state.fields.push('members_count')
            }else{
                let array = this.state.fields;
                let newArray = array.filter(function(item) {
                    return item !== 'members_count'
                });
                this.setState({ fields: newArray }, () => console.log(this.state.fields))
            }
        })
    }

    createReport(report){
        let array = this.state.fields;
        let uniqueArray = array.filter(function(item, pos) {
            return array.indexOf(item) == pos;
        });
        this.setState({ fields: uniqueArray });
        let string = this.state.fields.toString();

        this.setState({ preloader: true });

        if (!report.file?.uri){
            this.props.unionStore.reportForm(
                report.type?.resource_id,
                queryString.parse(this.props.location.search).union_id,
                string,
                () => {
                    this.setState({ preloader: false });
                    NotificationManager.success('Отчет успешно сформирован!');
                    this.props.history.push(`/union/reports?union_id=${queryString.parse(this.props.location.search).union_id}`)
                },response => {
                    if (Array.isArray(response.data)) {
                        response.data.forEach(error => {
                            this.setState({ preloader: false });
                            NotificationManager.error(error.message)
                        })
                    } else {
                        this.setState({ preloader: false });
                        NotificationManager.error(response.data.message)
                    }
                    if (response.status == 401){
                        this.setState({ preloader: false });
                        this.props.history.push('/')
                    }
                }
            )
        }else{
            this.props.unionStore.reportReform(
                report.resource_id,
                string,
                () => {
                    this.setState({ preloader: false });
                    NotificationManager.success('Отчет успешно переформирован!');
                    this.props.history.push(`/union/reports?union_id=${queryString.parse(this.props.location.search).union_id}`)
                },response => {
                    if (Array.isArray(response.data)) {
                        response.data.forEach(error => {
                            this.setState({ preloader: false });
                            NotificationManager.error(error.message)
                        })
                    } else {
                        this.setState({ preloader: false });
                        NotificationManager.error(response.data.message)
                    }
                    if (response.status == 401){
                        this.setState({ preloader: false });
                        this.props.history.push('/')
                    }
                }
            )
        }
    }

    render() {
        return (
            <div className='article-edit content'>
                {
                    this.state.preloader &&
                    <Preloader/>
                }

                <NotificationContainer/>

                <h1 className="title">
                    <span>{this.props.userStore.languageList["Создать отчёт"] || 'Создать отчёт'}</span>
                </h1>
                <div className={''}>
                    <div className="toggle-lang">
                        {/*<div className="lang ru" onClick={() => { this.setState({ lang: 'ru' }) }}>Информация на русском языке</div>*/}
                        {/*<div className="lang kz" onClick={() => { this.setState({ lang: 'kz' }) }}>Информация на казахском языке</div>*/}
                    </div>
                    <div className="container top">
                        <div className="data">
                            <label>
                                <span>{this.props.userStore.languageList["Название отчёта"] || 'Название отчёта'}</span>
                                <input type="text" name='title'
                                       value={this.props.unionStore.report?.name}
                                       placeholder={this.props.userStore.languageList["Наименование"] || 'Наименование'}
                                />
                            </label>
                            <label>
                                    <span>{this.props.userStore.languageList["Отметьте пункты, которые хотите сформировать в отчёте"]
                                    || 'Отметьте пункты, которые хотите сформировать в отчёте'}</span>
                            </label>
                            {
                                this.props.unionStore.report.fields?.map(field => {
                                     switch(field?.key){
                                         case('full_name'):
                                             return <div className='checkbox'>
                                                 <input type="checkbox"
                                                        checked={this.state.fullName}
                                                        onClick={this.handleFullNameCheck}
                                                        name='full_name'
                                                        id='full_name'
                                                        ref={this.fullNameRef}
                                                 />
                                                 <label htmlFor="full_name">
                                                     <div>{this.props.userStore.languageList[field.name] || field.name}</div>
                                                 </label>
                                             </div>;
                                         break;
                                         case('parents'):
                                             return <div className='checkbox'>
                                                 <input type="checkbox"
                                                        checked={this.state.parents}
                                                        onClick={this.handleParentsCheck}
                                                        name='parents'
                                                        id='parents'
                                                        ref={this.parentsRef}
                                                 />
                                                 <label htmlFor="parents">
                                                     <div>{this.props.userStore.languageList[field.name] || field.name}</div>
                                                 </label>
                                             </div>;
                                         case('personal_code'):
                                             return <div className='checkbox'>
                                                 <input type="checkbox"
                                                        checked={this.state.personalCode}
                                                        onClick={this.handlePersonalCodeCheck}
                                                        name='personal_code'
                                                        id='personal_code'
                                                        ref={this.personalCodeRef}
                                                 />
                                                 <label htmlFor="personal_code">
                                                     <div>{this.props.userStore.languageList[field.name] || field.name}</div>
                                                 </label>
                                             </div>;
                                         case('sex'):
                                             return <div className='checkbox'>
                                                 <input type="checkbox"
                                                        checked={this.state.sex}
                                                        onClick={this.handleSexCheck}
                                                        name='sex'
                                                        id='sex'
                                                        ref={this.sexRef}
                                                 />
                                                 <label htmlFor="sex">
                                                     <div>{this.props.userStore.languageList[field.name] || field.name}</div>
                                                 </label>
                                             </div>;
                                         case('birth_date'):
                                             return <div className='checkbox'>
                                                 <input type="checkbox"
                                                        checked={this.state.birthDate}
                                                        onClick={this.handleBirthDateCheck}
                                                        name='birth_date'
                                                        id='birth_date'
                                                        ref={this.birthDateRef}
                                                 />
                                                 <label htmlFor="birth_date">
                                                     <div>{this.props.userStore.languageList[field.name] || field.name}</div>
                                                 </label>
                                             </div>;
                                         case('members_count'):
                                             return <div className='checkbox'>
                                                 <input type="checkbox"
                                                        checked={this.state.membersCount}
                                                        onClick={this.handleMembersCountCheck}
                                                        name='members_count'
                                                        id='members_count'
                                                        ref={this.membersCountRef}
                                                 />
                                                 <label htmlFor="members_count">
                                                     <div>{this.props.userStore.languageList[field.name] || field.name}</div>
                                                 </label>
                                             </div>;
                                         default:
                                             break;
                                    }
                                })
                            }

                        </div>
                    </div>

                    <div className="btns">
                        <button className="cancel" onClick={() => { this.props.history.goBack() }}>{this.props.userStore.languageList["Отменить"] || 'Отменить'}</button>
                        <button className="save" onClick={() => this.createReport(this.props.unionStore.report)}>{this.props.userStore.languageList["Создать отчёт"] || 'Создать отчёт'}</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default inject('unionStore', 'userStore', 'permissionsStore')(observer(ReportCreate));