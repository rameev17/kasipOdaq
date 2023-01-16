import React, {Component} from 'react';
import Layout from "../../fragments/layout/Layout";
import TabsLayout from "../../fragments/tabsLayout/TabsLayout";
import {Switch, Redirect, Route, Link} from 'react-router-dom';
import {NotificationContainer, NotificationManager} from 'react-notifications';

import {ReactComponent as LeftArrowIcon} from '../../assets/icons/arrow.svg';

import './style.scss';
import {inject, observer} from "mobx-react";
import Preloader from "../../fragments/preloader/Preloader";
import CookieService from "../../services/CookieService";
import { Doughnut } from 'react-chartjs-2';
import Pager from 'react-pager';
const dateFormat = require('dateformat');

class Tribune extends Component {

    constructor(props) {
        super(props);

        this.state = {

        }

    }

    render() {

        return (
            <Layout title='Трибуна'>
                <Switch>
                    <Route exact path='/tribune' render={props => (
                        <QuestionsOpened {...props} />)}/>
                    <Route exact path='/tribune/closed' render={props => (
                        <QuestionsClosed {...props} />)}/>
                    <Route exact path='/tribune/closed/:id' render={props => (<QuestionsClosedList {...props}/>)}/>
                    <Route exact path='/tribune/closed/list/:id' render={props => (<QuestionsClosedQuestionsList {...props}/>)}/>
                    <Route exact path='/tribune/closed/solution/:id' render={props => (<QuestionsClosedSolution {...props}/>)}/>
                    <Route exact path='/tribune/question/:id' render={props => (<Question {...props}/>)}/>
                </Switch>
            </Layout>
        );
    }
}

const QuestionsOpened = inject('tribuneStore', 'permissionsStore', 'userStore')(observer(class QuestionsOpened extends Component {

    constructor(props) {
        super(props);

        this.state = {
            preloader: false,
            tabs: [
                {
                    name: this.props.userStore.languageList["Текущие"] || 'Текущие',
                    route: '/tribune'
                },
                {
                    name: this.props.userStore.languageList["Отвеченные"] || 'Отвеченные',
                    route: '/tribune/closed'
                },
            ],
            page: 1,
        }

        this.changeTabCallback = this.changeTabCallback.bind(this)
    }

    loadPage(){
        this.setState({ preloader: true })

        this.props.userStore.profileInfo(() => {
            this.props.tribuneStore.loadTestList(
                this.props.userStore.profile.union.resource_id,
                0,
                this.state.page,
                () => {
                    this.setState({ preloader: false })
                }, response => {
                    if (Array.isArray(response.data)) {
                        response.data.forEach(error => {
                            this.setState({ preloader: false })
                            NotificationManager.error(error.message)
                        })
                    } else {
                        this.setState({ preloader: false })
                        NotificationManager.error(response.data.message)
                    }
                    if (response.status == 401){
                        CookieService.remove('token')
                        this.setState({ preloader: false })
                        this.props.history.push('/auth')
                    }
                }
            )
        }, response => {
            if (Array.isArray(response.data)) {
                response.data.forEach(error => {
                    this.setState({preloader: false})
                    NotificationManager.error(error.message)
                })
            } else {
                NotificationManager.error(response.data.message)
                this.setState({preloader: false})
            }
            if (response.status == 401){
                CookieService.remove('token')
                this.setState({ preloader: false })
                this.props.history.push('/auth')
            }
        })
    }

    componentDidMount() {
        this.loadPage()
    }

    changeTabCallback(tab) {
        switch (tab) {
            case '1':
                this.props.history.push({
                    pathname: `/tribune`,
                    state: { tabId: 1 }
                })
                break;
            case '2':
                this.props.history.push({
                    pathname: `/tribune/closed`,
                    state: { tabId: 2 }
                })
                break;
            default:
                this.props.history.push({
                    pathname: `/tribune`,
                    state: { tabId: 1 }
                })
        }
    }

    handlePageChanged(newPage) {
        this.setState({page : newPage })
        this.loadPage()
    }

    render() {
        return (
            <TabsLayout changeTabCallback={this.changeTabCallback}
                        tabs={this.state.tabs}
                        history={this.props.history.location.pathname}
            >
                <div className="plate-wrapper plate-wrapper__height">
                    {
                        this.state.preloader &&
                            <Preloader/>
                    }
                    <NotificationContainer/>

                    <div className='questions'>
                        {
                            this.props.tribuneStore.testList.map((test, index) => {
                                return <div className='question__wrapper' key={index}>
                                            <Link to={'/tribune/question/' + test.resource_id } className="question">{ test.name }</Link>
                                            <div className="icon">
                                                <LeftArrowIcon/>
                                            </div>
                                        </div>
                            })
                        }
                    </div>

                    <Pager
                        total={parseInt(this.props.tribuneStore.testHeaders['x-pagination-page-count'])}
                        current={parseInt(this.props.tribuneStore.testHeaders['x-pagination-current-page']) - 1}
                        visiblePages={10}
                        titles={{first: '<', last: '>' }}
                        className="search-pagination"
                        onPageChanged={this.handlePageChanged}
                    />

                </div>

            </TabsLayout>
        )
    }
}))

