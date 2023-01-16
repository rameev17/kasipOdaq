import React, {Component} from 'react';
import TabsLayout from "../Containers/TabsLayout";
import {Route, Switch} from "react-router";
import {withRouter} from 'react-router-dom'
import RequestsList from './RequestsList'
import FaqRequests from './FaqRequests'
import RequestSingle from './RequestSingle'
import FaqRequestEdit from './FaqRequestEdit'
import FaqRequestAdd from '../appeal/FaqRequestAdd'
import Layout from "../Containers/Layout";

import './index.scss'
import {inject, observer} from "mobx-react";
import Biot from "../biot";

class YntymaqRequests extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tabs: [
                {name: 'Обращение в ФПРК'},
                {name: 'FAQ'}
            ]
        };

        this.changeTabCallback = this.changeTabCallback.bind(this)

    }

    changeTabCallback(tab) {
        switch (tab) {
            case '1':
                this.props.history.push({
                    pathname: `/law-requests`,
                    state: { tabId: 1 }
                });
                break;
            case '2':
                this.props.history.push({
                    pathname: `/law-requests/faq`,
                    state: { tabId: 2 }
                });
                break;
            default:
                this.props.history.push({
                    pathname: `/law-requests`,
                    state: { tabId: 1 }
                })
        }
    }

    render() {
        return (
            <Layout>
                <div className="content">
                    <h1 className='title'>{this.props.userStore.languageList["Обращения"] || 'Обращения'}</h1>
                    <div className="panel">
                        <Switch>
                            <Route exact path='/appeal' render={props => (<RequestsList {...props}/>)}/>
                            <Route path='/appeal/request/:id' render={
                                props => this.props.permissionsStore.renderComponent("appeal", "answer", <RequestSingle {...props}/>)
                            }/>
                            <Route exact path='/appeal/faq' render={props => (<FaqRequests {...props}/>)}/>
                            <Route path='/appeal/faq/add' render={
                                props => this.props.permissionsStore.renderComponent("appeal", "create", <FaqRequestAdd {...props}/>)
                            }/>
                            <Route path='/appeal/request/:id/edit' render={
                                props => this.props.permissionsStore.renderComponent("appeal", "edit", <FaqRequestEdit {...props}/>)
                            }/>
                        </Switch>
                    </div>
                </div>
            </Layout>
        );
    }
}

export default withRouter(inject('permissionsStore', 'userStore')(observer(YntymaqRequests)));