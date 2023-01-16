import React, {Component} from 'react';
import Layout from "../Containers/Layout";
import {Route, Switch} from "react-router";
import TabsLayout from "../Containers/TabsLayout";
import LaborProtection from "./LaborProtection";
import Council from "./Council";
import CouncilEdit from "./CouncilEdit";
import Ppo from "./Ppo";
import PpoList from './PpoList'
import {inject, observer} from "mobx-react";

class Biot extends Component {

    constructor(props){
        super(props);

        this.state = {

        };

        this.changeTabCallback = this.changeTabCallback.bind(this)
    }

    componentDidMount() {

    }

    changeTabCallback = (tab) => {
        switch (tab) {
            case '1':
                this.props.history.push({
                    pathname:`/biot`,
                    state: { tabId: 1 }
                });
                break;
            case '2':
                this.props.history.push({
                    pathname:`/biot/council`,
                    state: { tabId: 2 }
                });
                break;
            default:
                this.props.history.push({
                    pathname:`/biot`,
                    state: { tabId: 1 }
                })
        }
    };

    render() {

        const tabs =  [
            {name: this.props.userStore.languageList['Охрана труда'] || 'Охрана труда'},
            {name: this.props.userStore.languageList['Производственный Совет'] || 'Производственный совет'}
        ];

        return (
            <Layout title='БиОТ'>
                <div className="content">
                    <h1 className="title">{this.props.userStore.languageList["Безопасность и охрана труда"] || 'Безопасность и охрана труда'}</h1>
                    <div className="panel">
                        <TabsLayout tabs={tabs}
                                    changeTabCallback={this.changeTabCallback}>
                            <Switch>
                                <Route exact path='/biot'
                                       render={props => (<LaborProtection {...props} />)}/>
                                <Route exact path='/biot/opo/:id'
                                       render={props => (<PpoList {...props} />)}/>
                                <Route exact path='/biot/ppo/:id'
                                       render={props => (<Ppo {...props} />)}/>
                                <Route exact path='/biot/council'
                                       render={props => (<Council {...props} />)}/>
                                <Route exact path='/biot/council/edit'
                                       render={props => (<CouncilEdit {...props} />)}/>
                            </Switch>
                        </TabsLayout>
                    </div>

                </div>
            </Layout>
        );
    }
}

export default inject('userStore', 'permissionsStore')(observer(Biot));