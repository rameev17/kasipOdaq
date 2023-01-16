import React, {Component} from 'react';
import Layout from "../Containers/Layout";
import {Route, Switch} from "react-router";
import SectionsList from "./SectionsList";
import ChaptersList from "./ChaptersList";
import ArticlesList from "./ArticlesList";
import ArticleAdd from "./ArticleAdd";
import ArticleEdit from "./ArticleEdit";
import TypeList from "./TypeList";
import {inject, observer} from "mobx-react";
import FaqRequestAdd from "../appeal/FaqRequestAdd";

class LegalFramework extends Component {

    constructor(props){
        super(props)

        this.state = {

        }
    }

    componentDidMount() {

    }

    render() {
        return (
            <Layout title='Законодательная база'>
                <Switch>
                    <Route exact path='/legals' render={props => (<TypeList {...props} />)}/>

                    <Route exact path='/legals/chapter/:id' render={props => (<ChaptersList {...props}/>)}/>
                    <Route exact path='/legals/articles/:id' render={props => (<ArticlesList{...props}/>)}/>
                    <Route path='/legals/articles/edit/:id' render={
                        props => this.props.permissionsStore.renderComponent("legislation", "edit", <ArticleEdit {...props}/>)
                    }/>
                    <Route path='/legals/create' render={
                        props => this.props.permissionsStore.renderComponent("legislation", "create", <ArticleAdd {...props}/>)
                    }/>
                    <Route path='/legals/:id/create' render={
                        props => this.props.permissionsStore.renderComponent("legislation", "create", <ArticleAdd {...props}/>)
                    }/>
                    <Route exact path='/legals/:id' render={props => (<SectionsList {...props}/>)}/>
                </Switch>
            </Layout>
        );
    }
}

export default inject('permissionsStore')(observer(LegalFramework));