const QuestionsClosed = inject('tribuneStore', 'permissionsStore', 'userStore')(observer(class QuestionsClosed extends Component {

    constructor(props) {
        super(props);

        this.state = {
            preloader: true,
            page: 1,
            tabs: [
                {
                    name: this.props.userStore.languageList["Текущие"] || 'Текущие',
                    route: '/tribune'
                },
                {
                    name: this.props.userStore.languageList["Отвеченные"] || 'Отвеченные',
                    route: '/tribune/closed'
                },
            ],

        }

        this.handlePageChanged = this.handlePageChanged.bind(this)
        this.changeTabCallback = this.changeTabCallback.bind(this)

    }

    loadInfo(){
        this.props.userStore.profileInfo(data => {
            this.props.tribuneStore.loadTestList(
                data.union.resource_id,
                1,
                this.state.page,
                () => { this.setState({ preloader: false }) },
                response => {
                    if (Array.isArray(response.data)) {
                        response.data.forEach(error => {
                            this.setState({ preloader: false })
                            NotificationManager.error(error.message)
                        })
                    } else {
                        this.setState({ preloader: false })
                        NotificationManager.error(response.data.message)
                    }
                    if (response.status == 401){
                        CookieService.remove('token')
                        this.setState({ preloader: false })
                        this.props.history.push('/auth')
                    }
                }
            )
        }, response => {
            if (Array.isArray(response.data)) {
                response.data.forEach(error => {
                    this.setState({preloader: false})
                    NotificationManager.error(error.message)
                })
            } else {
                NotificationManager.error(response.data.message)
                this.setState({preloader: false})
            }
            if (response.status == 401){
                CookieService.remove('token')
                this.setState({ preloader: false })
                this.props.history.push('/auth')
            }
        })
    }

    componentDidMount() {
        this.loadInfo()
    }

    handlePageChanged(newPage) {
        this.setState({page : newPage })
        this.loadPage()
    }

    changeTabCallback(tab) {
        switch (tab) {
            case '1':
                this.props.history.push({
                    pathname: `/tribune`,
                    state: { tabId: 1 }
                })
                break;
            case '2':
                this.props.history.push({
                    pathname: `/tribune/closed`,
                    state: { tabId: 2 }
                })
                break;
            default:
                this.props.history.push({
                    pathname: `/tribune/closed`,
                    state: { tabId: 2 }
                })
        }
    }

    render() {
        return (
            <TabsLayout changeTabCallback={this.changeTabCallback}
                        tabs={this.state.tabs}
                        history={this.props.history.location.pathname}
            >
                <div className="plate-wrapper plate-wrapper__height">
                    {
                        this.state.preloader &&
                        <Preloader/>
                    }
                    <NotificationContainer/>

                    <div className='questions'>
                        {
                            this.props.tribuneStore.testList.map((test, index) => {
                                return <div className='question__wrapper' key={index}>
                                    <Link to={'/tribune/closed/' + test.resource_id } className="question">{ test.name }</Link>
                                    <div className="icon">
                                        <LeftArrowIcon/>
                                    </div>
                                </div>
                            })
                        }
                    </div>

                    <Pager
                        total={parseInt(this.props.tribuneStore.testHeaders['x-pagination-page-count'])}
                        current={parseInt(this.props.tribuneStore.testHeaders['x-pagination-current-page']) - 1}
                        visiblePages={10}
                        titles={{first: '<', last: '>' }}
                        className="search-pagination"
                        onPageChanged={this.handlePageChanged}
                    />

                </div>
            </TabsLayout>

        )
    }
}))

