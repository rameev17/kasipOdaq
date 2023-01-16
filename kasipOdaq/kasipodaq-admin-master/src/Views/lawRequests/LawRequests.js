import React, {Component} from 'react';
import TabsLayout from "../Containers/TabsLayout";
import {Route, Switch} from "react-router";
import {withRouter} from 'react-router-dom'
import RequestsList from './RequestsList'
import FaqRequests from './FaqRequests'
import RequestSingle from './RequestSingle'
import FaqRequestEdit from './FaqRequestEdit'
import FaqRequestAdd from '../lawRequests/FaqRequestAdd'
import Layout from "../Containers/Layout";

import './index.scss'
import {inject, observer} from "mobx-react";

class LawRequests extends Component {

    constructor(props) {
        super(props);

        this.state = {
            tabs: [
                {name: this.props.userStore.languageList["Обращение в юридическую помощь"] || 'Обращение в юридическую помощь'},
                {name: this.props.userStore.languageList["FAQ"] || 'FAQ'}
            ]
        };

        this.changeTabCallback = this.changeTabCallback.bind(this)

    }

    changeTabCallback = (tab) => {
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
    };

    render() {
        return (
            <Layout>
                <div className="content">
                    <h1 className='title'>{this.props.userStore.languageList["Юридическая помощь"] || 'Юридическая помощь'}</h1>
                    <div className="panel">
                        <TabsLayout tabs={this.state.tabs}
                                    changeTabCallback={this.changeTabCallback}>
                            <Switch>
                                <Route exact path='/law-requests' render={props => (<RequestsList {...props}/>)}/>
                                <Route path='/law-requests/request/:id' render={
                                    props => this.props.permissionsStore.renderComponent("appeal", "answer", <RequestSingle {...props}/>)
                                }/>
                                <Route path='/law-requests/faq/add' render={
                                    props => this.props.permissionsStore.renderComponent("faq", "create", <FaqRequestAdd {...props}/>)
                                }/>
                                <Route path='/law-requests/faq/:id/edit' render={
                                    props => this.props.permissionsStore.renderComponent("faq", "edit", <FaqRequestEdit {...props}/>)
                                }/>
                                <Route path='/law-requests/faq' render={
                                    props => this.props.permissionsStore.renderComponent("faq", "get_list", <FaqRequests {...props}/>)
                                }/>

                            </Switch>
                        </TabsLayout>
                    </div>
                </div>
            </Layout>
        );
    }
}

export default withRouter(inject('permissionsStore', 'userStore')(observer(LawRequests)));