import React, {Component} from 'react';
import TabsLayout from "../Containers/TabsLayout";
import {Route, Switch} from "react-router";
import AboutPpo from "./AboutPpo";
import PpoMembers from "./PpoMembers";
import PpoMember from "./PpoMember";
import AddPpoMember from "./AddPpoMember";
import PpoEdit from "./PpoEdit";
import {Link, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {inject, observer} from "mobx-react";
import AboutOpo from "./AboutOpo";
import SampleApplication from "./SampleApplication";
import FilialPpoList from "./FilialPpoList";
import AboutFilial from "./AboutFilial";
import AboutTop from "./AboutTop";
import TopPpoList from "./TopPpoList";
import TopEdit from "./TopEdit";
import Ppo from "./Ppo";
import UnionsList from "./UnionsList";
import Ppo2List from "./Ppo2List";
import Ppo2 from "./Ppo2";
import Ppo2Members from "./Ppo2Members";
import ChildrenMember from "./ChildrenMember";
import Reports from "./Reports";
import ReportCreate from "./ReportCreate";

class Top extends Component {
    constructor(props){
        super(props);

        this.state = {
            tabs: [
                {name: 'О ТОП'},
                {name: 'Профсоюзы'}
            ],
        };

        this.changeTabCallback = this.changeTabCallback.bind(this)
    }

    changeTabCallback = (tab) => {
        switch (tab) {
            case '1':
                this.props.history.push({
                    pathname:`/union/top/${this.props.match.params.id}`,
                    state: { tabId: 1 }
                });
                break;
            case '2':
                this.props.history.push({
                    pathname:`/union/top/${this.props.match.params.id}/ppo`,
                    state: { tabId: 2 }
                });
                break;
            default:
                this.props.history.push({
                    pathname:`/union/top/${this.props.match.params.id}`,
                    state: { tabId: 1 }
                })
        }
    };

    render() {

        return (
            <React.Fragment>
                {
                    this.props.userStore.role !== 'association' &&
                    <div className={"title-wrapper" + (this.props.userStore.role == 'company' ? ' opo__title-wrapper' : '')}
                         style={{ display: 'flex', justifyContent: 'flex-end', margin: 20 }}>
                        {/*<h1>{ this.props.unionStore.union.name }</h1>*/}
                        {/*<Link className='add-member' to={`/union/ppo/1/member/add`}>*/}
                        {/*    Добавить члена ППО*/}
                        {/*</Link>*/}
                        <Link to={`/union/reports?union_id=${this.props.match.params.id}`} style={{ border: '1px solid #002F6C', color: '#002F6C', backgroundColor: 'transparent' }}>{this.props.userStore.languageList['Отчеты'] || 'Отчеты'}</Link>
                    </div>
                }

                <div className={'panel'}>
                    <TabsLayout changeTabCallback={this.changeTabCallback}
                                tabs={this.state.tabs}>
                        <Switch>
                            {
                                this.props.userStore.role == 'association' &&
                                <Route exact path='/union'
                                       render={props => (<AboutTop {...props} />)}/>
                            }
                            <Route exact path='/union/reports'
                                   render={props => (
                                       <Reports {...props} />)}/>
                            <Route exact path='/union/reports/:id'
                                   render={props => (
                                       <ReportCreate {...props} />)}/>
                            <Route exact path='/union/top/:id' render={props => (<AboutTop {...props}/>)}/>
                            <Route exact path='/union/top/:id/ppo' render={props => (<TopPpoList {...props}/>)}/>
                            <Route exact path='/union/ppo/:id/list' render={props => (<Ppo2List {...props}/>)}/>
                            <Route exact path='/union/list/:id' render={props => (<UnionsList {...props} />)}/>
                            <Route exact path='/union/ppo/:id' render={props => (<Ppo {...props}/>)}/>
                            <Route exact path='/union/ppo/:id/members' render={props => (<PpoMembers {...props}/>)}/>
                            <Route exact path='/union/ppo2/:id/members' render={props => (<Ppo2Members {...props}/>)}/>
                            <Route exact path='/union/ppo/:id/members/:id' render={props => (<PpoMember {...props}/>)}/>
                            {/*<Route exact path='/union/ppo/:id/member/add' render={props => (<AddPpoMember {...props}/>)}/>*/}
                            <Route exact path='/union/member/children/:id' render={props => (<ChildrenMember {...props}/>)}/>
                            <Route exact path='/union/top/:id/edit' render={props => (<TopEdit {...props}/>)}/>
                            {/*<Route exact path='/union/ppo/:id/sample_application' render={props => (<SampleApplication {...props}/>)}/>*/}
                            <Route exact path='/union/ppo2/:id' render={props => (<Ppo2 {...props}/>)}/>
                        </Switch>
                    </TabsLayout>
                </div>
            </React.Fragment>
        );
    }
}

export default withRouter(inject('unionStore', 'permissionsStore', 'userStore')(observer(Top)));