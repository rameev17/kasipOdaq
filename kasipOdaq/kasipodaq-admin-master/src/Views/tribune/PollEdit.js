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
import Modal from "react-modal";
import DatePicker, { registerLocale } from "react-datepicker";
import format from "date-fns/format";
import toDate from "date-fns/toDate";
import ru from "date-fns/locale/ru";
registerLocale("ru", ru);

class PollEdit extends Component {

    constructor(props){
        super(props);

        this.state = {
            preloader: false,
            startDate: new Date(),
            finishDate: new Date(),
            statusModalVisible: false,
            status: false,
            alternativeAnswer: 0,
        };

        this.titleRef = React.createRef();

        this.editPoll = this.editPoll.bind(this);
        this.startDateChange = this.startDateChange.bind(this);
        this.finishDateChange = this.finishDateChange.bind(this);
        this.statusChange = this.statusChange.bind(this);
        this.answerInputChange = this.answerInputChange.bind(this);
        this.alternativeAnswerChange = this.alternativeAnswerChange.bind(this);

        this.filterAnswers = this.filterAnswers.bind(this);
        this.filterQuestionAnswers = this.filterQuestionAnswers.bind(this);
        this.filterQuestions = this.filterQuestions.bind(this);

        this.pollInputChange = this.pollInputChange.bind(this);
        this.publishQuestions = this.publishQuestions.bind(this)
    }

    componentDidMount() {
        this.setState({ preloader: true });
        this.props.pollStore.loadPoll(
            this.props.match.params.id,
            data => {
                this.setState({
                    startDate: toDate(data.start_date),
                    finishDate: toDate(data.finish_date),
                    preloader: false
                });
                this.props.pollStore.loadQuestions(
                    data.resource_id,
                    data => {
                        data.map(question => {
                            this.setState({
                                preloader: false,
                                alternativeAnswer: question.has_alternate_answer
                            })
                        });
                        data.forEach(question => {
                            this.props.pollStore.loadAnswers(
                                question.resource_id,
                                () => {
                                    this.setState({ preloader: false })
                                }
                            )
                        })
                    }
                )
            }
        )
    }

    startDateChange(date) {
        this.setState({
            startDate: date
        })
    }

    finishDateChange(date) {
        this.setState({
            finishDate: date
        })
    }

    pollInputChange(event, index) {
        this.props.pollStore.questions[index].value = event.target.value
    }

    answerInputChange(event, questionIndex, index, answer, questionId){
        if (answer.is_new && !!questionId) {
            this.props.pollStore.getNewAnswerByQuestionId(answer.question_id, answer.index).value = event.target.value
        } else {
            this.props.pollStore.getAnswer(questionIndex, index, answer.is_new, answer.resource_id).value = event.target.value
        }
    }

