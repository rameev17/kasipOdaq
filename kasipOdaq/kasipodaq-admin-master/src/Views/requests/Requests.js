import React, {Component} from 'react';
import Layout from "../Containers/Layout";
import JoinRequests from './JoinRequests'
import UnionRequests from './UnionRequests'
import FprkRequests from './FprkRequests'
import {Route, Switch} from "react-router";

import './index.scss'
import {inject, observer} from "mobx-react";
import {Union} from "../union/Union";
import UnionCreateRequests from "./UnionCreateRequests";

class Requests extends Component {

    constructor(props){
        super(props)
    }

    state = {
        role: '',
    }

    componentDidMount() {

    }

    render() {
        return (
            <Layout title={this.title}>
                <div className="content">
                    {/*<FprkRequests/>*/}

                    {
                        this.props.userStore.role == 'industry' &&
                        <UnionRequests/>
                    }

                    {
                        this.props.userStore.role == 'company' &&
                        <React.Fragment>
                            <Switch>
                                <Route path='/requests' render={props => (<JoinRequests {...props}/>)}/>
                            </Switch>
                        </React.Fragment>
                    }

                    {
                        this.props.userStore.role == 'branch' &&
                        <React.Fragment>
                            <Switch>
                                <Route path='/requests' render={props => (<UnionRequests {...props}/>)}/>
                            </Switch>
                        </React.Fragment>
                    }

                    {
                        this.props.userStore.kind == 'union' &&
                        <React.Fragment>
                            <Switch>
                                <Route path='/create' render={props => (<UnionCreateRequests {...props}/>)}/>
                            </Switch>
                        </React.Fragment>
                    }

                </div>
            </Layout>
        );
    }
}

export default inject('permissionsStore', 'userStore', 'unionStore')(observer(Requests));