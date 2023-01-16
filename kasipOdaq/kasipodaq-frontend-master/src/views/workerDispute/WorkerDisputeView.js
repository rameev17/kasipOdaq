import React, {Component} from 'react';
import Layout from "../../fragments/layout/Layout";
import TabsLayout from "../../fragments/tabsLayout/TabsLayout";
import {Switch, Redirect, Route, Link} from 'react-router-dom'

import {ReactComponent as LeftArrowIcon} from '../../assets/icons/arrow.svg'

import './style.scss'
import {inject, observer} from "mobx-react";
import {NotificationContainer, NotificationManager} from 'react-notifications';
import Preloader from "../../fragments/preloader/Preloader";
import CookieService from "../../services/CookieService";
const dateFormat = require('dateformat');

class WorkerDispute extends Component {

    state = {

    }

    render() {

        return (
            <Layout title='Трудовой спор'>
                <Switch>
                    <Route exact path='/dispute' render={props => {return <DisputeMenu {...props} />}}/>
                    <Route exact path='/dispute/info' render={props => (
                        <InfoCategory {...props} info={this.state.info}
                                      categories={this.props.categories}
                                      title={this.state.title}/>
                    )}/>
                    <Route exact path='/dispute/list/:id' render={props => (
                        <QuestionsList {...props} themes={this.state.themes}/>
                    )}/>

                    <Route exact path='/dispute/info/:id' render={props => (
                        <Info {...props} info={this.state.info}
                              categories={this.props.categories}
                              title={this.state.title}/>
                    )}/>
                </Switch>
            </Layout>
        );
    }
}

const DisputeMenu = inject('disputeStore', 'userStore', 'permissionsStore')(observer(class DisputeMenu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            preloader: true,
        }

    }

    componentDidMount() {
        this.props.disputeStore.loadDisputeCategory(() => {
            this.setState({ preloader: false })
        })
    }

    render() {

        return (
            <div className="plate-wrapper plate-wrapper__height">
                <div className='menu-dispute'>
                    <ul>
                        {
                            this.props.disputeStore.categoryDispute.map((category, index) => {
                                return  <li key={index}>
                                    <Link to={`/dispute/list/` + category.resource_id }>
                                        <div className="menu-dispute__link">{ this.props.userStore.languageList[category.name] || category.name }</div>
                                        <div className="icon">
                                            <LeftArrowIcon/>
                                        </div>
                                    </Link>
                                </li>
                            })
                        }

                    </ul>
                </div>
            </div>

        )
    }
}))

const InfoCategory = inject('infoStore', 'permissionsStore')(observer(class InfoCategory extends Component {
    constructor(props) {
        super(props);

        this.state = {
            preloader: true,
        }
    }

    componentDidMount() {
        this.props.infoStore.loadCategoryInfoDispute(() => {
            this.setState({ preloader: false })
        })
    }

    render() {

        return (
            <div className="plate-wrapper plate-wrapper__height">
                <div className='menu-dispute'>
                    <ul>
                        {
                            this.props.infoStore.disputeInfoCategory.map((category, index) => {
                                return  <li key={index}>
                                    <Link to={`/dispute/info/` + category.resource_id }>
                                        <div className="menu-dispute__link">{ category.name }</div>
                                        <div className="icon">
                                            <LeftArrowIcon/>
                                        </div>
                                    </Link>
                                </li>
                            })
                        }

                    </ul>
                </div>
            </div>

        )
    }
}))

class QuestionsList extends Component{

    render(){

        return(
            <div className='question-list'>
                <Question {...this.props}/>
            </div>
        )
    }
}

