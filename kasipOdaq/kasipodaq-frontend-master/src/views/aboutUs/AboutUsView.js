import React, {Component} from 'react';
import Layout from "../../fragments/layout/Layout";
import TabsLayout from "../../fragments/tabsLayout/TabsLayout";
import {Switch, Redirect, Route, Link} from 'react-router-dom'

import './style.scss'
import {Scrollbars} from 'react-custom-scrollbars';
import {ReactComponent as LogoIcon} from '../../assets/icons/simple-dark-logo.svg'
import {inject, observer} from "mobx-react";
import Preloader from "../../fragments/preloader/Preloader";
import {NotificationContainer, NotificationManager} from 'react-notifications';
import CookieService from "../../services/CookieService";

class AboutUs extends Component {

    state = {
        pageTitle: '',
        tabs: [
            {
                name: 'О Федерации',
                route: '/about-us'
            },
            {
                name: 'О проекте',
                route: '/about-us/about-project'
            }
        ],

        branches: [
            {
                id: 1,
                title: "РОО «Казахстанский отраслевой профессиональный союз работников среднего и малого бизнеса «Yntymaq»",
                name: "«Yntymaq»",
                desciption: "РОО «Казахстанский отраслевой \n" +
                    "профессиональный союз \n" +
                    "работников среднего и малого\n" +
                    "бизнеса «Yntymaq»",
                img: "/assets/images/mock/yntymaq.png",
                chairman: "Даулеталин Сатыбалды Телагысович",
                contacts: "Республика Казахстан,\n" +
                    "010000, г. Астана, проспект Абая З8,\n" +
                    "Тел. 8-701-274-60-88\n" +
                    "E-mail: std62@mail.ru"
            },
            {
                id: 1,
                title: "РОО «Казахстанский отраслевой профессиональный союз работников среднего и малого бизнеса «Yntymaq»",
                name: "«Yntymaq»",
                desciption: "РОО «Казахстанский отраслевой \n" +
                    "профессиональный союз \n" +
                    "работников среднего и малого\n" +
                    "бизнеса «Yntymaq»",
                img: "/assets/images/mock/yntymaq.png",
                chairman: "Даулеталин Сатыбалды Телагысович",
                contacts: "Республика Казахстан,\n" +
                    "010000, г. Астана, проспект Абая З8,\n" +
                    "Тел. 8-701-274-60-88\n" +
                    "E-mail: std62@mail.ru"
            }
        ]
    }

    changeTabCallback = (tab) => {
        switch (tab) {
            case '1':
                this.props.history.push({
                    pathname: '/about-us',
                    state: {tabId: 1}
                })
                break;
            case '2':
                this.props.history.push({
                    pathname: '/about-us/about-project',
                    state: {tabId: 2}
                })
                break;
            default:
                this.props.history.push({
                    pathname: '/about-us',
                    state: {tabId: 1}
                })
        }
    }

    changePageTitle = (pageTitle) => {
        this.setState({
            pageTitle
        })
    }

    render() {

        return (
            <Layout title={this.state.pageTitle}>
                {/*<TabsLayout changeTabCallback={this.changeTabCallback}*/}
                {/*            tabs={this.state.tabs}*/}
                {/*            history={this.props.history.location.pathname}*/}
                {/*>*/}
                {/*    <Switch>*/}
                {/*        <Route exact path='/about-us' render={props => (*/}
                {/*            <AboutFederation {...props} changePageTitle={this.changePageTitle}/>)}/>*/}
                {/*        <Route exact path='/about-us/about-project'*/}
                {/*               render={props => (<AboutProject changePageTitle={this.changePageTitle}*/}
                {/*                                               article={this.props.article}*/}
                {/*                                               getArticle={this.props.getArticle}/>)}/>*/}
                {/*        <Route exact path='/about-us/branches'*/}
                {/*               render={props => (<Branches branches={this.state.branches}*/}
                {/*                                           getOpoList={this.props.getOpoList}*/}
                {/*                                           opoList={this.props.opoList}*/}
                {/*                                           changePageTitle={this.changePageTitle}/>)}/>*/}
                {/*        <Route exact path='/about-us/charter'*/}
                {/*               render={props => (<Charter changePageTitle={this.changePageTitle}*/}
                {/*                                          article={this.props.article}*/}
                {/*                                          getArticle={this.props.getArticle}/>)}/>*/}
                {/*        <Route exact path='/about-us/management'*/}
                {/*               render={props => (<Management changePageTitle={this.changePageTitle}*/}
                {/*                                             getManagement={this.props.getManagement}/>)}/>*/}
                {/*        <Route exact path='/about-us/history'*/}
                {/*               render={props => (<History changePageTitle={this.changePageTitle}*/}
                {/*                                          article={this.props.article}*/}
                {/*                                          getArticle={this.props.getArticle}/>)}/>*/}
                {/*        <Route exact path='/about-us/activity'*/}
                {/*               render={props => (<Activity changePageTitle={this.changePageTitle}/>)}/>*/}
                {/*        <Route exact path='/about-us/detailed-information'*/}
                {/*               render={props => (<DetailedInformation changePageTitle={this.changePageTitle}*/}
                {/*                                                      article={this.props.article}*/}
                {/*                                                      getArticle={this.props.getArticle}/>)}/>*/}
                {/*        <Route exact path='/about-us/branch/:id'*/}
                {/*               render={props => (<Branch {...props}*/}
                {/*                                         getOpo={this.props.getOpo}*/}
                {/*                                         opo={this.props.opo}*/}
                {/*                                         changePageTitle={this.changePageTitle}/>)}/>*/}
                {/*    </Switch>*/}
                {/*</TabsLayout>*/}

                <DetailedInformation
                    changePageTitle={this.changePageTitle}
                />
            </Layout>
        );
    }
}

