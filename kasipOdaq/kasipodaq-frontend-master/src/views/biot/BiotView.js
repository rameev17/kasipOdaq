import React, {Component} from 'react';
import Layout from "../../fragments/layout/Layout";
import TabsLayout from "../../fragments/tabsLayout/TabsLayout";
import {Switch, Redirect, Route, Link} from 'react-router-dom';
import {ReactComponent as DownloadIcon} from '../../assets/icons/download.svg';
import './style.scss'
import {inject, observer} from "mobx-react";
import Preloader from "../../fragments/preloader/Preloader";
import {NotificationContainer, NotificationManager} from 'react-notifications';
import CookieService from "../../services/CookieService";

class BiOt extends Component {

    constructor(props) {
        super(props);

        this.state = {
            tabs: [
                {
                    name: this.props.userStore.languageList["Охрана труда"] || 'Охрана труда'
                },
                {
                    name: this.props.userStore.languageList["Производственный совет"] || 'Производственный совет'
                }
            ]
        }

        this.changeTabCallback = this.changeTabCallback.bind(this)
    }

    changeTabCallback = (tab) => {
        switch (tab) {
            case '1':
                this.props.history.push({
                    pathname: '/biot',
                    state: {tabId: 1}
                })
                break;
            case '2':
                this.props.history.push({
                    pathname: '/biot/council',
                    state: {tabId: 2}
                })
                break;
            default:
                this.props.history.push({
                    pathname: '/biot',
                    state: {tabId: 1}
                })
        }
    }

    render() {
        return (
            <Layout title='БиОТ'>
                <TabsLayout changeTabCallback={this.changeTabCallback}
                            tabs={this.state.tabs}
                            history={this.props.history.location.pathname}
                >
                    <Switch>
                        <Route exact path='/biot' render={props => {
                            return <Work {...props} />
                        }}/>
                        <Route exact path='/biot/council' render={props => {
                            return <Council {...props} />
                        }}/>
                    </Switch>
                </TabsLayout>
            </Layout>
        );
    }
}

const Work = inject('biotStore', 'infoStore', 'permissionsStore', 'userStore')(observer(class Work extends Component {
    constructor(props) {
        super(props);

        this.state = {
            preloader: false
        }
    }

    loadFprkInfo(){
        this.setState({ preloader: true })
        this.props.infoStore.loadInfo(null, this.props.infoStore.INFO_KEY_BIOT,null, data => {
            this.setState({preloader: false})

            this.props.infoStore.aboutBiot = data[0].content || ''

            this.loadOpoInfo()

        }, response => {
            if (Array.isArray(response.data)) {
                response.data.forEach(error => {
                    this.setState({ preloader: false })
                })
            } else {
                this.setState({ preloader: false })
            }
            if (response.status == 401){
                CookieService.remove('token')
                this.setState({ preloader: false })
                this.props.history.push('/auth')
            }
        })
    }

    loadOpoInfo(){
        this.setState({ preloader: true })
        this.props.infoStore.loadInfo(null, this.props.infoStore.INFO_KEY_BIOT, CookieService.get('union_id'),data => {
            this.setState({preloader: false})

            this.props.infoStore.aboutBiotOpo = data[0].content || ''
        }, response => {
            if (Array.isArray(response.data)) {
                response.data.forEach(error => {
                    this.setState({ preloader: false })
                })
            } else {
                this.setState({ preloader: false })
            }
            if (response.status == 401){
                CookieService.remove('token')
                this.setState({ preloader: false })
                this.props.history.push('/auth')
            }
        })
    }

    loadPpoInfo(){
        this.props.infoStore.loadInfo(null, this.props.infoStore.INFO_KEY_BIOT, this.props.userStore.profile.union.industry.resource_id,data => {
            this.setState({preloader: false})

            this.props.infoStore.aboutBiotPpo = data[0].content || ''
        }, response => {
            if (Array.isArray(response.data)) {
                response.data.forEach(error => {
                    this.setState({ preloader: false })
                })
            } else {
                this.setState({ preloader: false })
            }
            if (response.status == 401){
                CookieService.remove('token')
                this.setState({ preloader: false })
                this.props.history.push('/auth')
            }
        })
    }

    componentDidMount() {
        this.props.biotStore.loadOrderList(CookieService.get('union_id'))

            this.loadOpoInfo()
    }

    render() {

        return (
            <div className="plate-wrapper plate-wrapper__height">
                {
                    this.state.preloader &&
                        <Preloader/>
                }

                <NotificationContainer/>

                <div className='biot work'>
                    <div className={"orders-wrapper active"}>
                        <a href="#" className='trigger'>
                            {this.props.userStore.languageList["Приказы"] || 'Приказы'}
                            <div className="icon">
                            </div>
                        </a>
                        <ul className="orders">
                            {
                                this.props.biotStore.orderList.map(order => {
                                    return <li>
                                                <a href={order.files[0] !== undefined && order.files[0].uri} target={'_blank'}
                                                   style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                                                   className="download__link"
                                                >
                                                    {order.title}
                                                    <DownloadIcon/>
                                                </a>
                                            </li>
                                })
                            }
                        </ul>
                    </div>
                    <h1 className="title">{this.props.userStore.languageList["Безопасность и охрана труда"] || 'Безопасность и охрана труда'}</h1>
                    {
                        this.props.infoStore.orderArticles.map(article => {
                            return <>
                                    <div className="text">
                                        <div className='part' dangerouslySetInnerHTML={{ __html: article.content }}></div>
                                    </div>
                                    <hr/>
                                </>
                        })
                    }

                </div>
            </div>

        )
    }
}))

