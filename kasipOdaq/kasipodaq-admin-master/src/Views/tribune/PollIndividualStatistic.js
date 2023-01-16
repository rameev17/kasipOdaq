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
import qs from "query-string";

import format from 'date-fns/format';
import toDate from 'date-fns/toDate';
import dateFormat from "date-fns/format";

class PollIndividualStatistic extends Component {

    constructor(props){
        super(props);

        this.state = {
            preloader: false,
            personId: null
        }

    }

    componentDidMount() {
        this.setState({ preloader: true });

        const values = qs.parse(this.props.location.search);
        const person_id = values.person_id;

        this.setState({
            personId: person_id
        });

        this.props.pollStore.loadPoll(
            this.props.match.params.revision_id,
            data => {
                this.props.pollStore.loadQuestions(
                    data.resource_id,
                    data => {
                        data.forEach(question => {
                            this.props.pollStore.loadCommentForQuestion(
                                question.resource_id,
                                () => {

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

                            this.props.pollStore.loadPersonAnswers(
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
                        <Link style={{ color: '#0052A4' }} to={`/tribune/poll`}>{this.props.userStore.languageList['Все опросы'] || 'Все опросы'}</Link>
                        <span> -> </span>
                        <Link style={{ color: '#0052A4' }} to={`/tribune/poll/${this.props.testStore.test.resource_id}`}>{ this.props.pollStore.poll.name }</Link>
                        <span> -> </span>
                        <Link style={{ color: '#0052A4' }} to={`/tribune/poll/${this.props.testStore.test.resource_id}/statistics`}>{this.props.userStore.languageList['Общая статистика'] || 'Общая статистика'}</Link>
                        <span> -> </span>
                        <Link style={{ color: '#0052A4' }}>{this.props.userStore.languageList['Индивидуальная статистика'] || 'Индивидуальная статистика'}</Link>
                    </div>

                    <div className={'test-flex-block'}>
                        <div className={'test-flex-left'}>
                            <label htmlFor="">
                                <span>{this.props.userStore.languageList["Тема"] || 'Тема'}</span>
                                <input
                                    type="text"
                                    placeholder={this.props.userStore.languageList["Введите тему"] || 'Введите тему'}
                                    className={'subject-input'}
                                    value={this.props.pollStore.poll.name}
                                />
                            </label>

                            {
                                this.props.pollStore.questions.map((poll, index) => {
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
                                                value={poll.value}
                                            />
                                        </div>

                                        {
                                            this.props.pollStore.answers.filter((answer) => {
                                                return answer.question_id === poll.resource_id
                                            }).map((answer, index) => {
                                                const className = answer.is_person_answer ? 'right-answer' : null;

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

                                            {
                                                this.props.pollStore.comments.map(comment => {
                                                    return  comment.author?.resource_id == this.state.personId &&
                                                        <div className={'test-answer'} key={index}>
                                                        <div className={'answer-icon'}>
                                                            <span>{this.props.userStore.languageList["Комментарий"] || 'Комментарий'}</span>
                                                        </div>
                                                        <input
                                                            type="text"
                                                            value={comment.comment}
                                                        />
                                                    </div>
                                                })
                                            }

                                    </div>
                                })
                            }
                        </div>

                        <div className={'test-flex-right'}>
                            <label htmlFor="start_date">{this.props.userStore.languageList["Дата начала"] || 'Дата начала'}</label>
                            {/*<DatePicker*/}
                            {/*    selected={format(toDate(this.props.pollStore.poll.start_date), 'dd-mm-yyyy')}*/}
                            {/*/>*/}
                            <input type="text"
                                   value={dateFormat(this.props.pollStore.poll.start_date, "dd-MM-yyyy")}
                            />

                            <label htmlFor="finish_date">{this.props.userStore.languageList["Дата окончания"] || 'Дата окончания'}</label>
                            {/*<DatePicker*/}
                            {/*    selected={format(toDate(this.props.pollStore.poll.finish_date), 'dd-mm-yyyy')}*/}
                            {/*/>*/}
                            <input type="text"
                                   value={dateFormat(this.props.pollStore.poll.finish_date, "dd-MM-yyyy")}
                            />

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

export default inject('pollStore', 'userStore', 'permissionsStore')(observer(PollIndividualStatistic));