class AboutFederation extends Component {

    componentDidMount() {
        this.props.changePageTitle('О Проекте');

        this.props.history.push({
            state: {tabId: 1}
        })
    }

    render() {
        return (
            <div className="plate-wrapper plate-wrapper__height">
                <div className="about__federation">
                    <div className="logo">
                        <LogoIcon/>
                    </div>

                    <div className="list">
                        <div className="link__wrapper">
                            <Link to="/about-us/branches">Отрасли</Link>
                        </div>
                        <div className="link__wrapper">
                            <Link to="/about-us/charter">Устав ФПРК</Link>
                        </div>
                        <div className="link__wrapper">
                            <Link to="/fprk-divisions">Органы ФПРК</Link>
                        </div>
                        <div className="link__wrapper">
                            <Link to="/about-us/management">Руководство</Link>
                        </div>
                        <div className="link__wrapper">
                            <Link to="/about-us/history">История</Link>
                        </div>
                        <div className="link__wrapper">
                            <Link to="/about-us/activity">Деятельность</Link>
                        </div>
                    </div>

                    <div className="detailed-information">
                        <Link to="/about-us/detailed-information">Подробная информация</Link>
                    </div>
                </div>
            </div>
        )
    }
}

class AboutProject extends Component {

    article_id = 284

    componentDidMount() {
        this.props.changePageTitle('О проекте');

    }

