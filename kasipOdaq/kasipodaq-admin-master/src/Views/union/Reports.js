import React, {Component} from 'react';
import {Link} from 'react-router-dom'
import Search from "../../fragments/search";
import {ReactComponent as ReportReformIcon} from '../../assets/icons/reports-reform.svg'
import {ReactComponent as ReportFormIcon} from '../../assets/icons/reports-form.svg'
import {ReactComponent as ReportDownload} from '../../assets/icons/reports-download.svg'
import * as dateFns from 'date-fns'
import {inject, observer} from "mobx-react";
import Preloader from "../../fragments/preloader/Preloader";
import {NotificationContainer, NotificationManager} from "react-notifications";

const dateFormat = require('dateformat');
const queryString = require('query-string');

class Reports extends Component {

    constructor(props) {
        super(props);

        this.state = {
            preloader: true,
        };

        this.deleteAppeal = this.deleteAppeal.bind(this);
        this.reportForm = this.reportForm.bind(this);
        this.loadReports = this.loadReports.bind(this)
    }

    componentDidMount() {

        this.props.userStore.profileInfo(() => {
            this.loadReports()

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

    loadReports(){

        const union_id = queryString.parse(this.props.location.search).union_id !== 'undefined' &&
        queryString.parse(this.props.location.search).union_id !== undefined ?
            queryString.parse(this.props.location.search).union_id : this.props.userStore.profile.union.resource_id;

        this.props.unionStore.getReportList(
             union_id,
            () => {
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

    reportForm(report){
        this.setState({ preloader: true });

        if (!report.file.uri){
            this.props.unionStore.reportForm(
                report.type_id,
                report.union.resource_id,
                () => {
                    this.setState({ preloader: false });
                    NotificationManager.success('Отчет успешно сформирован!');
                    this.loadReports()
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
                () => {
                    this.setState({ preloader: false });
                    NotificationManager.success('Отчет успешно переформирован!');
                    this.loadReports()
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

    deleteAppeal(event){
        this.setState({ preloader: true });

        let ev = event.target.dataset.id;

        if (ev == undefined) {
            let id = event.target.parentNode.dataset.id;
            this.deleteFunction(id)
        }else{
            let id = event.target.dataset.id;
            this.deleteFunction(id)
        }
    }

    deleteFunction(id){
        this.props.appealStore.deleteAppeal(id, () => {

            this.props.appealStore.loadAppeals(0,null,this.props.userStore.profile.union.resource_id,() => {
                this.setState({ preloader: false })
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
            })

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
        })
    }

    render() {

        const union_id = queryString.parse(this.props.location.search).union_id !== 'undefined' &&
        queryString.parse(this.props.location.search).union_id !== undefined ?
            queryString.parse(this.props.location.search).union_id : this.props.userStore.profile.union.resource_id;

        return (
            <div className='fprk-requests'>
                {
                    this.state.preloader &&
                    <Preloader/>
                }
                <NotificationContainer/>

                <table>
                    <thead className="heading">
                    <tr>
                        <td className="subject">{this.props.userStore.languageList["Название отчета"] || 'Название отчета'}</td>
                        <td className="full-name">{this.props.userStore.languageList["Дата формирования"] || 'Дата формирования'}</td>
                        <td className="attachment">

                        </td>
                        <td className="attachment">

                        </td>
                    </tr>
                    </thead>
                    <tbody className="requests-list list">
                    {
                        this.props.unionStore.reportList.map((report, index) => {
                            return <tr className='not-answered' key={index}>
                                <td className="subject">{ this.props.userStore.languageList[report.name] || report.name }</td>
                                <td className="date">{ report.date_created ? dateFormat(report.date_created, 'dd.mm.yyyy hh:mm:ss') : ''}</td>
                                <td className="answer report-form">
                                    <Link to={`/union/reports/${report.type?.resource_id}?union_id=${union_id}`}>
                                        {
                                            !report.file?.uri ?
                                                <div className="btn-action">
                                                    <span className="icon">
                                                        <ReportFormIcon/>
                                                    </span>
                                                    <span>{this.props.userStore.languageList["Сформировать"] || 'Сформировать'}</span>
                                                </div>
                                                :
                                                <div className="btn-action">
                                                    <span className="icon">
                                                        <ReportReformIcon/>
                                                    </span>
                                                    <span>{this.props.userStore.languageList["Переформировать"] || 'Переформировать'}</span>
                                                </div>
                                        }
                                    </Link>
                                </td>
                                <td className="answer accept">
                                    <a href={report.file?.uri ? report.file?.uri : '#'} style={{ cursor: report.file?.uri ? 'pointer' : 'not-allowed' }}>
                                        <div className="btn-action">
                                            <span className="icon">
                                                <ReportDownload/>
                                            </span>
                                            <span>{this.props.userStore.languageList["Скачать"] || 'Скачать'}</span>
                                        </div>
                                    </a>
                                </td>
                            </tr>
                        })
                    }

                    </tbody>
                </table>
            </div>
        );
    }
}

export default inject('appealStore', 'unionStore', 'userStore', 'permissionsStore')(observer(Reports));