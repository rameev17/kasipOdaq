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
import AboutPpo2 from "./AboutPpo2";
import SampleApplication from "./SampleApplication";
import TopPpoList from "./TopPpoList";
import OpoPpoList from "./OpoPpoList";
import Ppo2Members from "./Ppo2Members";
import {NotificationContainer, NotificationManager} from "react-notifications";

class Ppo2 extends Component {
    constructor(props){
        super(props);

        this.state = {
            kind: '',
            isLoad: false,
        };

        this.changeTabCallback = this.changeTabCallback.bind(this)
    }

    componentDidMount() {
        this.props.userStore.profileInfo(data => {
            this.setState({
                kind: data.union.kind
            })
        }, response => {
            if (Array.isArray(response.data)) {
                response.data.forEach(error => {
                    this.setState({ preloader: false });
                    NotificationManager.error(error.message)
                })
            } else {
                this.setState({ preloader: false });
                NotificationManager.error(response.data.message)
            }
            if (response.status == 401){
                this.setState({ preloader: false });
                this.props.history.push('/')
            }
        });

        if (this.props.match.params.id !== undefined && this.props.match.params.id !== 'undefined'){
            this.props.unionStore.loadMembersPpo(
                this.props.match.params.id,
                null,(data, headers) => {
                    console.log(this.props.unionStore.countMembers);
                    this.props.unionStore.countMembers = headers['x-pagination-total-count'];
                    this.setState({
                        isLoad: true,
                        preloader: false
                    })
                }, response => {
                    if (Array.isArray(response.data)) {
                        response.data.forEach(error => {
                            this.setState({ preloader: false, isLoad: true });
                            NotificationManager.error(error.message)
                        })
                    } else {
                        this.setState({ preloader: false, isLoad: true });
                        NotificationManager.error(response.data.message)
                    }
                    if (response.status == 401){
                        this.setState({ preloader: false, isLoad: true });
                        this.props.history.push('/')
                    }
                }
            )
        }else{
            this.props.unionStore.loadMembersPpo(
                this.props.userStore.profile.union.resource_id,
                null,(data, headers) => {
                    console.log(this.props.unionStore.countMembers);
                    this.props.unionStore.countMembers = headers['x-pagination-total-count'];
                    this.setState({
                        isLoad: true,
                        preloader: false
                    })
                }, response => {
                    if (Array.isArray(response.data)) {
                        response.data.forEach(error => {
                            this.setState({ preloader: false, isLoad: true });
                            NotificationManager.error(error.message)
                        })
                    } else {
                        this.setState({ preloader: false, isLoad: true });
                        NotificationManager.error(response.data.message)
                    }
                    if (response.status == 401){
                        this.setState({ preloader: false, isLoad: true });
                        this.props.history.push('/')
                    }
                }
            )
        }
    }

    changeTabCallback = (tab) => {
        switch (tab) {
            case '1':
                this.props.history.push({
                    pathname:`/union/ppo2/${this.props.match.params.id}`,
                    state: { tabId: 1 }
                });
                break;
            case '2':
                this.props.history.push({
                    pathname:`/union/ppo/${this.props.match.params.id}/members`,
                    state: { tabId: 2 }
                });
                break;
            default:
                this.props.history.push({
                    pathname:`/union/ppo2/${this.props.match.params.id}`,
                    state: { tabId: 1 }
                })
        }
    };

    render() {

        const tabs = [
            {name: 'О профсоюзе'},
            {name: this.props.userStore.languageList['Члены профсоюза'] + `(${this.props.unionStore.countMembers})` || 'Члены профсоюза' + `(${this.props.unionStore.countMembers})`}
        ];

        return (
            <React.Fragment>
                <div className="title-wrapper" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    {/*<h1>Отраслевые объединения</h1>*/}
                    {/*<Link to={`/union/opo/add`}>Добавить отрасль</Link>*/}
                    <Link to={`/union/reports?union_id=${this.props.match.params.id}`} style={{ border: '1px solid #002F6C', color: '#002F6C', backgroundColor: 'transparent' }}>{this.props.userStore.languageList['Отчеты'] || 'Отчеты'}</Link>
                    {/*<Link to={`/union/reports/create`} style={{ border: '1px solid #002F6C', color: '#002F6C', backgroundColor: 'transparent' }}>Добавить отчет</Link>*/}
                </div>

                <div className={'panel'}>

                    {
                        this.props.userStore.role !== 'company' &&
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
                                        case 'union':
                                            return (
                                                <> <Link style={{color: '#0052A4'}} to={`/union/ppo/${breadcrumb.resource_id}`}>{breadcrumb.name}</Link>
                                                    {
                                                        index !== this.props.unionStore.breadCrumbs.length - 1 &&
                                                        <span> -> </span>
                                                    }
                                                </>
                                            );
                                            break;
                                    }

                                })
                            }
                        </div>
                    }

                    {
                        this.state.isLoad &&
                        <TabsLayout changeTabCallback={this.changeTabCallback}
                                    tabs={tabs}>
                            <Switch>
                                {
                                    this.props.userStore.role == 'company' &&
                                    <Route exact path='/union'
                                           render={props => (<AboutPpo2 {...props} />)}/>
                                }
                                <Route exact path='/union/ppo2/:id' render={props => (<AboutPpo2 {...props}/>)}/>
                                <Route exact path='/union/ppo2/:id/members' render={props => (<Ppo2Members {...props}/>)}/>
                                <Route exact path='/union/ppo2/:id/members/:id' render={props => (<PpoMember {...props}/>)}/>
                                <Route exact path='/union/ppo2/:id/member/add' render={props => (<AddPpoMember {...props}/>)}/>
                                <Route exact path='/union/ppo2/:id/edit' render={props => (<PpoEdit {...props}/>)}/>
                                <Route exact path='/union/ppo2/:id/sample_application' render={props => (<SampleApplication {...props}/>)}/>
                            </Switch>
                        </TabsLayout>
                    }
                </div>
            </React.Fragment>

        );
    }
}

export default withRouter(inject('unionStore', 'permissionsStore', 'userStore')(observer(Ppo2)));