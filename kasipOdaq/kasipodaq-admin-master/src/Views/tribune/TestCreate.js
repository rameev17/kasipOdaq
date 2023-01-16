import React, {Component} from "react";
import Layout from "../Containers/Layout";
import {Route, Switch} from "react-router";
import Preloader from "../../fragments/preloader/Preloader";
import Search from "../../fragments/search";
import {Link} from "react-router-dom";
import {ReactComponent as QuestionIcon} from "../../assets/icons/question-answer-icon.svg";
import {ReactComponent as AnswerAdd} from "../../assets/icons/answer-add.svg";
import {ReactComponent as QuestionInform} from "../../assets/icons/question-inform.svg";
import {inject, observer} from "mobx-react";

import "react-datepicker/dist/react-datepicker.css";
import Modal from "react-modal";
import {NotificationContainer, NotificationManager} from "react-notifications";
import DatePicker, { registerLocale } from "react-datepicker";
import ru from "date-fns/locale/ru";
registerLocale("ru", ru);

class TestCreate extends Component {

    constructor(props){
        super(props);

        this.state = {
            preloader: false,
            startDate: new Date(),
            finishDate: new Date(),
            statusModalVisible: false,
            status: 0,
            alternativeAnswer: false,
        };

        this.titleRef = React.createRef();
        this.percentRef = React.createRef();

        this.createTest = this.createTest.bind(this);
        this.startDateChange = this.startDateChange.bind(this);
        this.finishDateChange = this.finishDateChange.bind(this);
        this.statusChange = this.statusChange.bind(this);
        this.alternativeAnswerChange = this.alternativeAnswerChange.bind(this);
        this.questionInputChange = this.questionInputChange.bind(this);

        this.answerInputChange = this.answerInputChange.bind(this);
        this.answerStatusChange = this.answerStatusChange.bind(this);
        this.publishQuestions = this.publishQuestions.bind(this)
    }