    render() {
        return (
            <div className="about__project">
                <div className="plate-wrapper">

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

class Branches extends Component {

    state = {
        branches: []
    }

    componentDidMount() {
        this.setState({branches: this.props.branches})
        this.props.changePageTitle('Отрасли');

    }

    render() {
        const BREAD_CRUMBS =
            [
                {
                    label: 'О проекте',
                    link: '/about-us'
                },
                {
                    label: 'Отрасли',
                    link: '/about-us/branches'
                }
            ];

        return (
            <div className="plate-wrapper plate-wrapper__height">
                <div className="branches">

                    <div className="list">
                        <Scrollbars>

                                <div className="link__wrapper" >
                                    <Link to={"/about-us/branch/1"}>name</Link>
                                </div>
                        </Scrollbars>

                    </div>

                </div>
            </div>
        )
    }
}

class Branch extends Component {

    state = {
        id: 1,
        title: "РОО «Казахстанский отраслевой профессиональный союз работников среднего и малого бизнеса «Yntymaq»",
        name: "«Yntymaq»",
        description: "РОО «Казахстанский отраслевой \n" +
            "профессиональный союз \n" +
            "работников среднего и малого\n" +
            "бизнеса «Yntymaq»",
        img: "/assets/images/mock/yntymaq.png",
        chairman: "Даулеталин Сатыбалды Телагысович",
        contacts: "Республика Казахстан,\n" +
            "010000, г. Астана, проспект Абая З8,\n" +
            "Тел. 8-701-274-60-88\n" +
            "E-mail: std62@mail.ru"
    }

    componentDidMount() {

    }


    render() {

        const BREAD_CRUMBS =
            [
                {
                    label: 'О проекте',
                    link: '/about-us'
                },
                {
                    label: 'Отрасли',
                    link: '/about-us/branches'
                },
                {
                    label: this.state.title,
                    link: this.props.history.location.path
                }
            ];

        return (
            <React.Fragment>
                <div className="about plate-wrapper plate-wrapper__height">
                    <div className="about__branch">
                        <div className="logo">
                            <img src='123.png' alt=""/>
                        </div>
                        <div className="description">
                           name
                        </div>
                    </div>
                    <div className="branch">
                        <div className="title"></div>
                        <div className="text">
                            content
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

class Charter extends Component {

    article_id = 277

    componentDidMount() {
        this.props.changePageTitle('Устав ФПРК');
    }

    render() {
        const BREAD_CRUMBS =
            [
                {
                    label: 'О проекте',
                    link: '/about-us'
                },
                {
                    label: 'Устав ФПРК',
                    link: '/about-us/charter'
                }
            ];

        return (
            <div className="plate-wrapper plate-wrapper__height">

                <div className="charter">
                    content
                </div>
            </div>
        )
    }
}

class Management extends Component {

    state = {}

    componentDidMount() {
        this.props.changePageTitle('Руководство');

    }

    render() {
        const BREAD_CRUMBS =
            [
                {
                    label: 'О проекте',
                    link: '/about-us'
                },
                {
                    label: 'Руководство',
                    link: '/about-us/management'
                }
            ];

        return (
            <div className="plate-wrapper plate-wrapper__height">
                <div className="management">
                    <div className="title">
                        Руководство
                    </div>
                    <div className='management__wrapper'>
                            <div className="management__person">
                                <div className="wrapper">
                                    <div className="photo"
                                         style={{background: `url(123.png) no-repeat center center / contain`}}>
                                        {/*<img src="/assets/images/mock/photo-yntymaq.png" width="150px" height="150px" alt=""/>*/}
                                    </div>
                                    <div className="management__description">
                                        <div className="fio">
                                            <span>first_name</span>
                                            <span>middle_name</span>
                                            <span>last_name</span>
                                        </div>
                                        <div className="position">
                                            post
                                        </div>
                                        <div className="birthday">
                                            07.40.2394
                                        </div>
                                    </div>
                                </div>
                                <div className="management__text">
                                    description
                                </div>
                            </div>
                    </div>
                </div>
            </div>
        )
    }
}

class History extends Component {

    article_id = 282

    componentDidMount() {
        this.props.changePageTitle('История');
    }

    render() {
        const BREAD_CRUMBS =
            [
                {
                    label: 'О проекте',
                    link: '/about-us'
                },
                {
                    label: 'История',
                    link: '/about-us/history'
                }
            ];

        return (
            <div className="plate-wrapper plate-wrapper__height">
                <div className="history">
                    <div className="title">
                        История
                    </div>

                    <div className="text">
                        content
                    </div>

                </div>
            </div>
        )
    }
}

class Activity extends Component {

    componentDidMount() {
        this.props.changePageTitle('Деятельность');
    }

    render() {
        const BREAD_CRUMBS =
            [
                {
                    label: 'О проекте',
                    link: '/about-us'
                },
                {
                    label: 'Деятельность',
                    link: '/about-us/activity'
                }
            ];

        return (
            <div className="plate-wrapper plate-wrapper__height">
                <div className="activity">
                    <a href="http://web.kasipodaq.org/storage/article/post_attachment/283/source/5850cd87.rar?action=download" className="download__link">Социальное партнерство</a>
                    <a href="http://web.kasipodaq.org/storage/article/post_attachment/283/source/2d630cfe.docx?action=download" className="download__link">Гендерная политика</a>
                    <a href="http://web.kasipodaq.org/storage/article/post_attachment/283/source/65c120d7.docx?action=download" className="download__link">Молодежная политика</a>
                    <a href="http://web.kasipodaq.org/storage/article/post_attachment/283/source/11879308.docx?action=download" className="download__link">Международная работа</a>
                    <a href="http://web.kasipodaq.org/storage/article/post_attachment/283/source/5103c04e.doc?action=download" className="download__link">Коллективный договор</a>
                </div>
            </div>
        )
    }
}

const DetailedInformation = inject('infoStore')(observer(class DetailedInformation extends Component {
    constructor(props){
        super(props)

        this.state = {
            preloader: false,
        }
    }

    componentDidMount() {
        this.props.changePageTitle('О Федерации');

        this.props.infoStore.loadInfo(null, this.props.infoStore.INFO_KEY_ABOUT_YNTYMAQ, null, data => {
            this.setState({preloader: false})

            this.props.infoStore.aboutYntymaq = data[0].content || ''
        }, response => {
            if (Array.isArray(response.data)) {
                response.data.forEach(error => {
                    this.setState({preloader: false})
                    // toast.error(error.message)
                    NotificationManager.error(error.message)
                })
            } else {
                // toast.error(response.data.message)
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

                <div className="detailed__information">
                    <div className="title">
                        {  }
                    </div>
                    <div className="text"  dangerouslySetInnerHTML={{__html: this.props.infoStore.aboutYntymaq }}>

                    </div>

                </div>
            </div>
        )
    }
}))


export default inject('infoStore', 'permissionsStore')(observer(AboutUs));
