import React, {Component} from 'react';
import Layout from "../../fragments/layout/Layout";
import Ticket from "../../fragments/ticket/Ticket";

import './style.scss';
import { Switch, Link, Route, Redirect } from 'react-router-dom';
import TabsLayout from "../../fragments/tabsLayout/TabsLayout";


import CreateTicket from '../createTIcket/CreateTicketView';
import {Scrollbars} from 'react-custom-scrollbars';
import {ReactComponent as ClipIcon} from '../../assets/icons/clip.svg';
import {ReactComponent as PlusIcon} from '../../assets/icons/plus.svg';
import {inject, observer} from "mobx-react";
import {NotificationContainer, NotificationManager} from 'react-notifications';
import CookieService from "../../services/CookieService";

class Help extends Component {
    constructor(props){
    super(props)

        this.state = {
            tabs: [
                {
                    name: this.props.userStore.languageList["Запросы"] || 'Запросы'
                },
                {
                    name: this.props.userStore.languageList["ЧаВО"] || 'ЧаВО'
                }
            ],
        }

        this.changeTabCallback = this.changeTabCallback.bind(this)

    }

    changeTabCallback = (tab) => {
        switch (tab) {
            case '1':
                this.props.history.push({
                    pathname: '/help',
                    state: { tabId: 1 }
                })
                break;
            case '2':
                this.props.history.push({
                    pathname: '/help/faq',
                    state: { tabId: 2 }
                })
                break;
            default:
                this.props.history.push({
                    pathname: '/help',
                    state: { tabId: 1 }
                })
        }
    }

    render() {
        return (

            <Layout title='Юридическая помощь'>
                <Scrollbars onUpdate={this.handleUpdate}>
                    <TabsLayout changeTabCallback={this.changeTabCallback}
                                tabs={this.state.tabs}
                                history={this.props.history.location.pathname}
                    >
                        <Switch>
                            <Route exact path='/help' render={props => {return <Requests {...props}
                                                                                         getRequests={this.props.getRequests}
                                                                                         requests={this.state.requests}
                                                                                         xPaginationCurrentPage={this.state.xPaginationCurrentPage}/>}}/>
                            <Route exact path='/help/faq' render={props => {return <Faq {...props}
                                                                                        getRequests={this.props.getFaqRequests}
                                                                                        requests={this.state.faqRequests}/>}}/>
                        </Switch>
                    </TabsLayout>
                </Scrollbars>
            </Layout>
        );
    }
}

const Requests = inject('appealStore', 'userStore', 'permissionsStore')(observer(class Requests extends Component{

    constructor(props) {
        super(props);

        this.state = {
            tabs: [
                {
                    name: this.props.userStore.languageList["Запросы"] || 'Запросы'
                },
                {
                    name: this.props.userStore.languageList["ЧаВО"] || 'ЧаВО'
                }
            ],
        }

        this.changeTabCallback = this.changeTabCallback.bind(this)
    }

    createTicket = () => {
        this.props.history.push('/help/create-ticket')
    }

    changeTabCallback = (tab) => {
        switch (tab) {
            case '1':
                this.props.history.push({
                    pathname: '/help',
                    state: { tabId: 1 }
                })
                break;
            case '2':
                this.props.history.push({
                    pathname: '/help/faq',
                    state: { tabId: 2 }
                })
                break;
            default:
                this.props.history.push({
                    pathname: '/help',
                    state: { tabId: 1 }
                })
        }
    }

    render(){
        return(
            <div className='requests'>
                <Ticket type={3}/>
                <button className="send-request" onClick={this.createTicket}>{this.props.userStore.languageList["Подать обращение"] || 'Подать обращение'}</button>
            </div>
        )
    }
}))

const Faq = inject('faqStore', 'userStore', 'permissionsStore')(observer(class Faq extends Component{

    constructor(props) {
        super(props);

        this.state = {
            preloader: true
        }
    }

    componentDidMount() {
        this.props.faqStore.loadFaqList(() => {
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
        })
    }

    render(){

        return(
            <div className="plate-wrapper plate-wrapper__height">
                <div className='faq'>
                   <h3>{this.props.userStore.languageList["Часто задаваемые вопросы"] || 'Часто задаваемые вопросы'}</h3>
                    {
                        this.props.faqStore.faqList.map(faq => {
                            return <Question faq={faq} />
                        })
                    }

                </div>
            </div>
        )
    }
}))

const Question = inject('faqStore', 'permissionsStore')(observer(class Question extends Component{

    constructor(props) {
        super(props);

        this.state = {
            expanded: false
        }

        this.expand = this.expand.bind(this)
    }

    expand() {
        this.setState({expanded: !this.state.expanded})
    }

    render(){

        return(
            <div className='question-item' onClick={this.expand}>
                <div className="question">
                    {this.props.faq.question}
                    <div className={"icon is-active"}>
                        <PlusIcon/>
                    </div>
                </div>

                {
                    this.state.expanded &&
                    <div className="answer" dangerouslySetInnerHTML={{ __html: this.props.faq.answer }}>
                    </div>
                }

            </div>
        )
    }
}))

export default inject('userStore')(observer(Help))