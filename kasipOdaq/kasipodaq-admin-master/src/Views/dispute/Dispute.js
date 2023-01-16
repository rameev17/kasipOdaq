import React, {Component} from 'react';
import Layout from "../Containers/Layout";
import {Route, Switch} from "react-router";
import DisputeMenu from "./DisputeMenu";
import DisputeEvents from './DisputeEvents'
import PpoList from './PpoList'
import DisputeDirection from "./DisputeDirection";
import DisputeDirectionInfo from "./DisputeDirectionInfo";
import DisputeDirectionInfoCategories from "./DisputeDirectionInfoCategories";
import DisputeTheme from "./DisputeTheme";
import DisputeThemeAdd from "./DisputeThemeAdd";
import ArticleAdd from "../legalFramework/ArticleAdd";
import {inject, observer} from "mobx-react";
import OpoList from "./OpoList";
import FilialPpoList from "./FilialPpoList";
import TopPpoList from "./TopPpoList";
import DisputeDirectionList from "./DisputeDirectionList";
import OpoDisputeList from "./OpoDisputeList";
import DisputeSingleInfo from "./DisputeSingleInfo";

class Dispute extends Component {

    constructor(props){
        super(props)
    }

    state = {
        role: ''
    }

    componentDidMount() {
        this.setState({role: this.role})
    }

    render() {
        return (
            <Layout title='Трудовой спор'>
                <Switch>
                    {
                        this.props.userStore.role == 'fprk' &&
                        <Route exact path='/dispute'
                               render={props => (<OpoList {...props} />)}/>
                    }
                    {
                        this.props.userStore.role == 'industry' &&
                        <Route exact path='/dispute'
                               render={props => (<PpoList {...props} />)}/>
                    }
                    {
                        this.props.userStore.role == 'company' &&
                        <Route exact path='/dispute'
                               render={props => (<DisputeDirectionList {...props} />)}/>
                    }
                    {
                        this.props.userStore.role == 'branch' &&
                        <Route exact path='/dispute'
                               render={props => (<FilialPpoList {...props} />)}/>
                    }
                    {
                        this.props.userStore.role == 'association' &&
                        <Route exact path='/dispute'
                               render={props => (<TopPpoList{...props} />)}/>
                    }
                    <Route exact path='/dispute/list/categories/:id'
                           render={props => (<DisputeDirectionList {...props} />)}/>
                    <Route exact path='/dispute/list/:id'
                           render={props => (<DisputeDirection {...props} />)}/>
                    <Route exact path='/dispute/ppo/:id'
                           render={props => (<PpoList{...props} />)}/>
                    <Route exact path='/dispute/list/opo/:id'
                           render={props => (<OpoDisputeList{...props} />)}/>
                    <Route exact path='/dispute/info'
                           render={props => (<DisputeDirectionInfoCategories {...props} />)}/>
                    <Route path='/dispute/info/:id' render={
                        props => this.props.permissionsStore.renderComponent("article", "edit", <DisputeDirectionInfo {...props}/>)
                    }/>
                    <Route exact path='/dispute/add-dispute/:id'
                           render={props => (<DisputeThemeAdd {...props} />)}/>

                    <Route exact path='/dispute/edit/:id'
                           render={props => (<DisputeTheme {...props} />)}/>
                    <Route exact path='/dispute/:id'
                           render={props => (<DisputeSingleInfo {...props} />)}/>
                </Switch>
            </Layout>
        );
    }
}

export default inject('permissionsStore', 'userStore')(observer(Dispute));