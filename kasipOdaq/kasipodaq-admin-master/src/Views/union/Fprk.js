import React, {Component} from 'react';
import {Link, Redirect, Route, Switch} from "react-router-dom";
import {connect} from 'react-redux'
import FprkOpoList from "./FprkOpoList";
import Opo from './Opo'
import OpoAdd from './OpoAdd'
import Ppo from './Ppo'
import {inject, observer} from "mobx-react";
import UnionsList from "./UnionsList";
import Ppo2 from "./Ppo2";
import Ppo2Members from "./Ppo2Members";
import PpoMember from "./PpoMember";
import ChildrenMember from "./ChildrenMember";
import Reports from "./Reports";
import ReportCreate from "./ReportCreate";

class Fprk extends Component {

    constructor(props) {
        super(props);

        this.state = {

        }
    }

    componentDidMount() {
        if (this.props.userStore.role == 'industry'){
            return <Redirect to={'/union/opo'}/>
        }
    }

    render() {

        return (
            <React.Fragment>

                <div className="union__wrapper panel">
                    <Switch>
                        <Route exact path='/union'
                               render={props => (
                                   <FprkOpoList {...props} />)}/>
                        <Route exact path='/union/reports'
                               render={props => (
                                   <Reports {...props} />)}/>
                        <Route exact path='/union/reports/:id'
                               render={props => (
                                   <ReportCreate {...props} />)}/>
                        <Route exact path='/union/list/:id'
                               render={props => (<UnionsList {...props} />)}/>
                        <Route path='/union/opo/:id(\d+)'
                               render={props => (<Opo {...props}/>)}/>
                        <Route path='/union/opo/add'
                               render={props => (<OpoAdd {...props}/>)}/>
                        <Route path='/union/ppo/:id(\d+)'
                               render={props => (<Ppo {...props}/>)}/>
                        <Route exact path='/union/ppo/:id' render={props => (<Ppo {...props}/>)}/>
                        <Route exact path='/union/ppo2/:id' render={props => (<Ppo2 {...props}/>)}/>
                        <Route exact path='/union/ppo2/:id/members' render={props => (<Ppo2Members {...props}/>)}/>
                        <Route exact path='/union/ppo/:id/members/:id' render={props => (<PpoMember {...props}/>)}/>
                        <Route exact path='/union/member/children/:id' render={props => (<ChildrenMember {...props}/>)}/>
                    </Switch>
                </div>
            </React.Fragment>
        )
    }
}


export default inject('unionStore', 'permissionsStore', 'userStore')(observer(Fprk));