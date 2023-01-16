import React, {Component} from 'react';
import TabsLayout from "../Containers/TabsLayout";
import {Route, Switch} from "react-router";
import {withRouter} from 'react-router-dom'
import RequestsList from './RequestsList'
import RequestSingle from './RequestSingle'
import Layout from "../Containers/Layout";

import './index.scss'
import {inject, observer} from "mobx-react";

class SupportRequests extends Component {
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
                    <h1 className='title'>{this.props.userStore.languageList["Техническая служба поддержки"] || 'Техническая служба поддержки'}</h1>
                    <div className="panel">
                        <Switch>
                            <Route exact path='/support' render={props => (<RequestsList {...props}/>)}/>
                            <Route path='/support/request/:id' render={
                                props => this.props.permissionsStore.renderComponent("appeal", "answer", <RequestSingle {...props}/>)
                            }/>
                        </Switch>
                    </div>
                </div>
            </Layout>
        );
    }
}

export default withRouter(inject('permissionsStore', 'userStore')(observer(SupportRequests)));