const Question = inject('disputeStore', 'userStore', 'permissionsStore')(observer(class Question extends Component {
    constructor(props) {
        super(props);

        this.state = {
            preloader: true,
            tabs: [
                {
                    name: this.props.userStore.languageList["Споры"] || 'Споры'
                },
                {
                    name: this.props.userStore.languageList["Информация"] || 'Информация'
                }
            ],
        }

        this.changeTabCallback = this.changeTabCallback.bind(this)

    }

    componentDidMount() {
        this.props.disputeStore.loadDisputeList(this.props.match.params.id,data => {
            this.setState({preloader: false})

            this.props.disputeStore.disputeResolved = data.resolved
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

        this.props.disputeStore.loadDisputeCategory(() => {
            this.setState({ preloader: false })
        })
    }

    changeTabCallback = (tab) => {
        switch (tab) {
            case '1':
                this.props.history.push({
                    pathname: `/dispute/list/` + this.props.match.params.id,
                    state: { tabId: 1 }
                })
                break;
            case '2':
                this.props.history.push({
                    pathname: `/dispute/info/` + this.props.match.params.id,
                    state: { tabId: 2 }
                })
                break;
            default:
                this.props.history.push({
                    pathname: `/dispute/list/` + this.props.match.params.id,
                    state: { tabId: 1 }
                })
        }
    }

    render() {

        return (
            <div>
                <TabsLayout changeTabCallback={this.changeTabCallback}
                            tabs={this.state.tabs}
                            history={this.props.history.location.pathname}
                >
                    <div className="plate-wrapper">
                        {
                            this.state.preloader &&
                            <Preloader/>
                        }

                        <NotificationContainer/>

                        <div style={{ marginBottom: 16 }}>
                            <Link style={{ color: '#0052A4' }} to={'/dispute'}>{this.props.userStore.languageList['Все категории'] || 'Все категории'}</Link>
                            <span> -> </span>
                            <Link style={{ color: '#0052A4', borderBottom: '1px solid #0052A4' }}>
                                {
                                    this.props.disputeStore.categoryDispute.map(category => {
                                        return this.props.match.params.id == category.resource_id ? this.props.userStore.languageList[category.name] || category.name : ''
                                    })
                                }
                            </Link>
                        </div>

                        {
                            this.props.disputeStore.disputeList.map((dispute, index) => {
                                return <div className =
                                                {
                                                    'question' +
                                                    ( dispute.resolved ? ' closed' : ' opened')
                                                }
                                            onClick={this.solutionShow}
                                >
                                    <div className="header">
                                        <div className="theme">
                                            { dispute.title }
                                        </div>
                                        <div className="dates">
                                            <div className="date start">{this.props.userStore.languageList["Начало:"] || 'Начало:'} { dateFormat(dispute.start_date, 'dd.mm.yyyy') }</div>
                                            {dispute.resolved &&
                                            <div className='date finish'>{this.props.userStore.languageList["Конец:"] || 'Конец:'}  { dateFormat(dispute.finish_date, 'dd.mm.yyyy') }</div>
                                            }
                                        </div>
                                    </div>
                                    <div className="question__description" dangerouslySetInnerHTML={{__html: dispute.thesis}}>
                                    </div>
                                    {
                                        dispute.resolved &&
                                        <div className='more'>
                                            <div className="decision">
                                                <p className="sub-title">{this.props.userStore.languageList["Решение:"] || 'Решение:'} </p>
                                                <div className="text" dangerouslySetInnerHTML={{__html: dispute.solution}}>
                                                </div>
                                            </div>
                                        </div>
                                    }

                                </div>
                            })
                        }
                    </div>
                </TabsLayout>
            </div>
        )
    }
}))

const Info = inject('infoStore', 'permissionsStore', 'userStore', 'disputeStore')(observer(class Info extends Component {

    constructor(props){
        super(props)

        this.state = {
            preloader: true,
            tabs: [
                {
                    name: this.props.userStore.languageList["Споры"] || 'Споры'
                },
                {
                    name: this.props.userStore.languageList["Информация"] || 'Информация'
                }
            ],
        }

        this.changeTabCallback = this.changeTabCallback.bind(this)

    }

    componentDidMount() {
        this.props.infoStore.loadInfo(this.props.match.params.id, this.props.infoStore.INFO_KEY_DISPUTE,null, data => {

            this.setState({preloader: false})
            if (data[0] !== undefined){
                this.props.infoStore.infoDispute = data[0].content
            }

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

        this.props.disputeStore.loadDisputeCategory(() => {
            this.setState({ preloader: false })
        })

    }

    changeTabCallback = (tab) => {
        switch (tab) {
            case '1':
                this.props.history.push({
                    pathname: `/dispute/list/` + this.props.match.params.id,
                    state: { tabId: 1 }
                })
                break;
            case '2':
                this.props.history.push({
                    pathname: `/dispute/info/` + this.props.match.params.id,
                    state: { tabId: 2 }
                })
                break;
            default:
                this.props.history.push({
                    pathname: `/dispute/list/` + this.props.match.params.id,
                    state: { tabId: 1 }
                })
        }
    }

    render() {

        return (
            <div>
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

                        <div className='info'>
                            <h1 className="title">
                                {
                                    this.props.disputeStore.categoryDispute.map(category => {
                                        return this.props.match.params.id == category.resource_id ? this.props.userStore.languageList[category.name] || category.name : ''
                                    })
                                }
                            </h1>
                            <div className="text" dangerouslySetInnerHTML={{__html: this.props.infoStore.infoDispute}}>
                            </div>
                        </div>
                    </div>
                </TabsLayout>
            </div>
        )
    }
}))


export default inject('disputeStore', 'permissionsStore')(observer(WorkerDispute));