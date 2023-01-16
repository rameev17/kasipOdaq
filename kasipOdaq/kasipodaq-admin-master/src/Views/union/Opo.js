import React, {Component} from 'react';
import TabsLayout from "../Containers/TabsLayout";
import {Route, Switch} from "react-router";
import {Link, withRouter} from 'react-router-dom';
import {connect} from 'react-redux'
import AboutOpo from './AboutOpo'
import OpoPpoList from "./OpoPpoList";
import Ppo from './Ppo'
import PpoAdd from './PpoAdd'
import OpoEdit from './OpoEdit'
import {inject, observer} from "mobx-react";
import DisputeDirectionInfo from "../dispute/DisputeDirectionInfo";
import SampleApplicationOpo from "./SampleApplicationOpo";
import UnionsList from "./UnionsList";
import Ppo2 from "./Ppo2";
import ChildrenMember from "./ChildrenMember";
import Reports from "./Reports";
import ReportCreate from "./ReportCreate";

class Opo extends Component {

    constructor(props){
        super(props);

        this.state = {
            tabs: [
                {name: this.props.userStore.languageList["Об отрасли"] || 'Об отрасли'},
                {name: this.props.userStore.languageList["Профсоюзы"] || 'Профсоюзы'}
            ],
        };

        this.changeTabCallback = this.changeTabCallback.bind(this)
    }

    componentDidMount() {

    }

    changeTabCallback = (tab) => {
        switch (tab) {
            case '1':
                this.props.history.push({
                    pathname: `/union/opo/${this.props.match.params.id}`,
                    state: { tabId: 1 }
                });
                break;
            case '2':
                this.props.history.push({
                    pathname: `/union/opo/${this.props.match.params.id}/ppos`,
                    state: { tabId: 2 }
                });
                break;
            default:
                this.props.history.push({
                    pathname: `/union/opo/${this.props.match.params.id}`,
                    state: { tabId: 1 }
                })
        }
    };

    render() {

        return (
            <React.Fragment>

                {
                    this.props.userStore.role !== 'industry' &&
                    <div className="title-wrapper" style={{display: 'flex', justifyContent: 'flex-end'}}>
                        {/*<h1>{ this.props.unionStore.union.name }</h1>*/}
                        {/*<Link to={`/union/opo/${this.state.id}/ppos/add`}>Добавить ППО </Link>*/}
                        <Link to={`/union/reports?union_id=${this.props.match.params.id}`} style={{
                            border: '1px solid #002F6C',
                            color: '#002F6C',
                            backgroundColor: 'transparent'
                        }}>{this.props.userStore.languageList['Отчеты'] || 'Отчеты'}</Link>
                    </div>
                }

                {
                    this.props.userStore.role !== 'industry' &&
                    <div style={{ marginTop: 16, marginBottom: 16 }}>
                        {
                            this.props.unionStore.breadCrumbs?.map((breadcrumb, index) => {
                                    switch (breadcrumb.level) {
                                        case 'main_union':
                                            return (
                                                <> <Link style={{color: '#0052A4'}} to={`/union`}>{breadcrumb.name}</Link>
                                                    {
                                                        index !== this.props.unionStore.breadCrumbs.length - 1 &&
                                                        <span> -> </span>
                                                    }
                                                </>
                                            );
                                            break;
                                        case 'industry':
                                            return (
                                                <> <Link style={{color: '#0052A4'}}
                                                         to={`/union/opo/${breadcrumb.resource_id}`}>{breadcrumb.name}</Link>
                                                    {
                                                        index !== this.props.unionStore.breadCrumbs.length - 1 &&
                                                        <span> -> </span>
                                                    }
                                                </>
                                            );
                                            break;
                                        case 'branch':
                                            return (
                                                <> <Link style={{color: '#0052A4'}} to={`/union/list/${breadcrumb.resource_id}`}>{breadcrumb.name}</Link>
                                                    {
                                                        index !== this.props.unionStore.breadCrumbs.length - 1 &&
                                                        <span> -> </span>
                                                    }
                                                </>
                                            );
                                            break;
                                    }
                                }
                            )
                        }
                    </div>
                }

                <div className={'panel'}>

                    <TabsLayout changeTabCallback={this.changeTabCallback}
                                tabs={this.state.tabs}>
                        <Switch>
                            {
                                this.props.userStore.role == 'industry' &&
                                <Route exact path='/union'
                                       render={props => (<AboutOpo {...props} />)}/>
                            }
                            <Route exact path='/union/reports'
                                   render={props => (
                                       <Reports {...props} />)}/>
                            <Route exact path='/union/reports/:id'
                                   render={props => (
                                       <ReportCreate {...props} />)}/>
                            <Route exact path='/union/opo/:id'
                                   render={props => (<AboutOpo {...props} />)}/>
                            <Route exact path='/union/list/:id'
                                   render={props => (<UnionsList {...props} />)}/>
                            <Route exact path='/union/opo/:id/ppos'
                                   render={props => (
                                       <OpoPpoList {...props} id={this.state.id} opo={this.state.opo}/>)}/>
                            <Route exact path='/union/opo/:id/ppos/add'
                                   render={props => (
                                       <PpoAdd {...props} id={this.state.id}/>)}/>
                            <Route path='/union/ppo/:id'
                                   render={props => (<Ppo {...props}/>)}/>
                            <Route path='/union/ppo2/:id'
                                   render={props => (<Ppo2 {...props}/>)}/>
                            <Route exact path='/union/opo/:id/edit'
                                   render={props => (<OpoEdit {...props}/>)}/>
                            <Route exact path='/union/opo/:id/sample_application'
                                   render={props => (<SampleApplicationOpo {...props}/>)}/>
                            <Route exact path='/union/member/children/:id' render={props => (<ChildrenMember {...props}/>)}/>
                        </Switch>
                    </TabsLayout>
                </div>
            </React.Fragment>
        )
    }
}

export default (withRouter(inject('unionStore', 'permissionsStore', 'userStore')(observer(Opo))));