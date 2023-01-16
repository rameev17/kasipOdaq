import React, {Component} from 'react';
import Layout from "../Containers/Layout";
import Events from './Events'
import Opo from "./Opo";
import {Route, Switch, withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import EventsList from "./EventsList";
import EventAdd from "./EventAdd";
import EventEdit from "./EventEdit";
import './index.scss'
import Filial from "./Filial";
import NewsList from "./NewsList";
import NewsEdit from "./NewsEdit";
import NewsAdd from "./NewsAdd";
import {inject, observer} from "mobx-react";
import PpoNews from "./PpoNews";
import NewsSingle from "./NewsSingle";

class News extends Component {

    constructor(props){
        super(props)

        this.state = {

        }
    }

    componentDidMount() {
        this.props.permissionsStore.loadPermissions(() => {

        })
    }

    render() {

        return (
            <Layout title='Новости'>
                <Events/>
                {/*<Opo/>*/}
                <Switch>

                    {
                        this.props.userStore.role == 'branch' ?
                            this.props.permissionsStore.hasPermission('news', 'get_list') &&
                            <Route exact path='/news' render={props => (<Filial {...props} />)}/>
                            :
                            this.props.permissionsStore.hasPermission('news', 'get_list') &&
                            <Route exact path='/news' render={props => (<NewsList {...props} />)}/>
                    }
                    {
                            this.props.permissionsStore.hasPermission('news', 'get_list') &&
                            <Route exact path='/news/events/:id' render={props => (<EventsList {...props} />)}/>
                    }
                    {
                        this.props.permissionsStore.hasPermission('news', 'get_list') &&
                        <Route exact path='/news/events/opo/:id' render={props => (<Opo {...props} />)}/>
                    }
                    {
                        this.props.permissionsStore.hasPermission('news', 'get_list') &&
                        <Route exact path='/news/:id' render={props => (<NewsSingle {...props} />)}/>
                    }
                    <Route exact path='/news/top/:id' render={props => (<PpoNews {...props} />)}/>
                    {
                        this.props.permissionsStore.hasPermission('news', 'create') &&
                        <Route exact path='/news/article/add' render={props => (<NewsAdd {...props} />)}/>
                    }
                    {
                        this.props.permissionsStore.hasPermission('news', 'edit') &&
                        <Route exact path='/news/article/:id/edit' render={props => (<NewsEdit {...props} />)}/>
                    }
                </Switch>
            </Layout>
        );
    }
}

export default inject('permissionsStore', 'userStore')(observer(News));