const QuestionsClosedList = inject('tribuneStore', 'userStore', 'permissionsStore')(observer(class QuestionsClosedList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            finishStatistic: false,
            page: 1,
        }

        this.finishTest = this.finishTest.bind(this)
    }

    loadPage(){
        this.setState({ preloader: true })

        this.props.userStore.profileInfo(() => {
            this.props.tribuneStore.loadTestList(
                this.props.userStore.profile.union.resource_id,
                1,
                this.state.page,
                () => {
                    this.props.tribuneStore.loadQuestions(
                        this.props.match.params.id,
                        this.state.page,
                        data => {
                            data.forEach(data => {
                                this.props.tribuneStore.loadAnswers(
                                    data.resource_id,
                                    this.props.userStore.profile.resource_id,
                                    () => {
                                        this.setState({ preloader: false })
                                    }
                                )
                            })
                        }, response => {
                            if (Array.isArray(response.data)) {
                                response.data.forEach(error => {
                                    this.setState({ preloader: false })
                                    NotificationManager.error(error.message)
                                })
                            } else {
                                this.setState({ preloader: false })
                                NotificationManager.error(response.data.message)
                            }
                            if (response.status == 401){
                                CookieService.remove('token')
                                this.setState({ preloader: false })
                                this.props.history.push('/auth')
                            }
                        }
                    )
                }, response => {
                    if (Array.isArray(response.data)) {
                        response.data.forEach(error => {
                            this.setState({ preloader: false })
                            NotificationManager.error(error.message)
                        })
                    } else {
                        this.setState({ preloader: false })
                        NotificationManager.error(response.data.message)
                    }
                    if (response.status == 401){
                        CookieService.remove('token')
                        this.setState({ preloader: false })
                        this.props.history.push('/auth')
                    }
                }
            )
        }, response => {
            if (Array.isArray(response.data)) {
                response.data.forEach(error => {
                    this.setState({preloader: false})
                    NotificationManager.error(error.message)
                })
            } else {
                NotificationManager.error(response.data.message)
                this.setState({preloader: false})
            }
            if (response.status == 401){
                CookieService.remove('token')
                this.setState({ preloader: false })
                this.props.history.push('/auth')
            }
        })
    }

    componentDidMount() {
        this.loadPage()
    }

    finishTest = () => {
        this.props.tribuneStore.finishRevision(this.props.match.params.id,
            () => {
                this.setState({ finishStatistic: true })
                this.props.tribuneStore.getVoteStatistic(
                    this.props.match.params.id,
                    () => {

                    },response => {
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
            },response => {
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
            })
    }

    render() {

        return (
            <div className="plate-wrapper plate-wrapper__height">
                {
                    this.state.preloader &&
                    <Preloader/>
                }
                <NotificationContainer/>

                <div style={{ marginBottom: 16 }}>
                    <Link style={{ color: '#0052A4' }} to={'/tribune/closed'}>Отвеченные тесты/опросы</Link>
                    <span> -> </span>
                    <Link style={{ color: '#0052A4', borderBottom: '1px solid #0052A4' }}>Тест/Опрос</Link>
                </div>

                <div className='questions'>
                    <div className='question__wrapper' >
                        <Link to={`/tribune/closed/list/${this.props.match.params.id}` } className="question">{this.props.userStore.languageList["Вопросы"] || 'Вопросы'}</Link>
                        <div className="icon">
                            <LeftArrowIcon/>
                        </div>
                    </div>
                    <div className='question__wrapper' >
                        <Link onClick={ this.finishTest } className="question">{this.props.userStore.languageList["Результат"] || 'Результат'}</Link>
                        <div className="icon">
                            <LeftArrowIcon/>
                        </div>
                    </div>
                    {
                        this.props.tribuneStore.questions[0]?.revision.decree &&
                        <div className='question__wrapper' >
                            <Link to={`/tribune/closed/solution/${this.props.match.params.id}` } className="question">{this.props.userStore.languageList["Решение"] || 'Решение'}</Link>
                            <div className="icon">
                                <LeftArrowIcon/>
                            </div>
                        </div>
                    }
                </div>

                {
                    this.state.finishStatistic &&
                    <div className={'finish-wrapper'}>
                        <div className={'finish-statistic'}>
                            {
                                this.props.tribuneStore.questions[0].revision.type.resource_id == 83 ?
                                    <>
                                        <p>{this.props.userStore.languageList["Опрос завершен"] || 'Опрос завершен'}</p>
                                        <p>{this.props.userStore.languageList["Благодарим за внимание"] || 'Благодарим за внимание'}</p>
                                    </>
                                    :
                                    <>
                                        <p>{this.props.userStore.languageList["Тест завершен"] || 'Тест завершен'}</p>
                                        <p>{ parseInt(this.props.tribuneStore.totalTestStatistic.valid_answers) / parseInt(this.props.tribuneStore.totalTestStatistic.total_questions) * 100 + '%' }</p>
                                        <Doughnut
                                            data={this.props.tribuneStore.getDoughnutVoteData()}
                                            options={{
                                                legend: {
                                                    display: false
                                                }
                                            }}
                                        />
                                        <p>{ this.props.tribuneStore.totalTestStatistic.is_passed ? 'Пройден' : 'Не пройден' } { dateFormat(new Date().toUTCString(), 'dd/mm/yyyy') }</p>
                                        <p>
                                            {
                                                this.props.tribuneStore.totalTestStatistic.valid_answers
                                                +
                                                '/'
                                                +
                                                this.props.tribuneStore.totalTestStatistic.total_questions
                                            }
                                        </p>
                                    </>
                            }
                            <Link onClick={() => { this.setState({ finishStatistic: false }) }}>{this.props.userStore.languageList["Закрыть"] || 'Закрыть'}</Link>
                        </div>
                    </div>
                }

            </div>
        )
    }
}))

