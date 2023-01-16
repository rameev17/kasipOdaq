import React, {Component} from 'react';
import TabsLayout from "../Containers/TabsLayout";
import {Route, Switch} from "react-router";
import {withRouter} from 'react-router-dom'
import FprkRequestsList from './FprkRequestsList'
import FprkFaqRequests from './FprkFaqRequests'
import FprkFaqRequestAdd from './FprkFaqRequestAdd'
import FprkFaqRequestEdit from './FprkFaqRequestEdit'
import RequestSingle from './RequestSingle'

class FprkRequests extends Component {

    state = {
        tabs: [
            {name: 'Обращение в ФПРК'},
            {name: 'FAQ'}
        ]
    };

    changeTabCallback = (tab) => {
        switch (tab) {
            case '1':
                this.props.history.push({
                    pathname: `/requests`,
                    state: { tabId: 1 }
                });
                break;
            case '2':
                this.props.history.push({
                    pathname: `/requests/faq`,
                    state: { tabId: 2 }
                });
                break;
            default:
                this.props.history.push({
                    pathname: `/requests`,
                    state: { tabId: 1 }
                })
        }
    };

    render() {
        return (
            <React.Fragment>
                <h1 className='title'>Обращения</h1>
                <div className="panel">
                    <TabsLayout tabs={this.state.tabs}
                                changeTabCallback={this.changeTabCallback}>
                        <Switch>
                            <Route exact path='/requests' render={props => (<FprkRequestsList {...props}/>)}/>
                            <Route exact path='/requests/request/:id' render={props => (<RequestSingle {...props}/>)}/>
                            <Route exact path='/requests/faq' render={props => (<FprkFaqRequests {...props}/>)}/>
                            <Route exact path='/requests/faq/add' render={props => (<FprkFaqRequestAdd {...props}/>)}/>
                            <Route exact path='/requests/request/:id/edit' render={props => (<FprkFaqRequestEdit {...props}/>)}/>
                        </Switch>
                    </TabsLayout>
                </div>
            </React.Fragment>
        );
    }
}

export default withRouter(FprkRequests);