    componentDidMount() {
        this.props.testAddStore.testList = [];
        this.props.testAddStore.questions = [];
        this.props.testAddStore.answers = [];

        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        let yyyy = today.getFullYear();

        today = new Date(yyyy + '-' + mm + '-' + dd + 'T23:59:59').toISOString();

        this.setState({
            finishDate: new Date(today)
        })

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

    questionInputChange(event, index) {
        this.props.testAddStore.questions[index].value = event.target.value
    }

    answerInputChange(event, questionIndex, index){
        this.props.testAddStore.getAnswer(questionIndex, index, true).value = event.target.value
    }

    answerStatusChange(event, questionIndex, answerIndex) {
        const questionAnswers = this.props.testAddStore.answers.filter(answer => answer.questionIndex == questionIndex);

        questionAnswers.forEach((answer, index) => {
            this.props.testAddStore.getAnswer(questionIndex, index, true).status = 0;
        });

        this.props.testAddStore.getAnswer(questionIndex, answerIndex, true).status = event.target.checked ? 1 : 0
    }

    createTest() {
        const createAnswers = async (answers) => {
            for (let answer of answers) {
                await this.props.testAddStore.createAnswerForQuestion(
                    answer.value,
                    answer.status,
                    () => {},
                        response => {
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
        };

        const createQuestions = async (questions) => {
            for (let [index, question] of questions.entries()) {
                await this.props.testAddStore.createQuestionForTest(
                    question.value,
                    () => {}, response => {
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
                );

                const answers = this.props.testAddStore.answers.filter(answer => answer.questionIndex == index);

                await createAnswers(answers);
            }
        };

        this.setState({ preloader: true });

        if (this.percentRef.current.value == ''){
            this.setState({ preloader: false });
            NotificationManager.error('Заполните поле "Соотношение верных ответов"')
        }else{
            this.props.testAddStore.createTest(
                this.titleRef.current.value,
                this.percentRef.current.value,
                this.state.startDate,
                this.state.finishDate,
                () => {

                    NotificationManager.success('тест успешно создан!');

                    Promise.resolve(createQuestions(this.props.testAddStore.questions)).then(() => {
                        console.log(this.state.status);
                        if (this.state.status){
                            this.props.testAddStore.updateStatusRevision(() => {
                                this.props.history.push('/tribune')
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
                            })
                        }else{
                            this.props.history.push('/tribune')
                        }
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
        }
    }

    alternativeAnswerChange(){
        this.setState({
            alternativeAnswer: true
        })
    }

    statusChange(){
        this.setState({
            statusModalVisible: true
        });

        if (this.state.status){
            this.setState({
                status: false,
                statusModalVisible: false
            })
        }
    }

    publishQuestions(){
        this.setState({
            statusModalVisible: false,
            status: true
        })
    }

    render() {
        return (
            <div className='discussion-direction'>

                {
                    this.state.preloader &&
                    <Preloader/>
                }
                <NotificationContainer/>

                <div className="title-wrapper">
                    <h1 className="title">{this.props.userStore.languageList["Добавить тест"] || 'Добавить тест'}</h1>
                </div>

                <div className={'panel'}>

                    <div style={{ marginBottom: 16, marginTop: 16 }}>
                        <Link style={{ color: '#0052A4' }} onClick={() => this.props.history.goBack()}>{this.props.userStore.languageList['Вернуться назад'] || 'Вернуться назад'}</Link>
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
                                />
                            </label>

                            {
                                this.props.testAddStore.questions.map((question, index) => {
                                    return <div className={'test-question'} key={index}>
                                        <div className={'question-icon'} >
                                            <QuestionIcon onClick={ () => this.props.testAddStore.removeQuestion(index) }/>
                                            <span>{this.props.userStore.languageList["Вопрос"] || 'Вопрос'}</span>
                                        </div>
                                        <div className={'question-wrapper'}>
                                            <input type="text" value={index + 1} disabled/>
                                            <input type="text"
                                                   placeholder={this.props.userStore.languageList["Введите вопрос"] || 'Введите вопрос'}
                                                   value={question.value}
                                                   onChange={event => this.questionInputChange(event, index)}/>
                                        </div>

                                            {
                                                this.props.testAddStore.answers.filter(answer => answer.questionIndex == index)
                                                    .map((answer, answerIndex) => {
                                                    return <div className={'test-answer'} key={index}>
                                                        <div className={'answer-icon'}>
                                                            <QuestionIcon onClick={ () => this.props.testAddStore.removeAnswer(index, answerIndex) }/>
                                                            <span>{this.props.userStore.languageList["Ответ"] || 'Ответ'}</span>
                                                        </div>
                                                        <input
                                                            type="text"
                                                            placeholder={this.props.userStore.languageList["Верный ответ"] || 'Верный ответ'}
                                                            value={answer.value}
                                                            onChange={event => this.answerInputChange(event, index, answerIndex)}
                                                        />
                                                        <div className='checkbox'>
                                                            <input type="checkbox"
                                                                   name='source'
                                                                   id={`${index}${answerIndex}`}
                                                                   checked={answer.status == 1}
                                                                   onChange={event => this.answerStatusChange(event, index, answerIndex)}
                                                            />
                                                            <label htmlFor={`${index}${answerIndex}`}>{this.props.userStore.languageList["Верный ответ"] || 'Верный ответ'}</label>
                                                        </div>
                                                    </div>
                                                })
                                            }
                                        <p onClick={() => this.props.testAddStore.addAnswer(index)} ><AnswerAdd/>{this.props.userStore.languageList["Добавить ответ"] || 'Добавить ответ'}</p>
                                        <p> <QuestionInform/>
                                            {this.props.userStore.languageList["Можно добавить не более 10 вариантов ответов"]
                                            || 'Можно добавить не более 10 вариантов ответов'}
                                        </p>
                                    </div>
                                })
                            }
                            <p onClick={() => this.props.testAddStore.addQuestion()}><AnswerAdd/>{this.props.userStore.languageList["Добавить вопрос"] || 'Добавить вопрос'}</p>
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

                            <div className={'input-percent'}>
                                <label>{this.props.userStore.languageList["Соотношение верных ответов"] || 'Соотношение верных ответов'} (%)</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="100"
                                    ref={this.percentRef}
                                    onChange={ (event) => this.percentRef.current.value = event.target.value }
                                />
                            </div>

                            {/*<div className='checkbox'>*/}
                            {/*    <input type="checkbox"*/}
                            {/*           name='source'*/}
                            {/*           id='free_answer'*/}
                            {/*           checked={this.state.alternativeAnswer == 1}*/}
                            {/*           onChange={this.alternativeAnswerChange}*/}
                            {/*    />*/}
                            {/*    <label htmlFor="free_answer">Добавить свободную форму ответа</label>*/}
                            {/*</div>*/}

                            <div className='checkbox' >
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
                        <Link onClick={this.createTest}>{this.props.userStore.languageList["Сохранить"] || 'Сохранить'}</Link>
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

export default inject('testAddStore', 'userStore', 'permissionsStore')(observer(TestCreate));
