import React, {Component} from "react";
import Preloader from "../../fragments/preloader/Preloader";
import Search from "../../fragments/search";
import {Link} from "react-router-dom";
import TabsLayout from "../Containers/TabsLayout";
import {ReactComponent as TribuneInfoIcon} from "../../assets/icons/tribune-info.svg";
import {inject, observer} from "mobx-react";
import { Doughnut } from 'react-chartjs-2';
import {NotificationContainer, NotificationManager} from "react-notifications";
import dateFormat from "date-fns/format";

class TestStatistics extends Component {

    constructor(props){
        super(props);

        this.state = {
            preloader: false,
            tabs: [
                {name: this.props.userStore.languageList["Содеражние"] || 'Содержание'},
                {name: this.props.userStore.languageList["Статистика"] || 'Статистика'}
            ],
            common: true,
            individual: false,
        };

        this.changeTabCallback = this.changeTabCallback.bind(this)

    }

    componentDidMount() {
        this.setState({preloader: true});

        this.props.tribuneStore.loadTotalTestStatistics(
            this.props.match.params.id,
            data => {
                // this.setState({preloader: false})
            }, response => {
                if (Array.isArray(response.data)) {
                    response.data.forEach(error => {
                        this.setState({preloader: false});
                        NotificationManager.error(error.message)
                    })
                } else {
                    this.setState({preloader: false});
                    NotificationManager.error(response.data.message)
                }
                if (response.status == 401) {
                    this.setState({preloader: false});
                    this.props.history.push('/')
                }
            }
        );

        this.props.tribuneStore.loadRevisionMembers(
            this.props.match.params.id,
            data => {
                this.setState({preloader: false})
            }, response => {
                if (Array.isArray(response.data)) {
                    response.data.forEach(error => {
                        this.setState({preloader: false});
                        NotificationManager.error(error.message)
                    })
                } else {
                    this.setState({preloader: false});
                    NotificationManager.error(response.data.message)
                }
                if (response.status == 401) {
                    this.setState({preloader: false});
                    this.props.history.push('/')
                }
            }
        )

        this.props.tribuneStore.loadTestSingle(
            this.props.match.params.id,
            () => {

            }
        )

    }

    changeTabCallback = (tab) => {
        switch (tab) {
            case '1':
                this.props.history.push({
                    pathname:`/tribune/` + this.props.match.params.id,
                    state: { tabId: 1 }
                });
                break;
            case '2':
                this.props.history.push({
                    pathname: `/tribune/` + this.props.match.params.id + `/statistics`,
                    state: { tabId: 2,
                        title: this.state.title}
                });
                break;
            default:
                this.props.history.push({
                    pathname:`/tribune/` + this.props.match.params.id,
                    state: { tabId: 1 }
                });
        }
    };