const Council = inject('infoStore', 'permissionsStore', 'userStore')(observer(class Council extends Component {
    constructor(props) {
        super(props);

        this.state = {
            preloader: true,
            tabs: [
                {
                    name: this.props.userStore.languageList["Охрана труда"] || 'Охрана труда'
                },
                {
                    name: this.props.userStore.languageList["Производственный совет"] || 'Производственный совет'
                }
            ]
        }
    }

    componentDidMount() {
        this.props.history.push({
            state: {tabId: 2}
        })

        this.props.userStore.profileInfo(data => {
            this.props.infoStore.loadInfo(null, this.props.infoStore.INFO_KEY_COUNCIL,
                data.union.resource_id,
                data => {
                    this.setState({preloader: false})

                    this.props.infoStore.aboutCouncil = data[0].content || ''
                }, response => {
                    if (Array.isArray(response.data)) {
                        response.data.forEach(error => {
                            this.setState({ preloader: false })
                        })
                    } else {
                        this.setState({ preloader: false })
                    }
                    if (response.status == 401){
                        CookieService.remove('token')
                        this.setState({ preloader: false })
                        this.props.history.push('/auth')
                    }
                })
        }, response => {
            if (Array.isArray(response.data)) {
                response.data.forEach(error => {
                    this.setState({preloader: false})
                    NotificationManager.error(error.message)
                })
            } else {
                NotificationManager.error(response.data.message)
                this.setState({preloader: false})
            }
            if (response.status == 401){
                CookieService.remove('token')
                this.setState({ preloader: false })
                this.props.history.push('/auth')
            }
        })

    }

    render() {

        return (
            <div className="plate-wrapper plate-wrapper__height">

                {
                    this.state.preloader &&
                        <Preloader/>
                }

                <NotificationContainer/>

                <div className='biot council'>
                    {/*<div className="video">*/}
                    {/*    <iframe width="560" height="315" src="https://www.youtube.com/embed/k53NUztL_q4" frameBorder="0"*/}
                    {/*            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"*/}
                    {/*            allowFullScreen*/}
                    {/*            style={{maxWidth: '100%'}}*/}
                    {/*    ></iframe>*/}
                    {/*</div>*/}
                    <h1 className="title">{this.props.userStore.languageList["Производственный совет по безопасности и охране труда"] || 'Производственный совет по безопасности и охране труда'}</h1>
                    {
                        this.props.infoStore.orderArticles.map(article => {
                            return <>
                                <div className="text">
                                    <div className='part' dangerouslySetInnerHTML={{ __html: article.content }}></div>
                                </div>
                                <hr/>
                            </>
                        })
                    }
                </div>
            </div>
        )
    }
}))



export default inject('biotStore', 'userStore', 'permissionsStore')(observer(BiOt));