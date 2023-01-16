import React, {Component} from "react";
import Layout from "../Containers/Layout";
import {Route, Switch} from "react-router";
import Preloader from "../../fragments/preloader/Preloader";
import {NotificationContainer, NotificationManager} from "react-notifications";
import Search from "../../fragments/search";
import {Link} from "react-router-dom";
import {ReactComponent as QuestionIcon} from "../../assets/icons/question-answer-icon.svg";
import {ReactComponent as AnswerAdd} from "../../assets/icons/answer-add.svg";
import {ReactComponent as QuestionInform} from "../../assets/icons/question-inform.svg";
import {inject, observer} from "mobx-react";
import DatePicker from "react-datepicker";
import Modal from "react-modal";
import tribuneStore from "../../stores/TribuneStore";
import qs from "query-string"
import {Doughnut} from "react-chartjs-2";

const dateFormat = require('dateformat');

class TestIndividualStatistic extends Component {

    constructor(props) {
        super(props);

        this.state = {
            preloader: false,
        }

    }

    componentDidMount() {
        this.setState({preloader: true});

        const values = qs.parse(this.props.location.search);
        const person_id = values.person_id;

        this.props.tribuneStore.loadPersonalTestStatistics(
            this.props.match.params.revision_id,
            person_id,
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

        this.props.testStore.loadTest(
            this.props.match.params.revision_id,
            data => {
                this.props.testStore.loadQuestions(
                    data.resource_id,
                    data => {
                        data.forEach(question => {
                            this.props.testStore.loadPersonAnswers(
                                question.resource_id,
                                person_id,
                                () => {
                                    // this.setState({ preloader: false })
                                }, response => {
                                    if (Array.isArray(response.data)) {
                                        response.data.forEach(error => {
                                            NotificationManager.error(error.message);
                                            this.setState({preloader: false})
                                        })
                                    } else {
                                        NotificationManager.error(response.data.message);
                                        this.setState({preloader: false})
                                    }
                                    if (response.status == 401) {
                                        this.setState({preloader: false});
                                        this.props.history.push('/')
                                    }
                                }
                            )
                        });
                    }, response => {
                        if (Array.isArray(response.data)) {
                            response.data.forEach(error => {
                                NotificationManager.error(error.message);
                                this.setState({preloader: false})
                            })
                        } else {
                            NotificationManager.error(response.data.message);
                            this.setState({preloader: false})
                        }
                        if (response.status == 401) {
                            this.setState({preloader: false});
                            this.props.history.push('/')
                        }
                    }
                );

                this.setState({preloader: false})

            }, response => {
                if (Array.isArray(response.data)) {
                    response.data.forEach(error => {
                        NotificationManager.error(error.message);
                        this.setState({preloader: false})
                    })
                } else {
                    NotificationManager.error(response.data.message);
                    this.setState({preloader: false})
                }
                if (response.status == 401) {
                    this.setState({preloader: false});
                    this.props.history.push('/')
                }
            }
        )
    }

    render() {

        const {valid_answers, total_questions} = this.props.tribuneStore.personTestStatistics;
        const wrong_answers = total_questions - valid_answers;

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
                        <Link style={{ color: '#0052A4' }} to={`/tribune/${this.props.testStore.test.resource_id}`}>{ this.props.testStore.test.name }</Link>
                        <span> -> </span>
                        <Link style={{ color: '#0052A4' }} to={`/tribune/${this.props.testStore.test.resource_id}/statistics`}>Общая статистика</Link>
                        <span> -> </span>
                        <Link style={{ color: '#0052A4' }}>Индивидуальная статистика</Link>
                    </div>

                    <div className={'test-flex-block'}>
                        <div className={'test-flex-left'}>
                            <label htmlFor="">
                                <span>{this.props.userStore.languageList["Тема"] || 'Тема'}</span>
                                <input
                                    type="text"
                                    placeholder={this.props.userStore.languageList["Введите тему"] || 'Введите тему'}
                                    className={'subject-input'}
                                    ref={this.titleRef}
                                    value={this.props.testStore.test.name}
                                />
                            </label>

                            {
                                this.props.testStore.questions.map((question, index) => {
                                    return <div className={'test-question'}>
                                        <div className={'question-icon'}>
                                            <QuestionIcon/>
                                            <span>{this.props.userStore.languageList["Вопрос"] || 'Вопрос'}</span>
                                        </div>
                                        <div className={'question-wrapper'}>
                                            <input type="text" value={index + 1} disabled/>
                                            <input
                                                type="text"
                                                placeholder={this.props.userStore.languageList["Введите вопрос"] || 'Введите вопрос'}
                                                value={question.value}
                                            />
                                        </div>

                                        {
                                            this.props.testStore.answers.filter((answer) => {
                                                return answer.question_id === question.resource_id
                                            }).map((answer, index) => {
                                                let className = null;
                                                if (answer.is_right || answer.is_person_answer) {
                                                    className = answer.is_right ? 'right-answer' : 'wrong-answer'
                                                }

                                                return (
                                                    <div className={'test-answer'} key={index}>
                                                        <div className={'answer-icon'}>
                                                            <QuestionIcon/>
                                                            <span>{this.props.userStore.languageList["Ответ"] || 'Ответ'}</span>
                                                        </div>

                                                        <input
                                                            type="text"
                                                            className={className}
                                                            placeholder={this.props.userStore.languageList["Вариант ответа"] || 'Вариант ответа'}
                                                            value={answer.value}
                                                        />
                                                    </div>
                                                )
                                            })
                                        }

                                    </div>
                                })
                            }

                        </div>

                        <div className={'test-flex-right'}>
                            <label htmlFor="start_date">{this.props.userStore.languageList["Дата начала"] || 'Дата начала'}</label>
                            <input type="text"
                                   value={dateFormat(this.props.testStore.test.start_date, "dd.mm.yyyy")}
                            />

                            <label htmlFor="finish_date">{this.props.userStore.languageList["Дата окончания"] || 'Дата окончания'}</label>
                            <input type="text"
                                   value={dateFormat(this.props.testStore.test.finish_date, "dd.mm.yyyy")}
                            />

                            <div className={'input-percent'}>
                                <label>{this.props.userStore.languageList["Соотношение верных ответов"] || 'Соотношение верных ответов'} (%)</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="100"
                                    ref={this.percentRef}
                                    value={Math.round((valid_answers / total_questions) * 100)}
                                />
                            </div>

                            <div className={'statistic-canvas'}>
                                <Doughnut
                                    data={this.props.tribuneStore.getDoughnutPersonalTestData()}
                                    options={{
                                        legend: {
                                            display: false
                                        }
                                    }}
                                />

                                <p>
                                    <div style={{
                                        display: "inline-block",
                                        height: "15px",
                                        width: "15px",
                                        backgroundColor: "#002b60",
                                        marginRight: "10px"
                                    }}/>
                                    {this.props.userStore.languageList["Правильных ответов"] || 'Правильных ответов'} {valid_answers}
                                </p>
                                <p>
                                    <div style={{
                                        display: "inline-block",
                                        height: "15px",
                                        width: "15px",
                                        backgroundColor: "#d6d8dc",
                                        marginRight: "10px"
                                    }}/>
                                    {this.props.userStore.languageList["Не правильных ответов"] || 'Не правильных ответов'} {wrong_answers}
                                </p>
                            </div>

                            {/*<div className='checkbox'>*/}
                            {/*    <input type="checkbox"*/}
                            {/*           name='source'*/}
                            {/*           id='free_answer'*/}
                            {/*    />*/}
                            {/*    <label htmlFor="free_answer">Добавить свободную форму ответа</label>*/}
                            {/*</div>*/}

                        </div>

                    </div>

                </div>

            </div>

        );
    }
}

export default inject('testStore', 'tribuneStore', 'userStore', 'permissionsStore')(observer(TestIndividualStatistic));