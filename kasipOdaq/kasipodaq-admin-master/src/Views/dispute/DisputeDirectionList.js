import React, {Component} from 'react';
import TabsLayout from "../Containers/TabsLayout"
import {Link} from "react-router-dom";
import Search from "../../fragments/search";

import {ReactComponent as RemoveIcon} from '../../assets/icons/remove.svg';
import {ReactComponent as EditIcon} from '../../assets/icons/edit.svg';
import {ReactComponent as LeftArrowIcon} from '../../assets/icons/arrow.svg';
import {inject, observer} from "mobx-react";
import {NotificationContainer, NotificationManager} from "react-notifications";

const dateFormat = require('dateformat');

class DisputeDirectionList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            title: this.props.userStore.languageList["Трудовой спор"] || 'Трудовой спор',
            tabs: [
                {name: this.props.userStore.languageList["Споры"] || 'Споры'},
                {name: this.props.userStore.languageList["Информация"] || 'Информация'}
            ],
        }

        this.changeTabCallback = this.changeTabCallback.bind(this)
    }

    componentDidMount() {
        this.props.disputeStore.loadCategoryInfoDispute(() => {
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

        this.loadUnions()
    }

    loadUnions(){
        if (this.props.match.params.id !== 'undefined' && this.props.match.params.id !== undefined){

            this.props.unionStore.loadUnionsPpo(this.props.match.params.id, null,
                () => {
                    this.setState({ preloader: false })

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
                        this.setState({ preloader: false })
                        this.props.history.push('/')
                    }
                })
        }else{
            this.props.unionStore.loadUnionsPpo(this.props.userStore.profile.union.resource_id,null,
                () => {
                    this.setState({
                        preloader: false,
                    })

                    this.props.unionStore.loadUnion(this.props.userStore.profile.union.resource_id,
                        () => {
                            this.setState({
                                unionName: this.props.unionStore.union.name
                            }, () => console.log(this.state.unionName))
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

    changeTabCallback = (tab) => {
        switch (tab) {
            case '1':
                this.props.userStore.role == 'company' ?
                this.props.history.push({
                    pathname:`/dispute`,
                    state: { tabId: 1 }
                })
                :
                this.props.history.push({
                    pathname:`/dispute/list/categories/${this.props.match.params.id}`,
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
                this.props.userStore.role == 'company' ?
                    this.props.history.push({
                        pathname:`/dispute`,
                        state: { tabId: 1 }
                    })
                    :
                    this.props.history.push({
                        pathname:`/dispute/list/categories/${this.props.match.params.id}`,
                        state: { tabId: 1 }
                    })
        }
    }

    render() {

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

                    {
                        this.props.userStore.role !== 'company' &&
                        <div style={{ marginBottom: 16 }}>
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
                                            )
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
                                            )
                                            break;
                                        case 'branch':
                                            return (
                                                <> <Link style={{color: '#0052A4'}} to={`/dispute/ppo/${breadcrumb.resource_id}`}>{breadcrumb.name}</Link>
                                                    {
                                                        index !== this.props.unionStore.breadCrumbs.length - 1 &&
                                                        <span> -> </span>
                                                    }
                                                </>
                                            )
                                            break;
                                        case 'union':
                                            return (
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
                    }

                    <TabsLayout tabs={this.state.tabs}
                                changeTabCallback={this.changeTabCallback}>
                        
                        <div className="plate-wrapper plate-wrapper__height">
                            <div className='menu-dispute'>
                                <ul>
                                    {
                                        this.props.disputeStore.disputeInfoCategory.map((category, index) => {
                                            return  <li key={index} className={'dispute-category'}>
                                                <Link to={`/dispute/list/${this.props.match.params.id || this.props.userStore.profile.union?.resource_id}/?category_id=${category.resource_id}`}>
                                                    <div className="menu-dispute__link">{this.props.userStore.languageList[category.name] || category.name}</div>
                                                    <div className="icon">
                                                        <LeftArrowIcon/>
                                                    </div>
                                                </Link>
                                            </li>
                                        })
                                    }
                                </ul>
                            </div>
                        </div>
                    </TabsLayout>
                </div>
            </div>
        );
    }
}

export default inject('disputeStore', 'unionStore', 'permissionsStore', 'userStore')(observer(DisputeDirectionList));