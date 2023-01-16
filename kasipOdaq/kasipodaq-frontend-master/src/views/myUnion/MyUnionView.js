import React, {Component} from 'react';
import Layout from "../../fragments/layout/Layout";
import TabsLayout from "../../fragments/tabsLayout/TabsLayout";
import {Route, Switch} from "react-router";
import './style.scss'
import {inject, observer} from "mobx-react";
import {NotificationContainer, NotificationManager} from 'react-notifications';
import CookieService from "../../services/CookieService";


class MyUnion extends Component {

    constructor(props) {
        super(props);

        this.state = {
            tabs: [
                {
                    name: this.props.userStore.languageList["О профсоюзе"] || 'О профсоюзе'
                },
                {
                    name: this.props.userStore.languageList["О компании"] || 'О компании'
                }
            ],
            preloader: false,
        }

        this.changeTabCallback = this.changeTabCallback.bind(this)
    }

    componentDidMount() {
        this.props.unionStore.loadUnion(() => {

        }, response => {
            if (Array.isArray(response.data)) {
                response.data.forEach(error => {
                    this.setState({ preloader: false })
                    NotificationManager.error(error.message)
                })
            } else {
                this.setState({ preloader: false })
                NotificationManager.error(response.data.message)
            }
            if (response.status == 401){
                CookieService.remove('token')
                this.setState({ preloader: false })
                this.props.history.push('/auth')
            }
        })
    }

    changeTabCallback = (tab) => {
        switch (tab) {
            case '1':
                this.props.history.push({
                    pathname: '/my-union',
                    state: { tabId: 1 }
                })
                break;
            case '2':
                this.props.history.push({
                    pathname: '/my-union/company',
                    state: { tabId: 2 }
                })
                break;
            default:
                this.props.history.push({
                    pathname: '/my-union',
                    state: { tabId: 1 }
                })
        }
    }

    render() {
        return (
            <Layout title={this.props.userStore.languageList['Мой профсоюз'] || 'Мой профсоюз'}>
                {(this.role === 'rManagerOpo' || this.role === 'rManagerFprk') &&
                <Switch>
                    <Route exact path='/my-union' render={props => (<About {...props}
                                                                           role={this.role}
                                                                           union={this.state.union}/>)}/>
                </Switch>
                }
                {(this.role !== 'rManagerOpo' && this.role !== 'rManagerFprk') &&
                <TabsLayout changeTabCallback={this.changeTabCallback}
                            tabs={this.state.tabs}
                            history={this.props.history.location.pathname}
                >
                    <Switch>
                        <Route exact path='/my-union' render={props => (<About {...props} />)} />
                        <Route exact path='/my-union/company' render={props => (<Company {...props} />)}/>
                    </Switch>
                </TabsLayout>
                }
            </Layout>
        );
    }
}

const About = inject('unionStore', 'userStore')(observer(class About extends Component {

    constructor(props) {
        super(props);

        this.state = {
            preloader: false,
        }
    }

    render() {

        return (
            <div className="plate-wrapper plate-wrapper__height">
                <div className='about-union'>
                    <div className="docs">
                        {
                            this.props.unionStore.union.union_sample_applications && this.props.unionStore.union.union_sample_applications.length ?
                                <div className="templates" style={{ marginBottom: 10, }}>
                                    <a href="#" className="templates__title">{this.props.userStore.languageList["Образцы заявлений"] || 'Образцы заявлений'}</a>
                                    <ul className="templates-list">
                                        {
                                            this.props.unionStore.union.union_sample_applications.map((item,idx) => (
                                            <li key={idx}>
                                                <a href={item.uri} className="download__link">{item.name}</a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                : ''
                        }

                        {
                            this.props.unionStore.union.protocol &&
                            <a href={ this.props.unionStore.union.protocol.uri } className="download__link">{ this.props.unionStore.union.protocol.name }</a>
                        }

                        {
                            this.props.unionStore.union.position &&
                            <a href={ this.props.unionStore.union.position.uri } className="download__link">{ this.props.unionStore.union.position.name }</a>
                        }

                        {
                            this.props.unionStore.union.statement &&
                            <a href={ this.props.unionStore.union.statement.uri } className="download__link">{ this.props.unionStore.union.statement.name }</a>
                        }

                        {
                            this.props.unionStore.union.agreement &&
                            <a href={ this.props.unionStore.union.agreement.uri } className="download__link">{ this.props.unionStore.union.agreement.name }</a>
                        }

                        {/*<a href="#" className="download__link">Коллективный договор</a>*/}
                        {/*<a href="#" className="download__link">Положение</a>*/}
                        {/*<a href="#" className="download__link">Устав</a>*/}

                    </div>

                    <div className="plate-wrapper">
                        <div className="heading">
                            <div className="logo">
                                { this.props.unionStore.union.picture &&
                                <img src={ this.props.unionStore.union.picture.uri }/>
                                }
                            </div>

                            <div className="title">{ this.props.unionStore.union.name }</div>
                        </div>
                        <div className='about-company'>
                            <div className="info" dangerouslySetInnerHTML={{ __html: this.props.unionStore.union.about_union }}>

                            </div>
                        </div>
                    </div>

                    {/*<React.Fragment>*/}
                    {/*    <h1 className="title">name</h1>*/}
                    {/*    <div className="info" >description</div>*/}
                    {/*</React.Fragment>*/}

                    {/*<React.Fragment>*/}
                    {/*    <h1 className="title">name</h1>*/}
                    {/*    <div className="info">*/}
                    {/*        description*/}
                    {/*    </div>*/}
                    {/*</React.Fragment>*/}

                </div>
            </div>

        )
    }
}))

const Company = inject('unionStore')(observer(class Company extends Component {

    render() {

        return (
            <React.Fragment>
                <div className="plate-wrapper">
                    <div className="heading">
                        <div className="logo">
                            { this.props.unionStore.union.picture &&
                            <img src={ this.props.unionStore.union.picture.uri } />
                            }
                        </div>
                        <div className="title">name</div>
                    </div>
                    <div className='about-company'>
                        <div className="info" dangerouslySetInnerHTML={{ __html: this.props.unionStore.union.about_company }}>

                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}))

export default inject('unionStore', 'userStore', 'permissionsStore')(observer(MyUnion));