const QuestionsClosedQuestionsList = inject('tribuneStore', 'userStore', 'permissionsStore')(observer(class QuestionsClosedQuestionsList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            multiple: true,
            preloader: false,
            page: 0,
            radioValue: [],
            finishStatistic: false,
        }

        this.handlePageChanged = this.handlePageChanged.bind(this)
        this.finishTest = this.finishTest.bind(this)

    }

    loadInfo(){
        this.setState({ preloader: true })

        this.props.userStore.profileInfo(() => {
            this.props.tribuneStore.loadTestList(
                this.props.userStore.profile.union.resource_id,
                0,
                1,
                data => {
                    this.props.tribuneStore.loadQuestions(
                        this.props.match.params.id,
                        this.state.page + 1,
                        data => {
                            data.forEach(data => {
                                this.props.tribuneStore.loadAnswers(
                                    data.resource_id,
                                    this.props.userStore.profile.resource_id,
                                    () => {
                                        this.setState({ preloader: false })
                                    }
                                )
                            })
                        }, response => {
                            if (Array.isArray(response.data)) {
                                response.data.forEach(error => {
                                    this.setState({ preloader: false })
                                    NotificationManager.error(error.message)
                                })
                            } else {
                                this.setState({ preloader: false })
                                NotificationManager.error(response.data.message)
                            }
                            if (response.status == 401){
                                CookieService.remove('token')
                                this.setState({ preloader: false })
                                this.props.history.push('/auth')
                            }
                        }
                    )
                }
            )
        }, response => {
            if (Array.isArray(response.data)) {
                response.data.forEach(error => {
                    this.setState({ preloader: false })
                    NotificationManager.error(error.message)
                })
            } else {
                this.setState({ preloader: false })
                NotificationManager.error(response.data.message)
            }
            if (response.status == 401){
                CookieService.remove('token')
                this.setState({ preloader: false })
                this.props.history.push('/auth')
            }
        })
    }

    componentDidMount() {
        this.loadInfo()
    }

    handlePageChanged(newPage) {
        this.setState({page : newPage })
        this.loadInfo()
    }

    renderAnswers = (index, answer) => {
        if (answer.is_person_answer && !answer.is_right) {
            return <p>
                <input type={'checkbox'}
                       className={'checkbox'}
                       id={'input-' + index}
                       name="radio-group"
                       value={answer.resource_id}
                       checked={true}
                       disabled
                />
                <label htmlFor={'input-' + index} className={'person_answer'} style={{ display: 'flex', marginBottom: '15px' }}>{ answer.answer }</label>
            </p>
        } else if (answer.is_right) {
            return <p>
                <input type={'checkbox'}
                       className={'checkbox'}
                       id={'input-' + index}
                       name="radio-group"
                       value={answer.resource_id}
                       checked={true}
                       disabled
                />
                <label htmlFor={'input-' + index} className={'true_answer'} style={{ display: 'flex', marginBottom: '15px' }}>{ answer.answer }</label>
            </p>
        } else {
            return <p>
                <input type={'checkbox'}
                       className={'checkbox'}
                       id={'input-' + index}
                       name="radio-group"
                       value={answer.resource_id}
                       checked={false}
                       disabled
                />
                <label htmlFor={'input-' + index} style={{ display: 'flex', marginBottom: '15px' }}>{ answer.answer }</label>
            </p>
        }
    }

    finishTest = () => {
        this.props.tribuneStore.finishRevision(this.props.match.params.id,
            () => {
                this.setState({ finishStatistic: true })
                this.props.tribuneStore.getVoteStatistic(
                    this.props.match.params.id,
                    () => {

                    },response => {
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
            },response => {
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
            })
    }

    render() {
        return (
            <div className="plate-wrapper plate-wrapper__height">

                {
                    this.state.preloader &&
                    <Preloader/>
                }

                <div style={{ marginBottom: 16 }}>
                    <Link style={{ color: '#0052A4' }} to={'/tribune/closed'}>Отвеченные тесты/опросы</Link>
                    <span> -> </span>
                    <Link style={{ color: '#0052A4' }} to={`/tribune/closed/${this.props.match.params.id}`}>Тест/Опрос</Link>
                    <span> -> </span>
                    <Link style={{ color: '#0052A4', borderBottom: '1px solid #0052A4' }}>Вопросы</Link>
                </div>

                <NotificationContainer/>

                <div className='question'>
                    {
                        this.props.tribuneStore.testList.map(test => {
                            return test.resource_id == this.props.match.params.id &&
                                <div className="theme">
                                    { test.name }
                                </div>
                        })
                    }
                    {
                        this.props.tribuneStore.questions.map((question, index) => {
                            return <>
                                <div className="question" key={index} style={{ marginBottom: '15px' }}>
                                    { question.question }
                                </div>
                                <form className="question__form" onSubmit={this.nextQuestion}>
                                    {
                                        !!this.props.tribuneStore.answers &&
                                        this.props.tribuneStore.answers.map((answer, index) => {
                                            return <div className='option'>
                                                {
                                                    this.renderAnswers(index, answer)
                                                }
                                            </div>
                                        })
                                    }
                                    {/*<div className="text">*/}
                                    {/*    <label>*/}
                                    {/*        <div className="title">Внесите своё предложение:</div>*/}
                                    {/*        <textarea name="suggestion"*/}
                                    {/*         placeholder='Введите текст...'/>*/}
                                    {/*    </label>*/}
                                    {/*</div>*/}

                                    <Pager
                                        total={parseInt(this.props.tribuneStore.questionsHeaders['x-pagination-page-count'])}
                                        current={parseInt(this.props.tribuneStore.questionsHeaders['x-pagination-current-page']) - 1}
                                        visiblePages={10}
                                        titles={{first: '<', last: '>' }}
                                        className="search-pagination"
                                        onPageChanged={this.handlePageChanged}
                                    />

                                </form>
                            </>
                        })
                    }
                </div>
                {
                    this.state.finishStatistic &&
                    <div className={'finish-wrapper'}>
                        <div className={'finish-statistic'}>
                            {
                                this.props.tribuneStore.questions[0].revision.type.resource_id == 83 ?
                                    <>
                                        <p>{this.props.userStore.languageList["Опрос завершен"] || 'Опрос завершен'}</p>
                                        <p>{this.props.userStore.languageList["Благодарим за внимание"] || 'Благодарим за внимание'}</p>
                                    </>
                                    :
                                    <>
                                        <p>{this.props.userStore.languageList["Тест завершен"] || 'Тест завершен'}</p>
                                        <p>{ parseInt(this.props.tribuneStore.totalTestStatistic.valid_answers) / parseInt(this.props.tribuneStore.totalTestStatistic.total_questions) * 100 + '%' }</p>
                                        <Doughnut
                                            data={this.props.tribuneStore.getDoughnutVoteData()}
                                            options={{
                                                legend: {
                                                    display: false
                                                }
                                            }}
                                        />
                                        <p>{ this.props.tribuneStore.totalTestStatistic.is_passed ? 'Пройден' : 'Не пройден' } { dateFormat(new Date().toUTCString(), 'dd/mm/yyyy') }</p>
                                        <p>
                                            {
                                                this.props.tribuneStore.totalTestStatistic.valid_answers
                                                +
                                                '/'
                                                +
                                                this.props.tribuneStore.totalTestStatistic.total_questions
                                            }
                                        </p>
                                    </>
                            }
                            <Link to={'/tribune'}>{this.props.userStore.languageList["Продолжить"] || 'Продолжить'}</Link>
                        </div>
                    </div>
                }
            </div>
        )
    }
}))

