import React, {Component} from 'react';
import Layout from "../../fragments/layout/Layout";
import TabsLayout from "../../fragments/tabsLayout/TabsLayout";
import {Switch, Redirect, Route} from 'react-router-dom'

import './style.scss'

const ARTICLE_1_ID = 278
const ARTICLE_2_ID = 279
const ARTICLE_3_ID = 280
const ARTICLE_4_ID = 281

class FprkDivisions extends Component{

    state = {
        title:'Органы ФПРК',
        tabs: [
            {
                name: 'Съезд'
            },
            {
                name: 'Совет'
            },
            {
                name: 'Исполком'
            },
            {
                name: 'Комиссия'
            }
        ]
    }

    changeTabCallback = (tab) => {
        switch (tab) {
            case '1':
                this.props.history.push({
                    pathname: '/fprk-divisions',
                    state: { tabId: 1 }
                })
                break;
            case '2':
                this.props.history.push({
                    pathname: '/fprk-divisions/council',
                    state: { tabId: 2 }
                })
                break;
            case '3':
                this.props.history.push({
                    pathname: '/fprk-divisions/executive-committee',
                    state: { tabId: 3 }
                })
                break;
            case '4':
                this.props.history.push({
                    pathname: '/fprk-divisions/commission',
                    state: { tabId: 4 }
                })
                break;
            default:
                this.props.history.push({
                    pathname: '/fprk-divisions',
                    state: { tabId: 1 }
                })
        }
    }


    render() {

        return (
            <Layout title='Органы ФПРК'>
                <TabsLayout changeTabCallback={this.changeTabCallback}
                            tabs={this.state.tabs}
                            history={this.props.history.location.pathname}
                >
                    <Route exact path='/fprk-divisions' render={props => (<Congress title={this.state.title}
                                                                                    article={this.props.article}
                                                                                    getCurrentArticle={this.getCurrentArticle}/>)}/>
                    <Route exact path='/fprk-divisions/council' render={props => (<Council {...props}
                                                                                           article={this.props.article}
                                                                                           getCurrentArticle={this.getCurrentArticle}/>)}/>
                    <Route exact path='/fprk-divisions/executive-committee' render={props => (<ExecutiveCommittee {...props}
                                                                                                                  article={this.props.article}
                                                                                                                  getCurrentArticle={this.getCurrentArticle}/>)}/>
                    <Route exact path='/fprk-divisions/commission' render={props => (<Сommission {...props}
                                                                                                 article={this.props.article}
                                                                                                 getCurrentArticle={this.getCurrentArticle}/>)}/>
                </TabsLayout>
            </Layout>
        );
    }
}

class Congress extends Component{

    render(){
        const BREAD_CRUMBS =
            [
                {
                    label:'О проекте',
                    link:'/about-us'
                },
                {
                    label:'Съезд',
                    link:'/fprk-divisions'
                }
            ];

        return(
            <div className="plate-wrapper plate-wrapper__height">
                <div className="congress">
                    <div className="title">
                        title
                    </div>
                    <div className="text" >
                        content
                    </div>

                </div>
            </div>
        )
    }
}

class Council extends Component{

    render(){
        const BREAD_CRUMBS =
            [
                {
                    label:'О проекте',
                    link:'/about-us'
                },
                {
                    label:'Совет',
                    link:'/fprk-divisions/council'
                }
            ];

        return(
            <div className="plate-wrapper plate-wrapper__height">
                <div className="council">
                    {/*<a href="" className="download__link">Состав Генерального совета</a>*/}
                    <div className="title">
                        title
                    </div>
                    <div className="text">
                        content
                    </div>

                </div>
            </div>
        )
    }
}

class ExecutiveCommittee extends Component{


    render(){
        const BREAD_CRUMBS =
            [
                {
                    label:'О проекте',
                    link:'/about-us'
                },
                {
                    label:'Исполком',
                    link:'/fprk-divisions/executive-committee'
                }
            ];

        return(
            <div className="plate-wrapper plate-wrapper__height">
                <div className="executive__committee">
                    {/*<a href="" className="download__link">Состав Исполкома</a>*/}
                    <div className="title">
                        title
                    </div>
                    <div className="text">
                        content
                    </div>
                </div>
            </div>
        )
    }
}

class Сommission extends Component{

    render(){
        const BREAD_CRUMBS =
            [
                {
                    label:'О проекте',
                    link:'/about-us'
                },
                {
                    label:'Комиссия',
                    link:'/fprk-divisions/commission'
                }
            ];

        return(
            <div className="plate-wrapper plate-wrapper__height">
                <div className="commission">
                    {/*<a href="" className="download__link">Состав Ревизионной комиссии</a>*/}
                    <div className="title">
                        title
                    </div>
                    <div className="text" >
                        content
                    </div>

                </div>
            </div>
        )
    }
}

export default FprkDivisions
