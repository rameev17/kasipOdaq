import React, {Component} from 'react';
import {Link} from "react-router-dom";
import Search from "../../fragments/search";

import {ReactComponent as RemoveIcon} from '../../assets/icons/remove.svg';
import {ReactComponent as EdotIcon} from '../../assets/icons/edit.svg';
import {inject, observer} from "mobx-react";
import Preloader from "../../fragments/preloader/Preloader";
import {ModalDeleteNews} from "../../fragments/modals/Modal";
import {NotificationContainer, NotificationManager} from "react-notifications";
import Modal from "react-modal";
import CookieService from "../../services/CookieService";
import TabsLayout from "../Containers/TabsLayout";
import {ReactComponent as FolderIcon} from "../../assets/icons/folder.svg";

const dateFormat = require('dateformat');

const EventsList = inject('newsStore', 'permissionsStore', 'userStore', 'unionStore')(observer(class EventsList extends Component {

    constructor(props){
        super(props)

        this.state = {
            perPage: 10,
            preloader: false,
            newsDeleteModal: false,
            newsId: 0,
            tabs: [
                {name: this.props.userStore.languageList["Новости"] || 'Новости'},
                {name: this.props.userStore.languageList["События"] || 'События'}
            ],
        }

        this.closeModal = this.closeModal.bind(this)
        this.openNewsDeleteModal = this.openNewsDeleteModal.bind(this)
        this.nextPage = this.nextPage.bind(this)
        this.prevPage = this.prevPage.bind(this)
        this.nextPageIndustries = this.nextPageIndustries.bind(this)
        this.prevPageIndustries = this.prevPageIndustries.bind(this)
        this.changeTabCallback = this.changeTabCallback.bind(this)
        this.loadUnions = this.loadUnions.bind(this)
        this.searchNews = this.searchNews.bind(this)
        this.searchIndustries = this.searchIndustries.bind(this)
    }

    componentDidMount() {
       this.loadPage()
    }

    loadPage(){
        if (this.props.match.params.id !== undefined && this.props.match.params.id !== 'undefined'){

            this.setState({ preloader: true })

            this.props.userStore.profileInfo(() => {
                this.props.unionStore.loadIndustries(null,
                    data => {
                        this.setState({
                            preloader: false,
                        })
                    })
            })

            this.props.newsStore.loadUnionNewsList(this.props.match.params.id,null, () => {
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
                    this.setState({ preloader: false })
                    this.props.history.push('/')
                }
            })

        }else{
            this.setState({ preloader:true })
            this.props.userStore.profileInfo(() => {
                this.props.unionStore.loadIndustries(null,
                    data => {
                        this.setState({
                            preloader: false
                        })
                    })

                this.props.newsStore.loadUnionNewsList(this.props.userStore.profile.union.resource_id,null, () => {
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
                        this.setState({ preloader: false })
                        this.props.history.push('/')
                    }
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
                    this.setState({ preloader: false })
                    this.props.history.push('/')
                }
            })
        }
    }

    openNewsDeleteModal(event){
        this.setState({
            newsDeleteModal: true,
            newsId: event.target.dataset.id,
        })
    }

    closeModal(){
        this.setState({
            newsDeleteModal: false
        })
    }

    searchNews(search){
        if (search.length > 2){
            this.setState({ preloader: true })
            if (this.props.match.params.id != 'undefined'){
                this.props.newsStore.loadUnionNewsList(this.props.match.params.id,search, () => {
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
                        this.setState({ preloader: false })
                        this.props.history.push('/')
                    }
                })
            }else{
                this.props.newsStore.loadUnionNewsList(this.props.userStore.profile.union.resource_id,search, () => {
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
                        this.setState({ preloader: false })
                        this.props.history.push('/')
                    }
                })
            }
        }else{
            this.loadPage()
        }
    }

    prevPage(){
        this.setState({ preloader: true })
        if (this.props.newsStore.pageNumber > 1){
            this.props.newsStore.pageNumber = this.props.newsStore.pageNumber - 1
            this.props.newsStore.loadNewsList(() => {
                this.setState({ preloader: false })
            })
        }else{
            this.setState({ preloader: false })
        }
    }

    nextPage(){
        this.setState({ preloader: true })
        if (this.props.newsStore.pageNumber < this.props.newsStore.pageCount){
            this.props.newsStore.pageNumber = this.props.newsStore.pageNumber + 1
            this.props.newsStore.loadNewsList(() => {
                this.setState({ preloader: false })
            })
        }else{
            this.setState({ preloader: false })
        }
    }

    prevPageIndustries(){
        this.setState({ preloader: true })
        if (this.props.unionStore.pageNumberIndustries > 1){
            this.props.unionStore.pageNumberIndustries = this.props.unionStore.pageNumberIndustries - 1
            this.loadPage()
            // this.props.unionStore.loadIndustries(
            //     null,() => {
            //     this.setState({ preloader: false })
            // })
        }else{
            this.setState({ preloader: false })
        }
    }

    nextPageIndustries(){
        this.setState({ preloader: true })
        if (this.props.unionStore.pageNumberIndustries < this.props.unionStore.pageCountIndustries){
            this.props.unionStore.pageNumberIndustries = this.props.unionStore.pageNumberIndustries + 1
            this.loadPage()
            // this.props.unionStore.loadIndustries(
            //     null,() => {
            //     this.setState({ preloader: false })
            // })
        }else{
            this.setState({ preloader: false })
        }
    }

    searchIndustries(search){
        if (search.length > 2){
            // this.setState({ preloader: true })
            this.props.unionStore.loadIndustries(
                search,
                () => {
                    this.setState({
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
                        this.setState({ preloader: false })
                        this.props.history.push('/')
                    }
                }
            )
        }else{
            this.loadPage()
        }
    }

    changeTabCallback = (tab) => {
        switch (tab) {
            case '1':
                this.props.history.push({
                    pathname:`/news`,
                    state: { tabId: 1 }
                })
                break;
            case '2':
                this.props.history.push({
                    pathname:`/news/events/1`,
                    state: { tabId: 2 }
                })
                break;
            default:
                this.props.history.push({
                    pathname:`/news`,
                    state: { tabId: 1 }
                })
        }
    }

    loadUnions(union){

        this.setState({ preloader: true })
        this.props.unionStore.pageNumberUnionsPpo = 1;

        this.props.unionStore.loadUnionsPpo(union.resource_id, null,() => {
            this.setState({
                preloader: false,
            })

            if (union.has_child){
                this.props.unionStore.pageNumberUnionsPpo = 1;
                this.props.history.push(`/news/events/opo/${union.resource_id}`)
                this.props.newsStore.loadUnionNewsList(this.props.match.params.id, null,() => {
                    this.setState({ preloader: false })
                })
            }else{
                this.props.unionStore.pageNumberUnionsPpo = 1;
                this.props.history.push(`/news/top/${union.resource_id}`)
            }

            this.props.unionStore.loadUnion(union.resource_id,
                () => {
                    this.setState({
                        unionName: this.props.unionStore.union.name
                    }, () => console.log(this.state.unionName))
                })

        }, response => {
            if (Array.isArray(response.data)) {
                response.data.forEach(error => {
                    this.setState({ preloader: false })
                    // NotificationManager.error(error.message)
                })
            } else {
                this.setState({ preloader: false })
                // NotificationManager.error(response.data.message)
            }
            if (response.status == 401){
                this.setState({ preloader: false })
                this.props.history.push('/')
            }
        })
    }

    render() {

        return (
            <div className='content'>

                {
                    this.state.preloader &&
                    <Preloader/>
                }

                <NotificationContainer/>

                <div className='articles'>
                    <div className="title-wrapper">

                    </div>
                    <div className={"" + (this.role !== 'rManagerOpo' ? 'panel' : '')}>
                        <TabsLayout changeTabCallback={this.changeTabCallback}
                                    tabs={this.state.tabs}>

                            <div style={{ marginTop: 16, marginBottom: 16 }}>
                                {
                                    this.props.unionStore.breadCrumbs?.map((breadcrumb, index) => {
                                        switch (breadcrumb.level) {
                                            case 'main_union':
                                                return (
                                                    <> <Link style={{color: '#0052A4'}} to={`/news`}>{breadcrumb.name}</Link>
                                                        {
                                                            index !== this.props.unionStore.breadCrumbs.length - 1 &&
                                                            <span> -> </span>
                                                        }
                                                    </>
                                                )
                                                break;
                                            case 'association':
                                                return (
                                                    index !== this.props.unionStore.breadCrumbs.length - 1 &&
                                                    <> <Link style={{color: '#0052A4'}} to={`/news/top/${breadcrumb.resource_id}`}>{breadcrumb.name}</Link>
                                                        {
                                                            index !== this.props.unionStore.breadCrumbs.length - 1 &&
                                                            <span> -> </span>
                                                        }
                                                    </>
                                                )
                                                break;
                                            case 'industry':
                                                return (
                                                    <> <a style={{color: '#0052A4'}}
                                                             href={`/news/events/opo/${breadcrumb.resource_id}`}>{breadcrumb.name}</a>
                                                        {
                                                            index !== this.props.unionStore.breadCrumbs.length - 1 &&
                                                            <span> -> </span>
                                                        }
                                                    </>
                                                )
                                                break;
                                            case 'branch':
                                                return (
                                                    <> <a style={{color: '#0052A4'}} href={`/news/events/opo/${breadcrumb.resource_id}`}>{breadcrumb.name}</a>
                                                        {
                                                            index !== this.props.unionStore.breadCrumbs.length - 1 &&
                                                            <span> -> </span>
                                                        }
                                                    </>
                                                )
                                                break;
                                            case 'union':
                                                return (
                                                    index !== this.props.unionStore.breadCrumbs.length - 1 &&
                                                    <> <a style={{color: '#0052A4'}} href={`/news/events/opo/${breadcrumb.resource_id}`}>{breadcrumb.name}</a>
                                                        {
                                                            index !== this.props.unionStore.breadCrumbs.length - 1 &&
                                                            <span> -> </span>
                                                        }
                                                    </>
                                                )
                                                break;
                                        }
                                    })
                                }
                            </div>

                            {
                                this.props.unionStore.union.association_union &&
                                this.props.unionStore.union.kind !== 'union' &&
                                <>
                                    <br/>

                                    <h2 className='from'>
                                        {/*{ this.props.unionStore.union.association_union?.name }*/}
                                        Территориальное объединение профсоюзов
                                        {this.props.userStore.languageList["Территориальное объединение профсоюзов"]
                                        || 'Территориальное объединение профсоюзов'}
                                    </h2>
                                    <ul className="list__wrapper">
                                        <li>
                                            <Link to={`/news/top/${this.props.unionStore.union.association_union?.resource_id}`}>
                                                <div className="icon">
                                                    <FolderIcon/>
                                                </div>
                                                { this.props.unionStore.union.association_union?.name }
                                            </Link>
                                        </li>
                                    </ul>
                                </>
                            }

                            <br/>

                            <h2 className='from'>
                                { this.props.unionStore.union.name }
                            </h2>
                            <Search
                                currentPage={this.props.unionStore.currentPageIndustries}
                                pageCount={this.props.unionStore.pageCountIndustries}
                                search={this.searchIndustries}
                                prevPage={this.prevPageIndustries}
                                nextPage={this.nextPageIndustries}
                            />
                            <ul className="list__wrapper">
                                {
                                    this.props.unionStore.industriesList.map(union => {
                                        return  <li>
                                            <Link onClick={() => this.loadUnions(union)}>
                                                <div className="icon">
                                                    <FolderIcon/>
                                                </div>
                                                { union.name }
                                            </Link>
                                        </li>
                                    })
                                }
                            </ul>

                            <br/>

                            <Search currentPage={this.props.newsStore.currentPage}
                                    pageCount={this.props.newsStore.pageCount}
                                    search={this.searchNews}
                                    prevPage={this.prevPage}
                                    nextPage={this.nextPage}
                                    showSearchString={false}/>
                            <div className="articles-list-list">
                                <table>
                                    <thead className="heading">
                                    <tr>
                                        <td className="title">{this.props.userStore.languageList["Название"] || 'Название'}</td>
                                        <td className="date">{this.props.userStore.languageList["Дата публикации"] || 'Дата публикации'}</td>
                                        <td className="status">{this.props.userStore.languageList["Статус"] || 'Статус'}</td>
                                    </tr>
                                    </thead>
                                    <tbody className="list">
                                    {
                                        this.props.newsStore.newsList.map((news, index) => {
                                            return <tr key={index}>
                                                <td className="title">
                                                    <Link to={`/news/${news.resource_id}`} style={{ color: "#2E384D" }}>{news.title}</Link>
                                                </td>
                                                <td className="date">{ dateFormat(news.updated_date, 'dd/mm/yyyy, hh:mm:ss') }</td>
                                                <td className="status">
                                                    {
                                                        news.is_published ?
                                                            <span>{this.props.userStore.languageList["Опубликовано"] || 'Опубликовано'}</span>
                                                            :
                                                            <span>{this.props.userStore.languageList["Не опубликовано"] || 'Не опубликовано'}</span>
                                                    }
                                                </td>

                                            </tr>
                                        })
                                    }
                                    </tbody>
                                </table>

                            </div>
                        </TabsLayout>
                    </div>
                </div>

            </div>
        );
    }
}));

export default EventsList;