    render() {

        const {total_union_members, total_finished, total_complete, total_not_passed, not_finished, testName, start_date, finish_date, resource_id} = this.props.tribuneStore.totalTestStatistic;

        return (
            <div className='discussion-direction content'>

                {
                    this.state.preloader &&
                    <Preloader/>
                }

                <NotificationContainer/>

                <div className="title-wrapper">
                    <h1 className="title">{this.props.userStore.languageList["Трибуна"] || 'Трибуна'}</h1>
                </div>

                <div className={'panel'}>

                    <div style={{ marginBottom: 16, marginTop: 16 }}>
                        <Link style={{ color: '#0052A4' }} to={`/tribune`}>Все тесты</Link>
                        <span> -> </span>
                        <Link style={{ color: '#0052A4' }} to={`/tribune/${this.props.match.params.id}`}>{ testName }</Link>
                        <span> -> </span>
                        <Link style={{ color: '#0052A4' }}>Статистика</Link>
                    </div>

                    <TabsLayout tabs={this.state.tabs}
                                changeTabCallback={this.changeTabCallback}>

                        <div className={'legal-block'}>
                            <div className="toggle-lang">
                                <div className={('lang ru ') + (this.state.common ? 'active-tab' : '') } onClick={() => { this.setState({ common: true, individual: false }) }}>{this.props.userStore.languageList["Общая"] || 'Общая'}</div>
                                <div className={('lang kz ') + (this.state.individual ? 'active-tab' : '') } onClick={() => { this.setState({ individual: true, common: false }) }}>{this.props.userStore.languageList["Индивидуальная"] || 'Индивидуальная'}</div>
                            </div>
                        </div>

                        {
                            this.state.common &&
                                <div className={'test-flex-block'} style={{ padding: '24px', border: '1px solid #00AEEF' }}>
                                    <div className={'test-flex-left'}>
                                        <label htmlFor="">
                                            <span>{this.props.userStore.languageList["Тема"] || 'Тема'}</span>
                                            <input type="text" placeholder={'Введите тему'} className={'subject-input statistic-input'} value={testName}/>
                                        </label>

                                        <div className={'statistic-div-flex'}>
                                            <div className={'statistic-div-flex-left'}>
                                                <div className={'statistic-div-input'}>
                                                    <div>
                                                        <label htmlFor="start_date">{this.props.userStore.languageList["Дата начала"] || 'Дата начала'}</label>
                                                        <input type="text"
                                                               name='source'
                                                               id='start_date'
                                                               value={dateFormat(start_date, "dd-MM-yyyy")}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label htmlFor="finish_date">{this.props.userStore.languageList["Дата окончания"] || 'Дата окончания'}</label>
                                                        <input type="text"
                                                               name='source'
                                                               id='finish_date'
                                                               value={dateFormat(finish_date, "dd-MM-yyyy")}
                                                        />
                                                    </div>
                                                </div>

                                                <div className={'statistic-canvas'}>
                                                    <Doughnut
                                                        data={this.props.tribuneStore.getDoughnutTotalTestData()}
                                                        options={{
                                                            legend: {
                                                                display: false
                                                            }
                                                        }}
                                                    />

                                                    <p>
                                                        <div style={{display: "inline-block", height: "15px", width:"15px", backgroundColor: "#002b60", marginRight: "10px"}}/>
                                                        {this.props.userStore.languageList["Прошли тест"] || 'Прошли тест'} {total_complete}
                                                    </p>
                                                    <p>
                                                        <div style={{display: "inline-block", height: "15px", width:"15px", backgroundColor: "#0052a4", marginRight: "10px"}}/>
                                                        {this.props.userStore.languageList["Не прошли тест"] || 'Не прошли тест'} {total_not_passed}
                                                    </p>
                                                    <p>
                                                        <div style={{display: "inline-block", height: "15px", width:"15px", backgroundColor: "#d6d8dc", marginRight: "10px"}}/>
                                                        {this.props.userStore.languageList["Не участвовали в аресте"] || 'Не участвовали в аресте'} {not_finished}
                                                    </p>
                                                </div>

                                            </div>
                                            <div className={'statistic-div-flex-right'}>
                                                <label htmlFor="start_date">{this.props.userStore.languageList["Количество членов профсоюза"] || 'Количество членов профсоюза'}</label>
                                                <input type="text"
                                                       value={total_union_members}
                                                       disabled
                                                />
                                                <label htmlFor="start_date">{this.props.userStore.languageList["Количество участников теста"] || 'Количество участников теста'}</label>
                                                <input type="text"
                                                       value={total_finished}
                                                       disabled
                                                />
                                                <label htmlFor="start_date">{this.props.userStore.languageList["Количество участников прошедших тест"] || 'Количество участников прошедших тест'}</label>
                                                <input type="text"
                                                       value={total_complete}
                                                       disabled
                                                />
                                                <label htmlFor="start_date">{this.props.userStore.languageList["Количество участников не прошедших тест"] || 'Количество участников не прошедших тест'}</label>
                                                <input type="text"
                                                       value={total_not_passed}
                                                       disabled
                                                />
                                                <label htmlFor="start_date">{this.props.userStore.languageList["Количество участников не участвовавших в тесте"] || 'Количество участников не участвовавших в тесте'}</label>
                                                <input type="text"
                                                       value={not_finished}
                                                       disabled
                                                />
                                            </div>
                                        </div>

                                    </div>

                                    {
                                        this.props.tribuneStore.testSingle.decree ?
                                            <div className={'test-flex-right'}>
                                                <Link to={`/tribune/statistics/decree/${this.props.match.params.id}`}>
                                                    {this.props.userStore.languageList["Решение"] || 'Решение'}
                                                </Link>
                                            </div>
                                            :
                                            <div className={'test-flex-right'}>
                                                <Link to={`/tribune/statistics/decree/add/${this.props.match.params.id}`}>
                                                    {this.props.userStore.languageList["Вынести решение"] || 'Вынести решение'}
                                                </Link>
                                            </div>
                                    }

                                </div>
                        }

                        {
                            this.state.individual &&
                                <div className={'individual-statistic-block'}>

                                    <input type="text" value={'Пожарная техника безопасности'}/>

                                    <div className={'individual-filter'}>
                                        <div className={'individual-filter-left'}>
                                            <div>
                                                <label htmlFor="">{this.props.userStore.languageList["Дата начала"] || 'Дата начала'}</label>
                                                <input type="text" value={'16.02.2016'}/>
                                            </div>

                                            <div>
                                                <label htmlFor="">{this.props.userStore.languageList["Дата окончания"] || 'Дата окончания'}</label>
                                                <input type="text" value={'26.02.2016'}/>
                                            </div>
                                        </div>

                                        <div className={'individual-filter-right'}>
                                            <label htmlFor="">{this.props.userStore.languageList["Сортировка"] || 'Сортировка'}:</label>
                                            <select name="" id="">
                                                <option value="1">{this.props.userStore.languageList["Выбрать"] || 'Выбрать'}</option>
                                                <option value="1">{this.props.userStore.languageList["Выбрать"] || 'Выбрать'}</option>
                                                <option value="1">{this.props.userStore.languageList["Выбрать"] || 'Выбрать'}</option>
                                            </select>
                                        </div>

                                    </div>

                                    <Search totalCount={this.state.totalCount}
                                            currentPage={this.state.currentPage}
                                            pageCount={this.state.pageCount}
                                            perPage={this.state.perPage}
                                            pagingCallback={this.loadPage}
                                            searchCallback={this.searchSubject}
                                            showSearchString={false}/>
                                    <table>
                                        <thead className="heading">
                                        <tr>
                                            <td className="subject">{this.props.userStore.languageList["ФИО"] || 'ФИО'}</td>
                                            <td className="subject">{this.props.userStore.languageList["Должность"] || 'Должность'}</td>
                                            <td className="subject"/>

                                        </tr>
                                        </thead>
                                        <tbody className="list">
                                        {
                                            this.props.tribuneStore.revisionMembers.length === 0 ?
                                                (
                                                    <tr>
                                                        <td colSpan={3} className={'text-center'}>
                                                            {this.props.userStore.languageList["Пользователей прошедших тестирование не обнаружено"]
                                                            || 'Пользователей прошедших тестирование не обнаружено'}
                                                        </td>
                                                    </tr>
                                                )
                                                :
                                                (
                                                    this.props.tribuneStore.revisionMembers.map((member) => {
                                                        return (
                                                            <tr className={'shown'}>
                                                                <td className="subject">
                                                                    <div className={'legal-subject'}>
                                                                        <Link to={'#'} className={'legal-link'}>
                                                                            {member.family_name} {member.first_name}
                                                                        </Link>
                                                                    </div>
                                                                </td>

                                                                <td className="subject">
                                                                    <div className={'legal-subject'}>
                                                                        <Link to={'#'} className={'legal-link'}>
                                                                            {member.job_position}
                                                                        </Link>
                                                                    </div>
                                                                </td>

                                                                <td className="edit">
                                                                    <Link  to={`/tribune/statistics/individual/${this.props.match.params.id}/?person_id=${member.resource_id}`} >
                                                                        <div className="btn-action" >
                                                                            <div className="icon">
                                                                                <TribuneInfoIcon />
                                                                            </div>
                                                                        </div>
                                                                    </Link>
                                                                </td>
                                                            </tr>
                                                        )
                                                    })
                                                )
                                        }
                                        </tbody>
                                    </table>
                                </div>
                        }
                    </TabsLayout>
                </div>
            </div>
        );
    }
}

export default inject('tribuneStore', 'userStore', 'permissionsStore')(observer(TestStatistics));
