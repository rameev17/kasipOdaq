import React, {Component} from 'react';
import {Link} from "react-router-dom";
import Search from "../../fragments/search";

import {ReactComponent as RemoveIcon} from '../../assets/icons/remove.svg';
import {ReactComponent as EdotIcon} from '../../assets/icons/edit.svg';
import TabsLayout from "../Containers/TabsLayout";
import {inject, observer} from "mobx-react";
import {NotificationContainer, NotificationManager} from "react-notifications";
import CookieService from "../../services/CookieService";
import {ReactComponent as FolderIcon} from "../../assets/icons/folder.svg";

const dateFormat = require('dateformat');

const PpoNews = inject('newsStore', 'permissionsStore', 'unionStore', 'userStore')(observer(class PpoNews extends Component {

    constructor(props){
        super(props);

        this.state = {
            perPage: 10,
            preloader: false,
            newsDeleteModal: false,
            newsId: 0,
            tabs: [
                {name: this.props.userStore.languageList["Новости"] || 'Новости'},
                {name: this.props.userStore.languageList["События"] || 'События'}
            ],
        };

        this.deleteNews = this.deleteNews.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.openNewsDeleteModal = this.openNewsDeleteModal.bind(this);
        this.nextPage = this.nextPage.bind(this);
        this.prevPage = this.prevPage.bind(this);
        this.changeTabCallback = this.changeTabCallback.bind(this);
        this.searchNews = this.searchNews.bind(this)

    }

    componentDidMount() {
        this.state.tab = 2;
        this.setState({ preloader: true }, () => {
            this.props.newsStore.loadUnionNewsList(this.props.match.params.id,null, () => {
                this.setState({ preloader: false })
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
        });

        this.loadUnions()

    }

    loadUnions(){
        this.props.unionStore.pageNumberUnionsPpo = 1;
        if (this.props.match.params.id !== 'undefined' && this.props.match.params.id !== undefined){

            this.props.unionStore.loadUnionsPpo(this.props.match.params.id, null,
                () => {
                    this.setState({ preloader: false });

                    this.props.unionStore.loadUnion(this.props.match.params.id,
                        () => {
                            this.setState({
                                unionName: this.props.unionStore.union.name
                            },() => console.log(this.state.unionName))
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
                        this.setState({ preloader: false });
                        this.props.history.push('/')
                    }
                })
        }else{
            this.props.unionStore.loadUnionsPpo(this.props.userStore.profile.union.resource_id,null,
                () => {
                    this.setState({
                        preloader: false,
                    });

                    this.props.unionStore.loadUnion(this.props.userStore.profile.union.resource_id,
                        () => {
                            this.setState({
                                unionName: this.props.unionStore.union.name
                            }, () => console.log(this.state.unionName))
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

    deleteNews() {
        this.setState({
            preloader: true,
            newsDeleteModal: false,
        });

        let id = this.state.newsId;

        this.props.newsStore.deleteNews(id, () => {

            this.props.newsStore.loadNewsList(() => {

                this.setState({ preloader: false })

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
                CookieService.remove('token-admin');
                this.setState({ preloader: false });
                this.props.history.push('/')
            }
        })

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

    prevPage(){
        this.setState({ preloader: true });
        if (this.props.newsStore.pageNumber > 1){
            this.props.newsStore.pageNumber = this.props.newsStore.pageNumber - 1;
            this.props.newsStore.loadNewsList(() => {
                this.setState({ preloader: false })
            })
        }else{
            this.setState({ preloader: false })
        }
    }

    nextPage(){
        this.setState({ preloader: true });
        if (this.props.newsStore.pageNumber < this.props.newsStore.pageCount){
            this.props.newsStore.pageNumber = this.props.newsStore.pageNumber + 1;
            this.props.newsStore.loadNewsList(() => {
                this.setState({ preloader: false })
            })
        }else{
            this.setState({ preloader: false })
        }
    }

    searchNews(search){
        if (search.length > 2){
            this.setState({ preloader: true });
            if (this.props.match.params.id != 'undefined'){
                this.props.newsStore.loadUnionNewsList(this.props.match.params.id,search, () => {
                    this.setState({ preloader: false })
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
                this.props.newsStore.loadUnionNewsList(this.props.userStore.profile.union.resource_id,search, () => {
                    this.setState({ preloader: false })
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
        }else{
            this.props.newsStore.loadUnionNewsList(this.props.match.params.id,null, () => {
                this.setState({ preloader: false })
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
        switch (tab) {
            case '1':
                this.props.history.push({
                    pathname:`/news`,
                    state: { tabId: 1 }
                });
                break;
            case '2':
                this.props.history.push({
                    pathname:`/news/events/opo/${this.props.match.params.id}`,
                    state: { tabId: 2 }
                });
                break;
            default:
                this.props.history.push({
                    pathname:`/news`,
                    state: { tabId: 1 }
                })
        }
    };

    render() {

        return (
            <div className='content'>
                <div className='articles'>
                    <div className="title-wrapper">
                        {/*<h1 className='title'>title</h1>*/}
                        {/*<Link className='add-article' to={`/news/ppo/1/article/add`}>*/}
                        {/*    /!*<span>Добавить событие</span>*!/*/}
                        {/*    <span>Добавить новость</span>*/}
                        {/*</Link>*/}

                        <React.Fragment>
                            <h1 className='title'>{ this.props.userStore.role == 'company' ?
                                this.props.userStore.languageList["События"] || 'События' :
                                this.props.userStore.languageList["Новости"] || 'Новости'
                            }</h1>
                            {
                                this.props.permissionsStore.hasPermission('news', 'create') &&
                                <Link className='add-article' to={`/news/article/add`}>
                                    <span>{ this.props.userStore.role == 'company' ?
                                        this.props.userStore.languageList["Добавить событие"] || 'Добавить событие' :
                                        this.props.userStore.languageList["Добавить новость"] || 'Добавить новость' }</span>
                                </Link>
                            }
                        </React.Fragment>

                    </div>
                    <div className={"" + (this.role !== 'rManagerOpo' ? 'panel' : '')}>

                        <div style={{ marginBottom: 16 }}>
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
                                            );
                                            break;
                                        case 'association':
                                            return (
                                                <> <Link style={{color: '#0052A4'}} to={`/news/top/${breadcrumb.resource_id}`}>{breadcrumb.name}</Link>
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
                                                         to={`/news/events/${breadcrumb.resource_id}`}>{breadcrumb.name}</Link>
                                                    {
                                                        index !== this.props.unionStore.breadCrumbs.length - 1 &&
                                                        <span> -> </span>
                                                    }
                                                </>
                                            );
                                            break;
                                        case 'branch':
                                            return (
                                                <> <Link style={{color: '#0052A4'}} to={`/news/events/${breadcrumb.resource_id}`}>{breadcrumb.name}</Link>
                                                    {
                                                        index !== this.props.unionStore.breadCrumbs.length - 1 &&
                                                        <span> -> </span>
                                                    }
                                                </>
                                            );
                                            break;
                                        case 'union':
                                            return (
                                                <> <Link style={{color: '#0052A4'}} to={`/news/events/${breadcrumb.resource_id}`}>{breadcrumb.name}</Link>
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

                        <TabsLayout changeTabCallback={this.changeTabCallback}
                                    tabs={this.state.tabs}>

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
                                        <td className="edit"/>
                                        <td className="remove"/>
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
                                                {
                                                    this.props.permissionsStore.hasPermission('news', 'edit') &&
                                                    <td className="edit">

                                                        {/*<Link to={`/news/opo/1/article/1/edit`}>*/}
                                                        {/*    <div className="btn-action">*/}
                                                        {/*        <div className="icon">*/}
                                                        {/*            <EditIcon/>*/}
                                                        {/*        </div>*/}
                                                        {/*    </div>*/}
                                                        {/*</Link>*/}


                                                        {
                                                            this.props.userStore.role == 'company' &&
                                                            <a href={`/news/article/${news.resource_id}/edit`}>
                                                                <div className="btn-action">
                                                                    <div className="icon">
                                                                        <EdotIcon/>
                                                                    </div>
                                                                </div>
                                                            </a>
                                                        }

                                                    </td>
                                                }

                                                {
                                                    this.props.permissionsStore.hasPermission('news', 'delete') &&
                                                    <td className="remove">
                                                        {
                                                            this.props.userStore.role !== 'fprk' &&
                                                            <div className="btn-action" data-id={news.resource_id} onClick={this.openNewsDeleteModal}>
                                                                <div className="icon" >
                                                                    <RemoveIcon data-id={news.resource_id}/>
                                                                </div>
                                                            </div>
                                                        }
                                                    </td>
                                                }

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

export default PpoNews;