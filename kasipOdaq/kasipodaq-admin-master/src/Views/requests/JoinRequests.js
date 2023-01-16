import React, {Component} from 'react';
import TabsLayout from "../Containers/TabsLayout";
import {Route, Switch} from "react-router";
import {Link, withRouter} from 'react-router-dom'
import JoinRequestsNew from './JoinRequestsNew'
import JoinRequestsDeclined from './JoinRequestsDeclined'
import JoinRequest from "./JoinRequest"
import UnionRequest from "./UnionRequest";
import {inject} from "mobx-react";

class JoinRequests extends Component {

    state = {
        tabs: [
            {name: this.props.userStore.languageList["Новые заявки"] || 'Новые заявки' },
            {name: this.props.userStore.languageList["Отклоненные заявки"] || 'Отклоненные заявки' }
        ],
    };


    componentDidMount() {
    }

    changeTabCallback = (tab) => {
        switch (tab) {
            case '1':
                this.props.history.push({
                    pathname:`/requests`,
                    state: { tabId: 1 }
                });
                break;
            case '2':
                this.props.history.push({
                    pathname:`/requests/declined`,
                    state: { tabId: 2 }
                });
                break;
            default:
                this.props.history.push({
                    pathname:`/requests`,
                    state: { tabId: 1 }
                })
        }
    };

    render() {

        return (
            <React.Fragment>

                <div className="panel">
                    <TabsLayout changeTabCallback={this.changeTabCallback}
                                tabs={this.state.tabs}>
                        <Switch>
                            <Route exact path='/requests' render={props => (<JoinRequestsNew {...props}/>)}/>
                            <Route exact path='/requests/declined' render={props => (<JoinRequestsDeclined {...props}/>)}/>
                            <Route exact path='/requests/person/:id' render={props => (<UnionRequest {...props}/>)}/>

                        </Switch>
                    </TabsLayout>
                </div>
            </React.Fragment>

        );
    }
}


export default inject('userStore')(withRouter(JoinRequests));