const QuestionsClosedSolution = inject('tribuneStore', 'userStore', 'permissionsStore')(observer(class QuestionsClosedSolution extends Component {

    constructor(props) {
        super(props);

        this.state = {
            page: 1,
        }
    }

    loadPage(){
        this.setState({ preloader: true })

        this.props.userStore.profileInfo(() => {
            this.props.tribuneStore.loadTestList(
                this.props.userStore.profile.union.resource_id,
                0,
                1,
                data => {
                    this.props.tribuneStore.loadQuestions(
                        this.props.match.params.id,
                        this.state.page + 1,
                        data => {
                            data.forEach(data => {
                                this.props.tribuneStore.loadAnswers(
                                    data.resource_id,
                                    this.props.userStore.profile.resource_id,
                                    () => {
                                        this.setState({ preloader: false })
                                    }
                                )
                            })
                        }, response => {
                            if (Array.isArray(response.data)) {
                                response.data.forEach(error => {
                                    this.setState({ preloader: false })
                                    NotificationManager.error(error.message)
                                })
                            } else {
                                this.setState({ preloader: false })
                                NotificationManager.error(response.data.message)
                            }
                            if (response.status == 401){
                                CookieService.remove('token')
                                this.setState({ preloader: false })
                                this.props.history.push('/auth')
                            }
                        }
                    )
                }
            )
        }, response => {
            if (Array.isArray(response.data)) {
                response.data.forEach(error => {
                    this.setState({ preloader: false })
                    NotificationManager.error(error.message)
                })
            } else {
                this.setState({ preloader: false })
                NotificationManager.error(response.data.message)
            }
            if (response.status == 401){
                CookieService.remove('token')
                this.setState({ preloader: false })
                this.props.history.push('/auth')
            }
        })

    }

    componentDidMount() {
        this.loadPage()
    }

    render() {

        return (
            <div className="plate-wrapper plate-wrapper__height">
                {
                    this.state.preloader &&
                    <Preloader/>
                }
                <NotificationContainer/>

                <div className='questions'>
                    <p>{this.props.userStore.languageList["Решение"] || 'Решение'}</p>
                    <hr/>
                    <p dangerouslySetInnerHTML={{ __html: this.props.tribuneStore.questions[0]?.revision.decree }}></p>
                </div>
            </div>
        )
    }
}))

