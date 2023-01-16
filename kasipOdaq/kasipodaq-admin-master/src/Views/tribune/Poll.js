import React, {Component} from "react";
import Layout from "../Containers/Layout";
import {Route, Switch} from "react-router";
import Preloader from "../../fragments/preloader/Preloader";
import {NotificationContainer, NotificationManager} from "react-notifications";
import Search from "../../fragments/search";
import {Link} from "react-router-dom";
import {ReactComponent as QuestionContentIcon} from "../../assets/icons/question-content-icon.svg";
import {ReactComponent as AnswerAdd} from "../../assets/icons/answer-add.svg";
import {ReactComponent as QuestionInform} from "../../assets/icons/question-inform.svg";
import TabsLayout from "../Containers/TabsLayout";
import {inject, observer} from "mobx-react";

const dateFormat = require('dateformat');

class Poll extends Component {

    constructor(props){
        super(props)

        this.state = {
            preloader: false,
            tabs: [
                {name: this.props.userStore.languageList["Содержание"] || 'Содеражние'},
                {name: this.props.userStore.languageList["Статистика"] || 'Статистика'}
            ],
        }

        this.changeTabCallback = this.changeTabCallback.bind(this)
        this.filterQuestionAnswers = this.filterQuestionAnswers.bind(this)
    }

    componentDidMount() {
        this.setState({ preloader: true })

        this.props.pollStore.loadPoll(
            this.props.match.params.id,
            data => {
                this.props.pollStore.loadQuestions(
                    data.resource_id,
                    data => {
                        data.forEach(question => {
                            this.props.pollStore.loadAnswers(
                                question.resource_id,
                                () => {
                                    this.setState({ preloader: false })
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
                        })
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

    changeTabCallback = (tab) => {
        switch (tab) {
            case '1':
                this.props.history.push({
                    pathname:`/tribune/poll/` + this.props.match.params.id,
                    state: { tabId: 1 }
                })
                break;
            case '2':
                this.props.history.push({
                    pathname: `/tribune/poll/` + this.props.match.params.id + `/statistics`,
                    state: { tabId: 2,
                        title: this.state.title}
                })
                break;
            default:
                this.props.history.push({
                    pathname:`/tribune/poll/` + this.props.match.params.id,
                    state: { tabId: 1 }
                })
        }
    }

    filterQuestionAnswers(question, questionIndex) {
        const answers = this.props.pollStore.answers.filter((answer) => {
            return (!!question.resource_id && (answer.question_id == question.resource_id))
                || answer.questionIndex == questionIndex
        })

        return answers
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
                    <TabsLayout tabs={this.state.tabs}
                                changeTabCallback={this.changeTabCallback}>
                        <div className={'test-flex-block'}>
                            <div className={'test-flex-left'}>
                                <label htmlFor="">
                                    <span style={{ color: '#BFC5D2' }}>{this.props.userStore.languageList["Тема"] || 'Тема'}</span>
                                    <input type="text"
                                           placeholder={this.props.userStore.languageList["Введите тему"] || 'Введите тему'}
                                           className={'subject-input'}
                                           value={this.props.pollStore.poll.name}
                                           style={{ border: '1px solid #BFC5D2', color: '#BFC5D2' }}
                                    />
                                </label>
                                {
                                    this.props.pollStore.questions.map((question, index) => {
                                        return <div className={'test-question'} key={index} style={{  border: '1px solid #BFC5D2' }}>
                                            <div className={'question-icon'}>
                                                <QuestionContentIcon/>
                                                <span style={{ color: '#BFC5D2' }}>{this.props.userStore.languageList["Вопрос"] || 'Вопрос'}</span>
                                            </div>
                                            <div className={'question-wrapper'}>
                                                <input type="text" value={index + 1} disabled/>
                                                <input type="text"
                                                       placeholder={this.props.userStore.languageList["Введите вопрос"] || 'Введите вопрос'}
                                                       value={question.value}
                                                       style={{ border: '1px solid #BFC5D2', color: '#BFC5D2' }}
                                                />
                                            </div>
                                            {
                                                this.filterQuestionAnswers(question, index).map((answer, answerIndex) => {
                                                    return <div className={'test-answer'} key={index} style={{ border: '1px solid #BFC5D2' }}>
                                                        <div className={'answer-icon'}>
                                                            <QuestionContentIcon/>
                                                            <span style={{ color: '#BFC5D2' }}>{this.props.userStore.languageList["Ответ"] || 'Ответ'}</span>
                                                        </div>

                                                        <input type="text"
                                                               placeholder={this.props.userStore.languageList["Верный ответ"] || 'Верный ответ'}
                                                               value={answer.value}
                                                               style={{ border: '1px solid #BFC5D2', color: '#BFC5D2' }}
                                                        />
                                                    </div>
                                                })
                                            }
                                        </div>
                                    })
                                }
                            </div>

                            <div className={'test-flex-right'}>
                                <label htmlFor="start_date" style={{ color: '#BFC5D2' }}>{this.props.userStore.languageList["Дата начала"] || 'Дата начала'}</label>
                                <input type="text"
                                       name='source'
                                       id='start_date'
                                       value={dateFormat(this.props.pollStore.poll.start_date, "dd/mm/yyyy")}
                                       style={{ border: '1px solid #BFC5D2', color: '#BFC5D2' }}
                                />

                                <label htmlFor="finish_date" style={{ color: '#BFC5D2' }}>{this.props.userStore.languageList["Дата окончания"] || 'Дата окончания'}</label>
                                <input type="text"
                                       name='source'
                                       id='finish_date'
                                       value={dateFormat(this.props.pollStore.poll.finish_date, "dd/mm/yyyy")}
                                       style={{ border: '1px solid #BFC5D2', color: '#BFC5D2' }}
                                />

                            </div>
                        </div>
                    </TabsLayout>
                </div>
            </div>
        );
    }
}

export default inject('pollStore', 'userStore', 'permissionsStore')(observer(Poll));
