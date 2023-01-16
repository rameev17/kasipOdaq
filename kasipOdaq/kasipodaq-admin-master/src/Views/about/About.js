import React, {Component} from 'react';
import Layout from "../Containers/Layout";
import {Route, Switch} from "react-router";
import AboutMenu from "./AboutMenu";
import Regulations from "./Regulations";
import Divisions from "./Divisions";
import Direction from './Direction';
import PersonEdit from './PersonEdit';
import PersonAdd from './PersonAdd';
import AboutHistory from './AboutHistory';
import Activity from './Activity';
import './index.scss';
import {inject, observer} from "mobx-react";

class About extends Component {

    constructor(props){
        super(props)

        this.state = {
            preloader: false,
        }
    }

    render() {

        return (
            <Layout title={this.props.userStore.languageList["О Федерации"] || 'О Федерации'}>
                <Switch>
                    <Route exact path='/about'
                           render={props => (<AboutMenu {...props} role={this.state.role}/>)}/>
                    <Route exact path='/about/regulations'
                           render={props => (<Regulations {...props} role={this.state.role}/>)}/>
                    <Route path='/about/divisions/:division'
                           render={props => (<Divisions {...props} role={this.state.role}/>)}/>
                    <Route exact path='/about/direction'
                           render={props => (<Direction {...props} role={this.state.role}/>)}/>
                    <Route exact path='/about/direction/person/:id'
                           render={props => (<PersonEdit {...props} role={this.state.role}/>)}/>
                    <Route exact path='/about/direction/add'
                           render={props => (<PersonAdd {...props} role={this.state.role}/>)}/>
                    <Route exact path='/about/history'
                           render={props => (<AboutHistory/>)}/>
                    <Route exact path='/about/activity'
                           render={props => (<Activity/>)}/>
                </Switch>
            </Layout>
        );
    }
}

export default inject('userStore')(observer(About));