import React, {Component} from 'react';
import Layout from "../../fragments/layout/Layout";
import TabsLayout from "../../fragments/tabsLayout/TabsLayout";
import {Route, withRouter, Switch, Link} from "react-router-dom";

import {Scrollbars} from 'react-custom-scrollbars';
import './style.scss';
import {inject, observer} from "mobx-react";
import {ReactComponent as Folder} from '../../assets/icons/folder.svg';
import {ReactComponent as SearchLogo} from '../../assets/icons/search-input.svg';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import CookieService from "../../services/CookieService";
import Preloader from "../../fragments/preloader/Preloader";

class LawDatabase extends Component {

    constructor(props){
        super(props)

        this.state = {
            tabs: [
                {
                    name: 'Трудовой кодекс'
                },
                {
                    name: 'Закон о профсоюзах'
                },
            ],
        }
    }

    componentDidMount() {

    }

    changeTabCallback = (tab) => {
        switch (tab) {
            case '1':
                this.props.history.push({
                    pathname: '/law-database',
                    state: { tabId: 1 }
                })
                break;
            case '2':
                this.props.history.push({
                    pathname:'/law-database/about-unions',
                    state: { tabId: 2 }
                })
                break;
            default:
                this.props.history.push({
                    pathname: '/law-database',
                    state: { tabId: 1 }
                })
        }
    }

    render() {
        return (
            <Layout title='Законодательная база'>

                <div className="plate-wrapper plate-wrapper__height laws__wrapper">
                    {/*<Search*/}
                    {/*    // dataset={this.state.currentTab}*/}
                    {/*/>*/}
                    <Route exact path='/law-database' render={props => (
                        <Laws {...props} />)}/>
                    <Route exact path='/law-database/:id' render={props => (
                        <Law {...props} />)} />
                    <Route exact path='/law-database/article/:id' render={props => (
                        <Article {...props} />)} />
                </div>

            </Layout>
        );
    }
}

const Laws = inject('legalStore', 'userStore', 'permissionsStore')(observer(class Laws extends Component {
    constructor(props){
        super(props)

        this.state = {
            preloader: true,
        }

        this.searchRef = React.createRef()

        this.searchLegislation = this.searchLegislation.bind(this)
    }

    loadPage(){
        this.props.legalStore.loadLegislationType(
            null,
            () => {
                this.setState({ preloader: false })
            },
            response => {
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
            }
        )
    }

    componentDidMount() {
        this.loadPage()
    }

    searchLegislation(){
        if (this.searchRef.current.value.length >= 3){
            this.setState({ preloader: true })
            this.props.legalStore.loadLegislationType(
                this.searchRef.current.value,
                () => {
                    this.setState({ preloader: false })
                },
                response => {
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
                }
            )
        }else{
            this.loadPage()
        }
    }

    render() {

        return (
            <div className='laws-container'>

                {
                    this.state.preloader &&
                        <Preloader/>
                }

                <NotificationContainer/>

                <div style={{ marginBottom: 16 }}>
                    <Link style={{ color: '#0052A4' }} to={`/law-database`} onClick={() => this.props.legalStore.breadCrumbs = null}>Законодательная база</Link>
                    <span> -> </span>
                    {
                        this.props.legalStore.breadCrumbs?.map(breadcrumb => {
                            return  <> <Link style={{ color: '#0052A4' }} to={`/law-database/${breadcrumb.resource_id}`}>{ breadcrumb.name }</Link>
                                <span> -> </span>
                            </>
                        })
                    }
                </div>

                <div className={'input-search'} style={{ position: "relative", display: 'flex', alignItems: 'center' }}>
                    <SearchLogo style={{ position: 'absolute', left: 12 }}/>
                    <input type="text"
                           placeholder={this.props.userStore.languageList["Введите фразу или слово"] || 'Введите фразу или слово'}
                           ref={this.searchRef}
                           style={{
                               width: '100%',
                               border: '1px solid #E4E8F0',
                               padding: '9px 48px'
                           }}
                           onChange={this.searchLegislation}
                    />
                </div>
                {/*<h1 className="title">Трудовой кодекс Республики Казахстан</h1>*/}
                {/*<div className="subtitle">(с изменениями и дополнениями по состоянию на 01.01.2019 г.)</div>*/}
                {/*<div className="info">info</div>*/}
                <div className="laws">

                        <Scrollbars>
                            {
                                this.props.legalStore.legislationType.map((law, index) => {
                                    return <Item law={law} key={index}/>
                                })
                            }
                        </Scrollbars>
                </div>
            </div>
        )
    }
}))

