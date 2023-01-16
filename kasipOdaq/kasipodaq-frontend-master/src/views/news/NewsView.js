import React, {Component} from 'react';
import Layout from '../../fragments/layout/Layout'
import TabsLayout from "../../fragments/tabsLayout/TabsLayout";
import NewsList from './NewsList'
import NewsListSingle from './NewsListSingle'
import NewsEvents from "./NewsEventsView";
import NewsEventsSingle from "./NewsEventsSingle";
import {Route, Switch} from 'react-router-dom';

import './style.scss'
import AllNews from "./AllNews";
import CookieService from "../../services/CookieService";
import {inject, observer} from "mobx-react";
import {NotificationContainer, NotificationManager} from 'react-notifications';
class News extends Component {

    state = {
        role:'',
        isAuth: false
    }

    componentDidMount() {
        this.props.userStore.profileInfo(() => {

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

    render() {

        return (
            <Layout title='Новости'>
                <div className="news-list">
                    <Switch>
                        {
                            this.props.userStore.profile.union?.resource_id ?
                                <Route exact path='/news' render={props => (<NewsList {...props}/>)}/>
                                :
                                <Route exact path='/news' render={props => (<AllNews {...props}/>)}/>
                        }
                        <Route exact path='/news/all' render={props => (<AllNews {...props}/>)}/>
                        <Route exact path='/news/:id' render={props => (<NewsListSingle {...props}/>)}/>
                        <Route exact path='/news-events' render={props => (<NewsEvents {...props}/>)}/>
                        <Route exact path='/news-events/:id' render={props => (<NewsEventsSingle {...props}/>)}/>
                    </Switch>
                </div>
            </Layout>
        )
    }
}

export default inject('userStore')(observer(News))