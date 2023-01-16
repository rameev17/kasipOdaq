import React, {Component} from 'react';
import TabsLayout from "../Containers/TabsLayout";
import {Route, Switch} from "react-router";
import {Link, withRouter} from 'react-router-dom'
import UnionRequestsNew from './UnionRequestsNew'
import UnionRequestsDeclined from './UnionRequestsDeclined'
import UnionRequest from "./UnionRequest"
import {inject} from "mobx-react";

class CreateUnionRequests extends Component {

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
                    pathname: `/create`,
                    state: { tabId: 1 }
                });
                break;
            case '2':
                this.props.history.push({
                    pathname: `/create/declined`,
                    state: { tabId: 2 }
                });
                break;
            default:
                this.props.history.push({
                    pathname: `/create`,
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
                            <Route exact path='/create' render={props => (<UnionRequestsNew {...props}/>)}/>
                            <Route exact path='/create/declined' render={props => (<UnionRequestsDeclined {...props}/>)}/>
                            <Route exact path='/create/person/:id' render={props => (<UnionRequest {...props}/>)}/>
                        </Switch>
                    </TabsLayout>
                </div>
            </React.Fragment>

        );
    }
}

export default inject('userStore')(withRouter(CreateUnionRequests));