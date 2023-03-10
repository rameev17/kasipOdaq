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
import format from "date-fns/format";
import toDate from "date-fns/toDate";
import DatePicker, { registerLocale } from "react-datepicker";
import ru from "date-fns/locale/ru";
registerLocale("ru", ru);

class TestEdit extends Component {

    constructor(props){
        super(props);

        this.state = {
            preloader: false,
            startDate: new Date(),
            finishDate: new Date(),
            statusModalVisible: false,
            status: false,
        };

        this.titleRef = React.createRef();
        this.percentRef = React.createRef();

        this.editTest = this.editTest.bind(this);
        this.startDateChange = this.startDateChange.bind(this);
        this.finishDateChange = this.finishDateChange.bind(this);
        this.statusChange = this.statusChange.bind(this);

        this.testInputChange = this.testInputChange.bind(this);
        this.publishQuestions = this.publishQuestions.bind(this);
        this.answerStatusChange = this.answerStatusChange.bind(this);
        this.answerInputChange = this.answerInputChange.bind(this);
        this.filterQuestions = this.filterQuestions.bind(this);
    }

    componentDidMount() {
        this.setState({ preloader: true });

        this.props.testStore.questions = [];
        this.props.testStore.answers = [];

        this.props.testStore.loadTest(
            this.props.match.params.id,
            data => {
                this.setState({
                  startDate: toDate(data.start_date),
                  finishDate: toDate(data.finish_date),
                    preloader: false,
                });
                if (data.length <= 0) this.setState({ preloader: false });

                this.props.testStore.loadQuestions(
                    data.resource_id,
                    data => {
                        if (data.length <= 0) this.setState({ preloader: false });

                        data.forEach(data => {
                            this.props.testStore.loadAnswers(
                                data.resource_id,
                                data => {
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

    testInputChange(event, index) {
        this.props.testStore.questions[index].value = event.target.value
    }

    answerInputChange(event, questionIndex, index, answer, questionId){
        if (answer.is_new && !!questionId) {
            this.props.testStore.getNewAnswerByQuestionId(answer.question_id, answer.index).value = event.target.value
        } else {
           this.props.testStore.getAnswer(questionIndex, index, answer.is_new, answer.resource_id).value = event.target.value
        }
    }

    answerStatusChange(event, answerIndex, isNew, currentAnswer, questionId) {
        const questionAnswers = this.props.testStore.answers.filter(answer => {
          return (!!answer.question_id && (answer.question_id == questionId) && (answer.resource_id != currentAnswer.resource_id))
            || ((answer.questionIndex == currentAnswer.questionIndex) && (answer.index != currentAnswer.index))
        });

        questionAnswers.forEach(answer => {
            if (answer.is_new && !!answer.question_id) {
                this.props.testStore.getNewAnswerByQuestionId(answer.question_id, answer.index).status = 0;
                this.props.testStore.getNewAnswerByQuestionId(answer.question_id, answer.index).is_right = false
            } else {
                this.props.testStore.getAnswer(answer.questionIndex, answer.index, answer.is_new, answer.resource_id).status = 0;
                this.props.testStore.getAnswer(answer.questionIndex, answer.index, answer.is_new, answer.resource_id).is_right = false
            }
        });

        if (isNew) {
            this.props.testStore.getAnswer(currentAnswer.questionIndex, currentAnswer.index, true).status = event.target.checked ? 1 : 0;
            this.props.testStore.getAnswer(currentAnswer.questionIndex, currentAnswer.index, true).is_right = event.target.checked
        } else {
            this.props.testStore.getAnswer(currentAnswer.questionIndex, currentAnswer.index, false, currentAnswer.resource_id).status = event.target.checked ? 1 : 0;
            this.props.testStore.getAnswer(currentAnswer.questionIndex, currentAnswer.index, false, currentAnswer.resource_id).is_right = event.target.checked
        }
    }

    editTest() {
        const editAnswers = async (answers) => {
            for (const answer of answers) {
                await this.props.testStore.updateAnswerForQuestion(answer.resource_id, answer.value, answer.is_right,
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
                await this.props.testStore.createAnswerForQuestion(answer.value, answer.question_id, answer.status,
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
                await this.props.testStore.updateQuestionForTest(question.resource_id, question.value,
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
            this.props.testStore.revisionId = this.props.match.params.id;

            for (const question of questions) {
                await this.props.testStore.createQuestionForTest(question.value, async (data, headers) => {
                  const questionId = headers['x-entity-id'];
                  const answers = this.filterAnswers(question, true).map(answer => Object.assign(answer, {question_id: questionId}));

                  await createAnswers(answers);
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
        };

        this.setState({ preloader: true });

        let questions = this.filterQuestions(false);

        Promise.resolve(editQuestions(questions)).then(() => {
          questions = this.filterQuestions(true);

          Promise.resolve(createQuestions(questions)).then(() => {
            this.props.testStore.editTest(
              this.titleRef.current.value,
              this.percentRef.current.value,
                format(this.state.startDate, "yyyy-MM-dd HH:mm:ss"),
                format(this.state.finishDate, "yyyy-MM-dd 23:59:59"),
              this.state.status,
              () => {

              this.setState({ preloader: false });

              this.props.history.push("/tribune");
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

    filterQuestions(newQuestion) {
        let questions = this.props.testStore.questions.filter(question => question.is_new == newQuestion);

        return questions;
    }

    filterAnswers(question, newAnswer) {
      const answers = this.props.testStore.answers.filter(answer => {
        return answer.is_new == newAnswer &&
          (!!question.resource_id ? answer.question_id == question.resource_id : answer.questionIndex == question.index)
      });

      return answers;
    }

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
                    <h1 className="title">{this.props.userStore.languageList["??????????????"] || '??????????????'}</h1>
                </div>

                <div className={'panel'}>

                    <div style={{ marginBottom: 16, marginTop: 16 }}>
                        <Link style={{ color: '#0052A4' }} onClick={() => this.props.history.goBack()}>{this.props.userStore.languageList['?????????????????? ??????????'] || '?????????????????? ??????????'}</Link>
                    </div>

                    <div className={'test-flex-block'}>
                        <div className={'test-flex-left'}>
                            <label htmlFor="">
                                <span>{this.props.userStore.languageList["????????"] || '????????'}</span>
                                <input
                                    type="text"
                                    placeholder={this.props.userStore.languageList["?????????????? ????????"] || '?????????????? ????????'}
                                    className={'subject-input'}
                                    ref={this.titleRef}
                                    value={this.props.testStore.test.name}
                                    onChange={() => { this.props.testStore.test.name = this.titleRef.current.value }}
                                />
                            </label>

                            {
                                this.props.testStore.questions.map((question, index) => {
                                    return <div className={'test-question'}>
                                        <div className={'question-icon'}>
                                            <QuestionIcon onClick={() => this.props.testStore.removeQuestion(question, index)}/>
                                            <span>{this.props.userStore.languageList["????????????"] || '????????????'}</span>
                                        </div>
                                        <div className={'question-wrapper'}>
                                            <input type="text" value={index + 1} disabled/>
                                            <input
                                                type="text"
                                                placeholder={this.props.userStore.languageList["?????????????? ????????????"] || '?????????????? ????????????'}
                                                value={question.value}
                                                onChange={event => this.testInputChange(event, index)}
                                            />
                                        </div>
                                        {
                                            this.filterQuestionAnswers(question, index)
                                                .map((answer, answerIndex) => {
                                                    return <div className={'test-answer'} key={index}>
                                                        <div className={'answer-icon'}>
                                                            <QuestionIcon onClick={ () => this.props.testStore.removeAnswer(answer, question, index) }/>
                                                            <span>{this.props.userStore.languageList["??????????"] || '??????????'}</span>
                                                        </div>

                                                        <input
                                                            type="text"
                                                            placeholder={this.props.userStore.languageList["???????????? ??????????"] || '???????????? ??????????'}
                                                            value={answer.value}
                                                            onChange={event => this.answerInputChange(event, index, answerIndex, answer, question.resource_id)}
                                                        />

                                                        <div className='checkbox'>
                                                            <input type="checkbox"
                                                                   name='source'
                                                                   id={`${index}${answerIndex}`}
                                                                   checked={answer.status == 1}
                                                                   onChange={event => this.answerStatusChange(event, answerIndex, answer.is_new, answer, question.resource_id)}
                                                            />
                                                            <label htmlFor={`${index}${answerIndex}`}>{this.props.userStore.languageList["???????????? ??????????"] || '???????????? ??????????'}</label>
                                                        </div>

                                                    </div>
                                                })
                                        }

                                        <p onClick={() => this.props.testStore.addAnswer(index, question.resource_id)} ><AnswerAdd/>{this.props.userStore.languageList["???????????????? ??????????"] || '???????????????? ??????????'}</p>

                                        <p> <QuestionInform/>{this.props.userStore.languageList["?????????? ???????????????? ???? ?????????? 10 ?????????????????? ????????????"] || '?????????? ???????????????? ???? ?????????? 100 ?????????????????? ????????????'}</p>

                                    </div>
                                })
                            }

                            <p onClick={() => this.props.testStore.addQuestion()}><AnswerAdd/>{this.props.userStore.languageList["???????????????? ????????????"] || '???????????????? ????????????'}</p>

                        </div>

                        <div className={'test-flex-right'}>
                            <label htmlFor="start_date">{this.props.userStore.languageList["???????? ????????????"] || '???????? ????????????'}</label>
                            <DatePicker
                                dateFormat="dd/MM/yyyy"
                                locale={"ru"}
                                selected={this.state.startDate}
                                onChange={this.startDateChange}
                            />

                            <label htmlFor="finish_date">{this.props.userStore.languageList["???????? ??????????????????"] || '???????? ??????????????????'}</label>
                            <DatePicker
                                dateFormat="dd/MM/yyyy"
                                locale={"ru"}
                                selected={this.state.finishDate}
                                onChange={this.finishDateChange}
                            />

                            <div className={'input-percent'}>
                                <label>{this.props.userStore.languageList["?????????????????????? ???????????? ??????????????"] || '?????????????????????? ???????????? ??????????????'} (%)</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="100"
                                    ref={this.percentRef}
                                    value={this.props.testStore.test.percent_threshold}
                                    onChange={ () => this.props.testStore.test.percent_threshold = this.percentRef.current.value }
                                />
                            </div>

                            {/*<div className='checkbox'>*/}
                            {/*    <input type="checkbox"*/}
                            {/*           name='source'*/}
                            {/*           id='free_answer'*/}
                            {/*    />*/}
                            {/*    <label htmlFor="free_answer">???????????????? ?????????????????? ?????????? ????????????</label>*/}
                            {/*</div>*/}

                            <div className='checkbox'>
                                <input type="checkbox"
                                       name='source'
                                       id='publish'
                                       checked={this.state.status == 1}
                                       onChange={this.statusChange}
                                />
                                <label htmlFor="publish" style={{ display: "flex" }}>{this.props.userStore.languageList["????????????????????????"] || '????????????????????????'}</label>
                            </div>
                        </div>

                    </div>

                    <div className={'test-buttons'}>
                        <Link onClick={() => { this.props.history.goBack() }}>{this.props.userStore.languageList["????????????????"] || '????????????????'}</Link>
                        <Link onClick={this.editTest} >{this.props.userStore.languageList["??????????????????"] || '??????????????????'}</Link>
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
                                {this.props.userStore.languageList["???? ?????????????????????????? ???????????? ?????????????????????????"] || '???? ?????????????????????????? ???????????? ?????????????????????????'}
                            </div>
                            <div className="modal__btns">
                                <div className="modal__btn" onClick={() => this.setState({ statusModalVisible: false })}>
                                    {this.props.userStore.languageList["????????????"] || '????????????'}
                                </div>
                                <div className="modal__btn" onClick={this.publishQuestions}>
                                    {this.props.userStore.languageList["????????????????????????"] || '????????????????????????'}
                                </div>
                            </div>
                        </div>
                    </Modal>
                }

            </div>

        );
    }
}

export default inject('testStore', 'userStore', 'permissionsStore')(observer(TestEdit));
