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
import TopPpoList from "./TopPpoList";
import OpoPpoList from "./OpoPpoList";
import Ppo2 from "./Ppo2"
import Ppo2Members from "./Ppo2Members";
import Ppo2List from "./Ppo2List";
import ChildrenMember from "./ChildrenMember";
import ChildrenMemberEdit from "./ChildrenMemberEdit";
import Reports from "./Reports";
import {NotificationContainer, NotificationManager} from "react-notifications";
import ReportCreate from "./ReportCreate";
import Preloader from "../../fragments/preloader/Preloader";

class Ppo extends Component {
    constructor(props){
        super(props);

        this.state = {
            kind: '',
            has_child: false,
            isLoad: false,
            preloader: false,
            fileChildren: null,
            fileMember: null,
        };

        this.importChildrenFileRef = React.createRef();
        this.importMemberFileRef = React.createRef();

        this.changeTabCallback = this.changeTabCallback.bind(this);
        this.importChildren = this.importChildren.bind(this);
        this.importMember = this.importMember.bind(this)
    }

    componentDidMount() {
        this.loadPage();

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

    loadPage(){
        if (this.props.match.params.id !== undefined && this.props.match.params.id !== 'undefined'){
            // this.props.unionStore.loadUnion(this.props.match.params.id)
            // this.setState({
            //     kind: this.props.unionStore.union.kind,
            //     has_child: this.props.unionStore.union.has_child
            // })
            this.props.userStore.profileInfo(() => {

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
            })
        }else{
            this.props.userStore.profileInfo(data => {
                this.setState({
                    kind: data.union.kind,
                    has_child: data.union.has_child
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
            })
        }
    }

    changeTabCallback = (tab) => {
        if (this.props.unionStore.union.kind == 'union'){
            switch (tab) {
                case '1':
                    this.props.history.push({
                        pathname:`/union/ppo/${this.props.match.params.id}`,
                        state: { tabId: 1 }
                    });
                    break;
                case '2':
                    this.props.history.push({
                        pathname:`/union/ppo/${this.props.match.params.id}/members`,
                        state: { tabId: 2 }
                    });
                    break;
                case '3':
                    this.props.history.push({
                        pathname:`/union/ppo/${this.props.match.params.id}/list`,
                        state: { tabId: 3 }
                    });
                    break;
                default:
                    this.props.history.push({
                        pathname:`/union/ppo/${this.props.match.params.id}`,
                        state: { tabId: 1 }
                    })
            }
        }else{
            switch (tab) {
                case '1':
                    this.props.history.push({
                        pathname:`/union/ppo/${this.props.match.params.id}`,
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
                        pathname:`/union/ppo/${this.props.match.params.id}`,
                        state: { tabId: 1 }
                    })
            }
        }
    };

    importChildren(){
        this.setState({ preloader: true });

        this.props.unionStore.importChildren(
            this.importChildrenFileRef.current.files[0],
            () => {
                NotificationManager.success('Файл успешно загружен');
                this.setState({ preloader: false })
            }, response => {
                if (Array.isArray(response.data)) {
                    response.data.forEach(error => {
                        this.setState({ preloader: false });
                        NotificationManager.error(error.message)
                    })
                }else{
                    this.setState({ preloader: false });
                    NotificationManager.error(response.data.message)
                }
                if (response.status == 401){
                    this.setState({ preloader: false });
                    this.props.history.push('/')
                }
            })
    }

    importMember(){
        this.setState({ preloader: true });

        this.props.unionStore.importMember(
            this.importMemberFileRef.current.files[0],
            () => {
                NotificationManager.success('Файл успешно загружен');
                this.setState({ preloader: false })
            }, response => {
                if (Array.isArray(response.data)) {
                    response.data.forEach(error => {
                        this.setState({ preloader: false });
                        NotificationManager.error(error.message)
                    })
                }else{
                    this.setState({ preloader: false });
                    NotificationManager.error(response.data.message)
                }
                if (response.status == 401){
                    this.setState({ preloader: false });
                    this.props.history.push('/')
                }
            })
    }

    render(props) {

        const tabs1 = [
            {name: this.props.userStore.languageList['О профсоюзе'] || 'О профсоюзе'},
            {name:  this.props.userStore.languageList['Члены профсоюза'] + `(${this.props.unionStore.countMembers})` || 'Члены профсоюза' + `(${this.props.unionStore.countMembers})`}
        ];
        const tabs2 = [
            {name: this.props.userStore.languageList['О профсоюзе'] || 'О профсоюзе'},
            {name: this.props.userStore.languageList['Члены профсоюза'] + `(${this.props.unionStore.countMembers})` || 'Члены профсоюза' + `(${this.props.unionStore.countMembers})`},
            {name: this.props.userStore.languageList['ППО2'] || 'ППО2'}
        ];

        return (
            <React.Fragment>

                {
                    this.props.userStore.role !== 'company' &&
                    <div className="title-wrapper" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        {/*<h1>Отраслевые объединения</h1>*/}
                        {/*<Link to={`/union/opo/add`}>Добавить отрасль</Link>*/}
                        <Link to={`/union/reports?union_id=${this.props.match.params.id}`} style={{ border: '1px solid #002F6C', color: '#002F6C', backgroundColor: 'transparent' }}>{this.props.userStore.languageList['Отчеты'] || 'Отчеты'}</Link>
                        {/*<Link to={`/union/reports/create`} style={{ border: '1px solid #002F6C', color: '#002F6C', backgroundColor: 'transparent' }}>Добавить отчет</Link>*/}
                    </div>
                }

                {
                    this.state.preloader &&
                    <Preloader/>
                }

                {
                    this.props.userStore.role == 'company' &&
                    <div className={"title-wrapper" + (this.props.userStore.role == 'company' ? ' opo__title-wrapper' : '')} style={{ margin: 20 }}>
                        <h1>{ this.props.unionStore.union.name }</h1>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <label className={'import-member'} >
                                <span style={{ borderBottom: '1px solid #2E384D' }}>{this.props.userStore.languageList['Импорт членов ППО'] || 'Импорт членов ППО'}</span>
                                <input type="file"
                                       style={{display: 'none'}}
                                       onChange={this.importMember}
                                       ref={this.importMemberFileRef}
                                       name="logo"
                                />
                            </label>
                            <label className={'import-member'} style={{ marginLeft: 10 }}>
                                <span style={{ borderBottom: '1px solid #2E384D' }}>{this.props.userStore.languageList['Импорт детей членов ППО'] || 'Импорт детей членов ППО'}</span>
                                <input type="file"
                                       style={{display: 'none'}}
                                       onChange={this.importChildren}
                                       ref={this.importChildrenFileRef}
                                       name="logo"
                                />
                            </label>
                            <Link className='add-member' to={`/union/member/add/${this.props.unionStore.union.resource_id}`} style={{ marginLeft: 10 }}>
                                {this.props.userStore.languageList['Добавить члена ППО'] || 'Добавить члена ППО'}
                            </Link>
                            <Link to={`/union/reports?union_id=${this.props.userStore.profile.union.resource_id}`} style={{ border: '1px solid #002F6C', color: '#002F6C', backgroundColor: 'transparent', marginLeft: 10 }}>{this.props.userStore.languageList['Отчеты'] || 'Отчеты'}</Link>
                        </div>
                    </div>
                }

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
                    <div className={'panel'}>
                        <TabsLayout changeTabCallback={this.changeTabCallback}
                                    tabs={this.props.unionStore.union.kind == 'union' &&
                                    this.props.unionStore.union.has_child ?
                                        tabs2 : tabs1
                                    }>
                            <Switch>
                                {
                                    this.props.userStore.role == 'company' &&
                                    <Route exact path='/union'
                                           render={props => (<AboutPpo {...props} />)}/>
                                }
                                <Route exact path='/union/reports'
                                       render={props => (
                                           <Reports {...props} />)}/>
                                <Route exact path='/union/reports/:id'
                                       render={props => (
                                           <ReportCreate {...props} />)}/>
                                <Route exact path='/union/ppo/:id' render={props => (<AboutPpo {...props}/>)}/>
                                <Route exact path='/union/ppo/:id/list' render={props => (<Ppo2List {...props}/>)}/>
                                <Route exact path='/union/ppo/:id/members' render={props => (<PpoMembers {...props}/>)}/>
                                <Route exact path='/union/ppo2/:id/members' render={props => (<Ppo2Members {...props}/>)}/>
                                <Route exact path='/union/ppo/:id/members/:id' render={props => (<PpoMember {...props}/>)}/>
                                <Route exact path='/union/member/add/:id' render={props => (<AddPpoMember {...props}/>)}/>
                                <Route exact path='/union/member/children/:id' render={props => (<ChildrenMember {...props}/>)}/>
                                <Route exact path='/union/member/children/edit/:id' render={props => (<ChildrenMemberEdit {...props}/>)}/>
                                <Route exact path='/union/ppo/:id/edit' render={props => (<PpoEdit {...props}/>)}/>
                                <Route exact path='/union/ppo/:id/sample_application' render={props => (<SampleApplication {...props}/>)}/>
                                <Route exact path='/union/ppo2/:id' render={props => (<Ppo2 {...props}/>)}/>
                            </Switch>
                        </TabsLayout>
                    </div>
                }
            </React.Fragment>

        );
    }
}

export default withRouter(inject('unionStore', 'permissionsStore', 'userStore')(observer(Ppo)));