    editPoll() {
        const editAnswers = async (answers) => {
            for (const answer of answers) {
                await this.props.pollStore.updateAnswerForQuestion(
                    answer.resource_id,
                    answer.value,
                    () => {},
                    response => {
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
                    });
            }
        };

        const createAnswers = async (answers) => {
            for (const answer of answers) {
                await this.props.pollStore.createAnswerForQuestion(answer.value, answer.question_id,
                    () => {

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
                    });
            }
        };

        const editQuestions = async (questions) => {
            for (const question of questions) {
                await this.props.pollStore.updateQuestionForTest(
                    question.resource_id,
                    question.value,
                    this.state.alternativeAnswer,
                    () => {},
                    response => {
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
                    });
                const oldAnswers = this.filterAnswers(question, false);
                const newAnswers = this.filterAnswers(question, true);

                await editAnswers(oldAnswers);
                await createAnswers(newAnswers);
            }
        };

        const createQuestions = async (questions) => {
            this.props.pollStore.revisionId = this.props.match.params.id;

            for (const question of questions) {
                await this.props.pollStore.createQuestionForTest(question.value, async (data, headers) => {
                    const questionId = this.props.pollStore.questionId;
                    const answers = this.filterAnswers(question, true).map(answer => Object.assign(answer, {question_id: questionId}));

                    await createAnswers(answers)
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
        };

        this.setState({ preloader: true });

        let questions = this.filterQuestions(false);

        Promise.resolve(editQuestions(questions)).then(() => {
            questions = this.filterQuestions(true);

            Promise.resolve(createQuestions(questions)).then(() => {
                this.props.pollStore.editTest(
                    this.titleRef.current.value,
                    format(this.state.startDate, "yyyy-MM-dd HH:mm:ss"),
                    format(this.state.finishDate, "yyyy-MM-dd 23:59:59"),
                    this.state.status,
                    () => {

                        this.props.history.push("/tribune/poll");
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
            });
        });
    }

    filterQuestions(newQuestion) {
        let questions = this.props.pollStore.questions.filter(question => question.is_new == newQuestion);

        return questions;
    }

    filterAnswers(question, newAnswer) {
        const answers = this.props.pollStore.answers.filter(answer => {
            return answer.is_new == newAnswer &&
                (!!question.resource_id ? answer.question_id == question.resource_id : answer.questionIndex == question.index)
        });

        return answers;
    }

    filterQuestionAnswers(question, questionIndex) {
        const answers = this.props.pollStore.answers.filter((answer) => {
            return (!!question.resource_id && (answer.question_id == question.resource_id))
                || answer.questionIndex == questionIndex
        });

        return answers
    }

    alternativeAnswerChange(){
        this.setState({
            alternativeAnswer: !this.state.alternativeAnswer
        })
    }

    statusChange(){
        this.setState({
            statusModalVisible: true
        })
    }

    publishQuestions(){
        this.setState({
            statusModalVisible: false,
            status: true
        })
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
                        <Link style={{ color: '#0052A4' }}>{ this.props.pollStore.poll.name }</Link>
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
                                    value={this.props.pollStore.poll.name}
                                    onChange={() => { this.props.pollStore.poll.name = this.titleRef.current.value }}
                                />
                            </label>

                            {
                                this.props.pollStore.questions.map((poll, index) => {
                                    return <div className={'test-question'}>
                                        <div className={'question-icon'}>
                                            <QuestionIcon onClick={() => this.props.pollStore.removeQuestion(poll, index)}/>
                                            <span>{this.props.userStore.languageList["Вопрос"] || 'Вопрос'}</span>
                                        </div>
                                        <div className={'question-wrapper'}>
                                            <input type="text" value={index + 1} disabled/>
                                            <input
                                                type="text"
                                                placeholder={this.props.userStore.languageList["Введите вопрос"] || 'Введите вопрос'}
                                                value={poll.value}
                                                onChange={event => this.pollInputChange(event, index)}
                                            />
                                        </div>

                                        {
                                            this.filterQuestionAnswers(poll, index)
                                                .map((answer, answerIndex) => {
                                                    return <div className={'test-answer'} key={index}>
                                                        <div className={'answer-icon'}>
                                                            <QuestionIcon onClick={ () => this.props.pollStore.removeAnswer(answer, poll, index) }/>
                                                            <span>{this.props.userStore.languageList["Ответ"] || 'Ответ'}</span>
                                                        </div>

                                                        <input
                                                            type="text"
                                                            placeholder={this.props.userStore.languageList["Верный ответ"] || 'Верный ответ'}
                                                            value={answer.value}
                                                            onChange={event => this.answerInputChange(event, index, answerIndex, answer, poll.resource_id)}
                                                        />

                                                    </div>
                                                })
                                        }

                                        <p onClick={() => this.props.pollStore.addAnswer(index, poll.resource_id)} ><AnswerAdd/>{this.props.userStore.languageList["Добавить ответ"] || 'Добавить ответ'}</p>

                                        <p> <QuestionInform/>{this.props.userStore.languageList["Можно добавить не более 10 вариантов ответа"] || 'Можно добавить не более 10 вариантов ответа'}</p>

                                    </div>
                                })
                            }

                            <p onClick={() => this.props.pollStore.addQuestion()}><AnswerAdd/>{this.props.userStore.languageList["Добавить вопрос"] || 'Добавить вопрос'}</p>

                        </div>

                        <div className={'test-flex-right'}>
                            <label htmlFor="start_date">{this.props.userStore.languageList["Дата начала"] || 'Дата начала'}</label>
                            <DatePicker
                                dateFormat="dd/MM/yyyy"
                                locale={"ru"}
                                selected={this.state.startDate}
                                onChange={this.startDateChange}
                            />

                            <label htmlFor="finish_date">{this.props.userStore.languageList["Дата окончания"] || 'Дата окончания'}</label>
                            <DatePicker
                                dateFormat="dd/MM/yyyy"
                                locale={"ru"}
                                selected={this.state.finishDate}
                                onChange={this.finishDateChange}
                            />

                            <div className='checkbox'>
                                <input type="checkbox"
                                       name='source'
                                       id='free_answer'
                                       checked={this.state.alternativeAnswer == 1}
                                       onChange={this.alternativeAnswerChange}
                                />
                                <label htmlFor="free_answer" style={{ display: 'flex' }}>{this.props.userStore.languageList["Добавить свободную форму ответа"] || 'Добавить свободную форму ответа'}</label>
                            </div>

                            <div className='checkbox'>
                                <input type="checkbox"
                                       name='source'
                                       id='publish'
                                       checked={this.state.status == 1}
                                       onChange={this.statusChange}
                                />
                                <label htmlFor="publish" style={{ display: "flex" }}>{this.props.userStore.languageList["Опубликовать"] || 'Опубликовать'}</label>
                            </div>
                        </div>

                    </div>

                    <div className={'test-buttons'}>
                        <Link onClick={() => { this.props.history.goBack() }}>{this.props.userStore.languageList["Отменить"] || 'Отменить'}</Link>
                        <Link onClick={this.editPoll} >{this.props.userStore.languageList["Сохранить"] || 'Сохранить'}</Link>
                    </div>

                </div>

                {
                    this.state.statusModalVisible && !this.state.status &&
                    <Modal
                        isOpen={true}
                        className="Modal"
                        overlayClassName="Overlay"
                    >
                        <div className="modal__wrapper logout__wrapper">
                            <div className="modal__text">
                                {this.props.userStore.languageList["Вы действительно хотите опубликовать?"] || 'Вы действительно хотите опубликовать?'}
                            </div>
                            <div className="modal__btns">
                                <div className="modal__btn" onClick={() => this.setState({ statusModalVisible: false })}>
                                    {this.props.userStore.languageList["Отмена"] || 'Отмена'}
                                </div>
                                <div className="modal__btn" onClick={this.publishQuestions}>
                                    {this.props.userStore.languageList["Опубликовать"] || 'Опубликовать'}
                                </div>
                            </div>
                        </div>
                    </Modal>
                }

            </div>

        );
    }
}

export default inject('pollStore', 'userStore', 'permissionsStore')(observer(PollEdit));