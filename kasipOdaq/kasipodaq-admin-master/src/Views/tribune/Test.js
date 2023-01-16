import React, {Component} from "react";
import Layout from "../Containers/Layout";
import {Route, Switch} from "react-router";
import Preloader from "../../fragments/preloader/Preloader";
import {NotificationContainer, NotificationManager} from "react-notifications";
import Search from "../../fragments/search";
import {Link} from "react-router-dom";
import {ReactComponent as QuestionContentIcon} from "../../assets/icons/question-content-icon.svg";
import TabsLayout from "../Containers/TabsLayout";
import {inject, observer} from "mobx-react";

const dateFormat = require('dateformat');

class Test extends Component {

    constructor(props){
        super(props);

        this.state = {
            preloader: false,
            tabs: [
                {name: this.props.userStore.languageList["Содержание"] || 'Содержание'},
                {name: this.props.userStore.languageList["Статистика"] || 'Статистика'}
            ],
        };

        this.changeTabCallback = this.changeTabCallback.bind(this);
        this.filterQuestionAnswers = this.filterQuestionAnswers.bind(this)

    }

    componentDidMount() {
        this.setState({ preloader: true });

        this.props.testStore.loadTest(
            this.props.match.params.id,
            data => {
                this.props.testStore.loadQuestions(
                    data.resource_id,
                    data => {
                        data.forEach(question => {
                            this.props.testStore.loadAnswers(
                                question.resource_id,
                                () => {
                                    this.setState({ preloader: false })
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
                        })
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
                })
        }
    };

    filterQuestionAnswers(question, questionIndex) {
        const answers = this.props.testStore.answers.filter((answer) => {
            return (!!question.resource_id && (answer.question_id == question.resource_id))
                || answer.questionIndex == questionIndex
        });

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

                    <div style={{ marginBottom: 16, marginTop: 16 }}>
                        <Link style={{ color: '#0052A4' }} to={`/tribune`}>Все тесты</Link>
                        <span> -> </span>
                        <Link style={{ color: '#0052A4' }}>{ this.props.testStore.test.name }</Link>
                    </div>

                    <TabsLayout tabs={this.state.tabs}
                                changeTabCallback={this.changeTabCallback}>
                    <div className={'test-flex-block'}>
                        <div className={'test-flex-left'}>
                            <label htmlFor="">
                                <span style={{ color: '#BFC5D2' }}>{this.props.userStore.languageList["Тема"] || 'Тема'}</span>
                                <input type="text"
                                       placeholder={this.props.userStore.languageList["Введите тему"] || 'Введите тему'}
                                       className={'subject-input'}
                                       style={{border: '1px solid #BFC5D2', color: '#BFC5D2'}}
                                       value={this.props.testStore.test.name}
                                />
                            </label>
                            {
                                this.props.testStore.questions.map((question, index) => {
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
                                                        <div className='checkbox'>
                                                            <input type="checkbox"
                                                                   name='source'
                                                                   id={`${index}${answerIndex}`}
                                                                   checked={answer.is_right}
                                                            />
                                                            <label htmlFor={`${index}${answerIndex}`} style={{ color: '#BFC5D2' }}>{this.props.userStore.languageList["Правильный ответ"] || 'Правильный ответ'}</label>
                                                        </div>
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
                                   value={dateFormat(this.props.testStore.test.start_date, "dd/mm/yyyy")}
                                   style={{ border: '1px solid #BFC5D2', color: '#BFC5D2' }}
                            />
                            <label htmlFor="finish_date" style={{ color: '#BFC5D2' }}>{this.props.userStore.languageList["Дата окончания"] || 'Дата окончания'}</label>
                            <input type="text"
                                   name='source'
                                   id='finish_date'
                                   value={dateFormat(this.props.testStore.test.finish_date, "dd/mm/yyyy")}
                                   style={{ border: '1px solid #BFC5D2', color: '#BFC5D2' }}
                            />

                            <div className={'input-percent'}>
                                <label style={{ color: '#BFC5D2' }}>{this.props.userStore.languageList["Соотношение верных ответов"] || 'Соотношение верных ответов'} (%)</label>
                                <input
                                    type="number"
                                    value={this.props.testStore.test.percent_threshold}
                                    style={{ border: '1px solid #BFC5D2', color: '#BFC5D2' }}
                                />
                            </div>
                        </div>
                    </div>
                    </TabsLayout>
                </div>
            </div>
        );
    }
}

export default inject('testStore', 'userStore', 'permissionsStore')(observer(Test));
