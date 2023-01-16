import React, {Component} from 'react';
import TabsLayout from "../Containers/TabsLayout"
import {Link} from "react-router-dom";
import Search from "../../fragments/search";

import {ReactComponent as RemoveIcon} from '../../assets/icons/remove.svg';
import {ReactComponent as EditIcon} from '../../assets/icons/edit.svg';
import {inject, observer} from "mobx-react";
import {NotificationContainer, NotificationManager} from "react-notifications";
import qs from "query-string";

const dateFormat = require('dateformat');

class DisputeDirection extends Component {
    constructor(props) {
        super(props);

        this.state = {
            title: 'Трудовой спор',
            categoryId: null,
        };


        this.loadPage = this.loadPage.bind(this);
        this.changeTabCallback = this.changeTabCallback.bind(this);
        this.deleteDispute = this.deleteDispute.bind(this);
        this.prevPage = this.prevPage.bind(this);
        this.nextPage = this.nextPage.bind(this);
        this.loadPage = this.loadPage.bind(this);
        this.searchDispute = this.searchDispute.bind(this)
    }

    loadPage(){

        if (this.props.match.params.id !== 'undefined' && this.props.match.params.id !== undefined){
            this.props.disputeStore.loadDisputeList(
                this.props.match.params.id,
                this.state.categoryId,
                null,
                () => {
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
            this.props.disputeStore.loadDisputeList(
                this.props.userStore.profile.union.resource_id,
                this.state.categoryId,
                null,
                () => {
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

    componentDidMount() {
        const values = qs.parse(this.props.location.search);
        const category_id = values.category_id;
        this.setState({
            categoryId: category_id
        }, () => {
            this.loadPage();
            this.loadUnions()
        });

        this.props.disputeStore.loadCategoryInfoDispute(() => {
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

    loadUnions(){
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

    deleteDispute(event){

        let id = event.target.dataset.id;

        this.props.disputeStore.deleteDispute(id, () => {
            this.loadPage()
        })
    }

    changeTabCallback = (tab) => {
        switch (tab) {
            case '1':
                this.props.history.push({
                    pathname:`/dispute`,
                    state: { tabId: 1 }
                });
                break;
            case '2':
                this.props.history.push({
                    pathname: `/dispute/info`,
                    state: { tabId: 2,
                             title: this.state.title}
                });
                break;
            default:
                this.props.history.push({
                    pathname:`/dispute`,
                    state: { tabId: 1 }
                })
        }
    };

    prevPage(){
        this.setState({ preloader: true });
        if (this.props.disputeStore.pageNumber > 1){
            this.props.disputeStore.pageNumber = this.props.disputeStore.pageNumber - 1;
            this.loadPage()
        }else{
            this.setState({ preloader: false })
        }
    }

    nextPage(){
        this.setState({ preloader: true });
        if (this.props.disputeStore.pageNumber < this.props.disputeStore.pageCount){
            this.props.disputeStore.pageNumber = this.props.disputeStore.pageNumber + 1;
            this.loadPage()
        }else{
            this.setState({ preloader: false })
        }
    }

    searchDispute(search){
        if (search.length > 2){
            this.setState({ preloader: true });
            if (this.props.match.params.id !== 'undefined' && this.props.match.params.id !== undefined){
                this.props.disputeStore.loadDisputeList(this.props.match.params.id, this.state.categoryId, search,() => {
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
                this.props.disputeStore.loadDisputeList(this.props.userStore.profile.union.resource_id, this.state.categoryId, search, () => {
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
            this.loadPage()
        }
    }

    render() {

        const tabs = [
            {name: this.props.userStore.languageList['Споры'] || 'Споры'},
            {name: this.props.userStore.languageList['Информация'] || 'Информация'}
        ];

        return (
            <div className='discussion-direction content'>
                <div className="title-wrapper">
                    <h1 className="title">{this.props.userStore.languageList["Трудовой спор"] || 'Трудовой спор'}</h1>
                    {
                        this.props.userStore.role !== 'fprk' &&
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
                            this.props.userStore.role == 'company' &&
                            this.props.disputeStore.disputeInfoCategory.map(category => {
                                return  category.resource_id == this.state.categoryId &&
                                    <>
                                    <Link style={{color: '#0052A4'}} to={`/dispute`}>{this.props.userStore.languageList['Все категории'] || 'Все категории'}</Link>
                                    <span> -> </span>
                                    <Link style={{color: '#0052A4'}} to={`/dispute`}>{ category.name }</Link>
                                    </>
                            })
                        }

                        {
                            this.props.userStore.role !== 'company' &&
                            this.props.unionStore.breadCrumbs?.map((breadcrumb, index) => {
                                switch (breadcrumb.level) {
                                    case 'main_union':
                                        return (
                                            <> <Link style={{color: '#0052A4'}} to={`/dispute`}>{breadcrumb.name}</Link>
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
                                                     to={`/dispute/ppo/${breadcrumb.resource_id}`}>{breadcrumb.name}</Link>
                                                {
                                                    index !== this.props.unionStore.breadCrumbs.length - 1 &&
                                                    <span> -> </span>
                                                }
                                            </>
                                        );
                                        break;
                                    case 'branch':
                                        return (
                                            <> <Link style={{color: '#0052A4'}} to={`/dispute/ppo/${breadcrumb.resource_id}`}>{breadcrumb.name}</Link>
                                                {
                                                    index !== this.props.unionStore.breadCrumbs.length - 1 &&
                                                    <span> -> </span>
                                                }
                                            </>
                                        );
                                        break;
                                    case 'union':
                                        return (
                                            <> <Link style={{color: '#0052A4'}} to={`/dispute/list/categories/${breadcrumb.resource_id}`}>{breadcrumb.name}</Link>
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

                    <TabsLayout tabs={tabs}
                                changeTabCallback={this.changeTabCallback}>
                        <Search
                            currentPage={this.props.disputeStore.currentPage}
                            pageCount={this.props.disputeStore.pageCount}
                            prevPage={this.prevPage}
                            nextPage={this.nextPage}
                            search={this.searchDispute}
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
                                        this.props.userStore.role !== 'fprk' && this.props.userStore.role !== 'industry' &&
                                        <td className="edit"/>
                                    }
                                    {
                                        this.props.userStore.role !== 'fprk' && this.props.userStore.role !== 'industry' &&
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
                                                this.props.userStore.role !== 'fprk' && this.props.userStore.role !== 'industry' &&
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
                                                this.props.userStore.role !== 'fprk' && this.props.userStore.role !== 'industry' &&
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
            </div>
        );
    }
}

export default inject('disputeStore', 'unionStore', 'permissionsStore', 'userStore')(observer(DisputeDirection));