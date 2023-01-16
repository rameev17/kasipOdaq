import React, {Component} from 'react';
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import Search from "../../fragments/search";
import {withRouter} from 'react-router-dom'

import {ReactComponent as FolderIcon} from '../../assets/icons/folder.svg'
import {inject, observer} from "mobx-react";
import {NotificationContainer, NotificationManager} from "react-notifications";
import {ReactComponent as LeftArrowIcon} from "../../assets/icons/arrow.svg";
import TabsLayout from "../Containers/TabsLayout";
import {ReactComponent as EditIcon} from "../../assets/icons/edit.svg";
import {ReactComponent as RemoveIcon} from "../../assets/icons/remove.svg";
import qs from "query-string";
const dateFormat = require('dateformat');

class OpoDisputeList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            preloader: false,
            title: 'Трудовой спор',
            tabs: [
                {name: this.props.userStore.languageList["Споры"] || 'Споры'},
                {name: this.props.userStore.languageList["Информация"] || 'Информация'}
            ],
        }

        this.loadPage = this.loadPage.bind(this)
        this.prevPage = this.prevPage.bind(this)
        this.nextPage = this.nextPage.bind(this)
        this.deleteDispute = this.deleteDispute.bind(this)
        this.changeTabCallback = this.changeTabCallback.bind(this)
    }

    componentDidMount() {
        this.loadPage()
        const values = qs.parse(this.props.location.search);
        const category_id = values.category_id;
        console.log(category_id)
        if (this.props.match.params.id !== 'undefined' && this.props.match.params.id !== undefined){
            this.props.disputeStore.loadDisputeList(
                this.props.match.params.id,
                category_id,
                null,
                () => {
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
            this.props.disputeStore.loadDisputeList(
                undefined,
                category_id,
                null,
                () => {
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
    }

    deleteDispute(event){

        let id = event.target.dataset.id;

        const values = qs.parse(this.props.location.search);
        const category_id = values.category_id;

        this.props.disputeStore.deleteDispute(id, () => {
            if (this.props.match.params.id !== 'undefined' && this.props.match.params.id !== undefined){
                this.props.disputeStore.loadDisputeList(
                    this.props.match.params.id,
                    category_id,
                    () => {
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
                this.props.disputeStore.loadDisputeList(
                    undefined,
                    category_id,
                    () => {
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
        })
    }

    loadPage(){
        if (this.props.match.params.id !== 'undefined' && this.props.match.params.id !== undefined){
            this.props.unionStore.loadUnionsPpo(this.props.match.params.id,null,(data) => {
                this.setState({ preloader: false })
                this.props.unionStore.breadCrumbs = data[0].bread_crumbs
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
        }else{
            this.props.unionStore.loadUnionsPpo(
                this.props.userStore.profile.union.resource_id,null,(data) => {
                this.setState({ preloader: false })
                    this.props.unionStore.breadCrumbs = data[0].bread_crumbs
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

    prevPage(){
        this.setState({ preloader: true })
        if (this.props.unionStore.pageNumberUnionsPpo > 1){
            this.props.unionStore.pageNumberUnionsPpo = this.props.unionStore.pageNumberUnionsPpo - 1
            this.loadPage()
        }else{
            this.setState({ preloader: false })
        }
    }

    nextPage(){
        this.setState({ preloader: true })
        if (this.props.unionStore.pageNumberUnionsPpo < this.props.unionStore.pageCountUnionsPpo){
            this.props.unionStore.pageNumberUnionsPpo = this.props.unionStore.pageNumberUnionsPpo + 1
            this.loadPage()
        }else{
            this.setState({ preloader: false })
        }
    }

    changeTabCallback = (tab) => {
        switch (tab) {
            case '1':
                this.props.history.push({
                    pathname:`/dispute`,
                    state: { tabId: 1 }
                })
                break;
            case '2':
                this.props.history.push({
                    pathname: `/dispute/info`,
                    state: { tabId: 2,
                        title: this.state.title}
                })
                break;
            default:
                this.props.history.push({
                    pathname:`/dispute`,
                    state: { tabId: 1 }
                })
        }
    }

    render() {
        return (
            <>
                <div className="title-wrapper">
                    <h1 className="title">{this.props.userStore.languageList["Трудовой спор"] || 'Трудовой спор'}</h1>
                    {
                        this.props.userStore.role !== 'fprk' &&
                        this.props.userStore.role !== 'association' &&
                        <>
                            {
                                this.props.match.params.id !== undefined && this.props.match.params.id !== 'undefined' ?
                                    <Link
                                        to={{pathname:`/dispute/add-dispute/` + this.props.match.params.id }}>
                                        {this.props.userStore.languageList["Добавить спор"] || 'Добавить спор'}
                                    </Link>
                                    :
                                    <Link
                                        to={{pathname:`/dispute/add-dispute/` + this.props.userStore.profile.union.resource_id }}>
                                        {this.props.userStore.languageList["Добавить спор"] || 'Добавить спор'}
                                    </Link>
                            }
                        </>
                    }
                </div>

                <div className="panel">

                    <div style={{ marginBottom: 16 }}>
                        {
                            this.props.unionStore.breadCrumbs?.map((breadcrumb, index) => {
                                switch (index) {
                                    case 0:
                                        return (
                                            <> <Link style={{color: '#0052A4'}} to={`/dispute`}>{breadcrumb.name}</Link>
                                                {
                                                    index !== this.props.unionStore.breadCrumbs.length - 1 &&
                                                    <span> -> </span>
                                                }
                                            </>
                                        )
                                        break;
                                    case 1:
                                        return (
                                            <> <Link style={{color: '#0052A4'}}
                                                     to={`/dispute/ppo/${breadcrumb.resource_id}`}>{breadcrumb.name}</Link>
                                                {
                                                    index !== this.props.unionStore.breadCrumbs.length - 1 &&
                                                    <span> -> </span>
                                                }
                                            </>
                                        )
                                        break;
                                    case 2:
                                        return (
                                            index !== this.props.unionStore.breadCrumbs.length - 1 &&
                                            <> <Link style={{color: '#0052A4'}} to={`/dispute/ppo/${breadcrumb.resource_id}`}>{breadcrumb.name}</Link>
                                                {
                                                    index !== this.props.unionStore.breadCrumbs.length - 1 &&
                                                    <span> -> </span>
                                                }
                                            </>
                                        )
                                        break;
                                    case 3:
                                        return (
                                            index !== this.props.unionStore.breadCrumbs.length - 1 &&
                                            <> <Link style={{color: '#0052A4'}} to={`/dispute/list/categories/${breadcrumb.resource_id}`}>{breadcrumb.name}</Link>
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

                    <TabsLayout tabs={this.state.tabs}
                                changeTabCallback={this.changeTabCallback}>
                        <Search
                            currentPage={this.props.disputeStore.currentPage}
                            pageCount={this.props.disputeStore.pageCount}
                            prevPage={this.prevPage}
                            nextPage={this.nextPage}
                            showSearchString={false}
                        />
                        <table>
                            <thead className="heading">
                            <tr>
                                <td className="subject">{this.props.userStore.languageList["Тема"] || 'Тема'}</td>
                                <td className="date">{this.props.userStore.languageList["Дата"] || 'Дата'}</td>
                                <td className="status">{this.props.userStore.languageList["Результат"] || 'Результат'}</td>
                                <td className="status">{this.props.userStore.languageList["Опубликовано"] || 'Опубликовано'}</td>
                                <React.Fragment>
                                    {
                                        this.props.userStore.role !== 'fprk' &&
                                        <td className="edit"/>
                                    }
                                    {
                                        this.props.userStore.role !== 'fprk' &&
                                        <td className="remove"/>
                                    }
                                </React.Fragment>
                            </tr>
                            </thead>
                            <tbody className="list">
                            {
                                this.props.disputeStore.disputeList.map((dispute, index) => {
                                    return <tr className={'shown'} key={index} >
                                        <td className="subject" onClick={() => this.props.history.push('/dispute/' + dispute.resource_id) }>{ dispute.title }</td>

                                        <td className="date published">
                                            <div className="opened">{ dateFormat(dispute.start_date, 'dd.mm.yyyy, hh:mm:ss') }</div>
                                            {
                                                dispute.resolved &&
                                                <div className="closed">{ dateFormat(dispute.finish_date, 'dd.mm.yyyy, hh:mm:ss') }</div>
                                            }
                                        </td>
                                        <td className="status">
                                            {
                                                dispute.resolved ?
                                                    <span>{this.props.userStore.languageList["Решено"] || 'Решено'}</span>
                                                    :
                                                    <span>{this.props.userStore.languageList["В процессе"] || 'В процессе'}</span>
                                            }
                                        </td>
                                        <td className="status">
                                            {
                                                dispute.resolved ?
                                                    <span>{this.props.userStore.languageList["Опубликовано"] || 'Опубликовано'}</span>
                                                    :
                                                    <span>{this.props.userStore.languageList["Не опубликовано"] || 'Не опубликовано'}</span>
                                            }
                                        </td>

                                        <React.Fragment>
                                            {
                                                this.props.userStore.role !== 'fprk' &&
                                                <td className="edit">
                                                    <Link to={{
                                                        pathname: `/dispute/edit/` + dispute.resource_id
                                                    }}>
                                                        <div className="btn-action">
                                                            <div className="icon">
                                                                <EditIcon />
                                                            </div>
                                                        </div>
                                                    </Link>
                                                </td>
                                            }
                                            {
                                                this.props.userStore.role !== 'fprk' &&
                                                <td className="remove">
                                                    <div className="btn-action" data-id={dispute.resource_id} onClick={this.deleteDispute}>
                                                        <div className="icon" data-id={dispute.resource_id}>
                                                            <RemoveIcon data-id={dispute.resource_id}/>
                                                        </div>
                                                    </div>
                                                </td>
                                            }
                                        </React.Fragment>
                                    </tr>
                                })
                            }
                            </tbody>
                        </table>
                    </TabsLayout>
                </div>

                <div className={'panel'}>
                    <div className='ppos-list'>
                        <Search
                            currentPage={this.props.unionStore.currentPageUnionsPpo}
                            pageCount={this.props.unionStore.pageCountUnionsPpo}
                            prevPage={this.prevPage}
                            nextPage={this.nextPage}
                        />

                        <ul className="list__wrapper">
                            {
                                this.props.unionStore.unionsPpoList.map(union => (
                                    <li>
                                        <Link to={`/dispute/list/categories/` + union.resource_id}>
                                            <div className="icon">
                                                <FolderIcon/>
                                            </div>
                                            { union.name }
                                        </Link>
                                    </li>
                                ))}
                        </ul>
                    </div>
                </div>
            </>
        );
    }
}

export default withRouter(inject('permissionsStore', 'unionStore', 'userStore', 'disputeStore')(observer(OpoDisputeList)));