const Item = inject('legalStore', 'permissionsStore')(observer(class Item extends Component {

    constructor(props){
        super(props)

        this.state = {
            item: [],
            itemView: false,
            c: false,
            isOpen: false,
            preloader: false,
        }

        this.loadPage = this.loadPage.bind(this)
    }

    loadPage(law){
        if (law.content) {
            window.location.href = `/law-database/article/${law.resource_id}`
        }else{
            this.setState({ preloader: true })
            this.props.legalStore.loadLegislation(
                law.resource_id,
                null,
                (data) => {
                    this.setState({
                        item: data,
                        itemView: !this.state.itemView,
                        preloader: false
                    })
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
    }

    render() {

        return (
            <div className="row ">
                {
                    this.state.preloader &&
                    <Preloader/>
                }

                <div className="row-title" style={{ display: 'block' }}>

                    {
                        !this.props.law.content &&
                        <Folder/>
                    }
                    <Link onClick={() => this.loadPage(this.props.law)}>
                        {this.props.law.title}
                    </Link>

                    {
                        this.state.itemView &&
                        this.state.item.map(item => {
                            return <div className="row">
                                <div className="row-title">
                                    {
                                       !item.content &&
                                        <Folder/>
                                    }
                                    {
                                        item.content ?
                                            <Link to={'/law-database/article/' + item.resource_id}>
                                                {item.title}
                                            </Link>
                                            :
                                            <Link to={'/law-database/' + item.resource_id}>
                                                {item.title}
                                            </Link>
                                    }
                                </div>
                            </div>
                        })
                    }
                </div>
            </div>

        )
    }
}))

const Law = inject('legalStore', 'userStore', 'permissionsStore')(observer(class Law extends Component{
    constructor(props){
        super(props)

        this.state = {
            preloader: false
        }

        this.searchRef = React.createRef()

        this.searchLegislation = this.searchLegislation.bind(this)
    }

    componentDidMount() {
        this.setState({ preloader: true })
        this.props.legalStore.loadLegislation(
            this.props.match.params.id,
            null,
            (data) => {
                this.props.legalStore.breadCrumbs = data[0]?.bread_crumbs
                this.setState({ preloader: false })
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

    componentDidUpdate(prevProps) {
        if (this.props !== prevProps) {
            this.setState({ preloader: true })
            this.props.legalStore.loadLegislation(
                this.props.match.params.id,
                null,
                (data) => {
                    this.props.legalStore.breadCrumbs = data[0].bread_crumbs
                    this.setState({ preloader: false })
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
    }

    searchLegislation(){
        if (this.searchRef.current.value.length >= 3){
            this.setState({ preloader: true })
            this.props.legalStore.loadLegislationType(
                this.searchRef.current.value,
                (data) => {
                    this.props.legalStore.legislation = data
                    this.setState({ preloader: false })
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
        }else{
            this.props.legalStore.loadLegislation(
                this.props.match.params.id,
                null,
                data => {

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
    }

    render(){

        return(
            <div className='laws-container'>
                {
                    this.state.preloader &&
                        <Preloader/>
                }

                <NotificationContainer/>

                <div style={{ marginBottom: 16 }}>
                    <Link style={{ color: '#0052A4' }} to={`/law-database`} onClick={() => this.props.legalStore.breadCrumbs = null}>Законодательная база</Link>
                    <span> -> </span>
                    {
                        this.props.legalStore.breadCrumbs?.map(breadcrumb => {
                            return  <> <Link style={{ color: '#0052A4' }} to={`/law-database/${breadcrumb.resource_id}`}>{ breadcrumb.name }</Link>
                                    <span> -> </span>
                                    </>
                        })
                    }
                </div>

                {/*<h1 className="title">Трудовой кодекс Республики Казахстан</h1>*/}
                {/*<div className="subtitle">(с изменениями и дополнениями по состоянию на 01.01.2019 г.)</div>*/}
                {/*<div className="info">info</div>*/}
                <div className={'input-search'} style={{ position: "relative", display: 'flex', alignItems: 'center' }}>
                    <SearchLogo style={{ position: 'absolute', left: 12 }}/>
                    <input type="text"
                           placeholder={this.props.userStore.languageList["Введите фразу или слово"] || 'Введите фразу или слово'}
                           ref={this.searchRef}
                           style={{
                               width: '100%',
                               border: '1px solid #E4E8F0',
                               padding: '9px 48px'
                           }}
                           onChange={this.searchLegislation}
                    />
                </div>
                <div className="laws">
                    <Scrollbars>
                        {
                            this.props.legalStore.legislation?.map((law, index) => {
                                return <Item law={law} key={index}/>
                            })
                        }
                    </Scrollbars>
                </div>
            </div>
        )
    }
}))

const Article = inject('legalStore', 'permissionsStore')(observer(class Article extends Component{
    constructor(props){
        super(props)

        this.state = {
            preloader: false
        }
    }

    componentDidMount() {
        this.setState({ preloader: true })
        this.props.legalStore.loadLegislationArticle(this.props.match.params.id, (data) => {
            this.setState({ preloader: false })
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

    render(){

        return(
            <div className='law'>
                {
                    this.state.preloader &&
                        <Preloader/>
                }

                <NotificationContainer/>

                <div style={{ marginBottom: 16 }}>
                    <Link style={{ color: '#0052A4' }} to={`/law-database`} onClick={() => this.props.legalStore.breadCrumbs = null}>Законодательная база</Link>
                    <span> -> </span>
                    {
                        this.props.legalStore.breadCrumbs?.map(breadcrumb => {
                            return  <> <Link style={{ color: '#0052A4' }} to={`/law-database/${breadcrumb.resource_id}`}>{ breadcrumb.name }</Link>
                                <span> -> </span>
                            </>
                        })
                    }
                </div>

                <div className="title">{this.props.legalStore.legislationArticle.title}</div>
                <div className="text" dangerouslySetInnerHTML={{__html: this.props.legalStore.legislationArticle.content }}/>
            </div>
        )
    }
}))

const Search = inject('userStore')(observer(class Search extends Component {

    render() {
        return (
            <div className='search-component'>
                <form>
                    <input type="text"
                           placeholder={this.props.userStore.languageList["Введите фразу или слово"] || 'Введите фразу или слово'}
                           className="search__input"
                    />
                </form>
            </div>
        );
    }
}))

export default inject('legalStore', 'permissionsStore')(observer(LawDatabase));