const Question = inject('tribuneStore', 'permissionsStore', 'userStore')(observer(class Question extends Component {

    constructor(props) {
        super(props);

        this.state = {
            multiple: true,
            preloader: false,
            page: 1,
            radioValue: [],
            finishStatistic: false,
        }

        this.alternativeAnswerRef = React.createRef()

        this.nextQuestion = this.nextQuestion.bind(this)
        this.finishTest = this.finishTest.bind(this)
    }

    componentDidMount() {
        this.setState({ preloader: true })

        this.props.userStore.profileInfo(() => {
            this.props.tribuneStore.loadTestList(
                this.props.userStore.profile.union.resource_id,
                0,
                1,
                data => {
                    this.props.tribuneStore.loadQuestions(
                        this.props.match.params.id,
                        this.state.page,
                        data => {
                            data.forEach(data => {
                                this.props.tribuneStore.loadAnswers(
                                    data.resource_id,
                                    this.props.userStore.profile.resource_id,
                                    () => {
                                        this.setState({ preloader: false })
                                    }
                                )
                            })
                        }, response => {
                            if (Array.isArray(response.data)) {
                                response.data.forEach(error => {
                                    this.setState({ preloader: false })
                                    NotificationManager.error(error.message)
                                })
                            } else {
                                this.setState({ preloader: false })
                                NotificationManager.error(response.data.message)
                            }
                            if (response.status == 401){
                                CookieService.remove('token')
                                this.setState({ preloader: false })
                                this.props.history.push('/auth')
                            }
                        }
                    )
                }
            )
        }, response => {
            if (Array.isArray(response.data)) {
                response.data.forEach(error => {
                    this.setState({ preloader: false })
                    NotificationManager.error(error.message)
                })
            } else {
                this.setState({ preloader: false })
                NotificationManager.error(response.data.message)
            }
            if (response.status == 401){
                CookieService.remove('token')
                this.setState({ preloader: false })
                this.props.history.push('/auth')
            }
        })

    }

    nextQuestion(e){
        e.preventDefault()

        const selectedInput = e.target.querySelector("input:checked");
        this.props.tribuneStore.loadQuestions(
            this.props.match.params.id,
            this.state.page,
            data => {
                this.props.tribuneStore.personAnswers.push({
                    answerId: selectedInput ? selectedInput.value : '',
                    alternate: this.alternativeAnswerRef.current?.value != null ? this.alternativeAnswerRef.current?.value : '',
                    questionId: data[0].resource_id
                });

                if (!selectedInput){
                    NotificationManager.error('Выберите ответ')
                }else{
                    if (selectedInput){
                        selectedInput.checked = false;
                    }

                  if (this.alternativeAnswerRef.current?.value != null){
                      this.alternativeAnswerRef.current.value = ''
                  }

                    if (this.props.tribuneStore.isLastQuestion) {
                        this.props.tribuneStore.isLastQuestion = false;
                        this.finishTest();
                    } else {
                        this.setState({
                            preloader: true,
                            page: this.state.page + 1
                        }, () => {
                            this.props.tribuneStore.loadTestList(
                                this.props.userStore.profile.union.resource_id,
                                0,
                                1,
                                data => {
                                    this.props.tribuneStore.loadQuestions(
                                        this.props.match.params.id,
                                        this.state.page,
                                        data => {
                                            data.forEach(data => {
                                                this.props.tribuneStore.loadAnswers(
                                                    data.resource_id,
                                                    this.props.userStore.profile.resource_id,
                                                    () => {
                                                        this.setState({ preloader: false })
                                                    }, response => {
                                                        if (Array.isArray(response.data)) {
                                                            response.data.forEach(error => {
                                                                this.setState({ preloader: false })
                                                                NotificationManager.error(error.message)
                                                            })
                                                        } else {
                                                            this.setState({ preloader: false })
                                                            NotificationManager.error(response.data.message)
                                                        }
                                                        if (response.status == 401){
                                                            CookieService.remove('token')
                                                            this.setState({ preloader: false })
                                                            this.props.history.push('/auth')
                                                        }
                                                    }
                                                )
                                            })
                                        }, response => {
                                            if (Array.isArray(response.data)) {
                                                response.data.forEach(error => {
                                                    this.setState({ preloader: false })
                                                    NotificationManager.error(error.message)
                                                })
                                            } else {
                                                this.setState({ preloader: false })
                                                NotificationManager.error(response.data.message)
                                            }
                                            if (response.status == 401){
                                                CookieService.remove('token')
                                                this.setState({ preloader: false })
                                                this.props.history.push('/auth')
                                            }
                                        }
                                    )
                                }, response => {
                                    if (Array.isArray(response.data)) {
                                        response.data.forEach(error => {
                                            this.setState({ preloader: false })
                                            NotificationManager.error(error.message)
                                        })
                                    } else {
                                        this.setState({ preloader: false })
                                        NotificationManager.error(response.data.message)
                                    }
                                    if (response.status == 401){
                                        CookieService.remove('token')
                                        this.setState({ preloader: false })
                                        this.props.history.push('/auth')
                                    }
                                }
                            )
                        })
                    }
                }

            }
        )

    }

    answerQuestions() {
        this.props.tribuneStore.personAnswers.map(async answer => {
            await this.props.tribuneStore.answerQuestion(
                answer.answerId,
                () => {},
                    response => {
                    if (Array.isArray(response.data)) {
                        response.data.forEach(error => {
                            this.setState({ preloader: false })
                            NotificationManager.error(error.message)
                        })
                    } else {
                        this.setState({ preloader: false })
                        NotificationManager.error(response.data.message)
                    }
                    if (response.status == 401){
                        CookieService.remove('token')
                        this.setState({ preloader: false })
                        this.props.history.push('/auth')
                    }
                }
            )

            if (answer.alternate !== ''){
                await this.props.tribuneStore.commentCreate(
                    answer.questionId,
                    answer.alternate,
                    () => {},
                        response => {
                        if (Array.isArray(response.data)) {
                            response.data.forEach(error => {
                                this.setState({ preloader: false })
                                NotificationManager.error(error.message)
                            })
                        } else {
                            this.setState({ preloader: false })
                            NotificationManager.error(response.data.message)
                        }
                        if (response.status == 401){
                            CookieService.remove('token')
                            this.setState({ preloader: false })
                            this.props.history.push('/auth')
                        }
                    }
                )
            }

        })
    }

    finishTest = () => {
        Promise.resolve(this.answerQuestions()).then(() => {
           this.props.tribuneStore.finishRevision(this.props.match.params.id,
               () => {
               this.setState({ finishStatistic: true })
               this.props.tribuneStore.getVoteStatistic(
                   this.props.match.params.id,
                   () => {

                   },response => {
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
           },response => {
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
           })
        })
    }

    render() {
        return (
            <div className="plate-wrapper plate-wrapper__height">

                {
                    this.state.preloader &&
                        <Preloader/>
                }

                <NotificationContainer/>

                <div style={{ marginBottom: 16 }}>
                    <Link style={{ color: '#0052A4' }} to={'/tribune'}>Текущие тесты/опросы</Link>
                    <span> -> </span>
                    <Link style={{ color: '#0052A4', borderBottom: '1px solid #0052A4' }}>Вопросы</Link>
                </div>

                <div className='question'>
                    {
                        this.props.tribuneStore.testList.map(test => {
                            return test.resource_id == this.props.match.params.id &&
                                <div className="theme">
                                    { test.name }
                                </div>
                        })
                    }
                    {
                        this.props.tribuneStore.questions.map((question, index) => {
                            return <>
                            <div className="question" key={index}>
                                { question.question }
                            </div>
                                <form className="question__form" onSubmit={this.nextQuestion}>
                                    {
                                        !!this.props.tribuneStore.answers &&
                                            this.props.tribuneStore.answers.map((answer, index) => {
                                                return  <div className='option'>
                                                        <p>
                                                            <input type={'radio'}
                                                                   className={'radio'}
                                                                   id={'input-' + index}
                                                                   name="radio-group"
                                                                   value={answer.resource_id}
                                                            />
                                                                <label htmlFor={'input-' + index}>{ answer.answer }</label>
                                                        </p>
                                                </div>
                                            })
                                    }

                                    {
                                        question.has_alternate_answer &&
                                        <div className="text">
                                            <label>
                                                <div className="title">Ваш комментарий:</div>
                                                <input type={'text'}
                                                       className={'input'}
                                                       ref={this.alternativeAnswerRef}
                                                       style={{
                                                           border: '1px solid #c4c4c4',
                                                           width: '100%',
                                                           height: 150
                                                       }}
                                                       id={'alternate-' + index}
                                                       name="radio-group"
                                                />
                                            </label>
                                        </div>
                                    }

                                    {
                                        parseInt(this.props.tribuneStore.questionsHeaders['x-pagination-current-page']) >=
                                        parseInt(this.props.tribuneStore.questionsHeaders['x-pagination-page-count']) ?
                                            <button type="submit" onClick={() => this.props.tribuneStore.isLastQuestion = true}>
                                                {
                                                    this.props.tribuneStore.questions[0].revision.type.resource_id == 83 ?
                                                        this.props.userStore.languageList["Завершить опрос"] || 'Завершить опрос' : this.props.userStore.languageList["Завершить тест"] || 'Завершить тест'
                                                }
                                            </button>
                                            :
                                            <button type="submit">{this.props.userStore.languageList["Ответить"] || 'Ответить'}</button>
                                    }
                                </form>
                            </>
                        })
                    }
                </div>
                {
                    this.state.finishStatistic &&
                    <div className={'finish-wrapper'}>
                        <div className={'finish-statistic'}>
                            {
                                this.props.tribuneStore.questions[0].revision.type.resource_id == 83 ?
                                    <>
                                <p>{this.props.userStore.languageList["Опрос завершен"] || 'Опрос завершен'}</p>
                                        <p>{this.props.userStore.languageList["Благодарим за внимание!"] || 'Благодарим за внимание!'}</p>
                                </>
                                    :
                                    <>
                                        <p>{this.props.userStore.languageList["Тест завершен"] || 'Тест завершен'}</p>
                                        <p>{ parseInt(this.props.tribuneStore.totalTestStatistic.valid_answers) / parseInt(this.props.tribuneStore.totalTestStatistic.total_questions) * 100 + '%' }</p>
                                        <Doughnut
                                            data={this.props.tribuneStore.getDoughnutVoteData()}
                                            options={{
                                                legend: {
                                                    display: false
                                                }
                                            }}
                                        />
                                        <p>{ this.props.tribuneStore.totalTestStatistic.is_passed ? 'Пройден' : 'Не пройден' } { dateFormat(new Date().toUTCString(), 'dd/mm/yyyy') }</p>
                                        <p>
                                            {
                                                this.props.tribuneStore.totalTestStatistic.valid_answers
                                                +
                                                '/'
                                                +
                                                this.props.tribuneStore.totalTestStatistic.total_questions
                                            }
                                        </p>
                                    </>
                            }
                            <Link to={'/tribune'}>{this.props.userStore.languageList["Продолжить"] || 'Продолжить'}</Link>
                        </div>
                    </div>
                }
            </div>
        )
    }
}))


export default inject('tribuneStore', 'userStore', 'permissionsStore')(observer(Tribune));