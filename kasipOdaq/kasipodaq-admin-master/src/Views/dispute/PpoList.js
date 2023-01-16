import React, {Component} from 'react';
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import Search from "../../fragments/search";
import {withRouter} from 'react-router-dom'

import {ReactComponent as FolderIcon} from '../../assets/icons/folder.svg'
import {inject, observer} from "mobx-react";
import {NotificationContainer, NotificationManager} from "react-notifications";
import {ReactComponent as LeftArrowIcon} from "../../assets/icons/arrow.svg";

class PpoList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            preloader: false,
            unionName: '',
        }

        this.loadPage = this.loadPage.bind(this)
        this.prevPage = this.prevPage.bind(this)
        this.nextPage = this.nextPage.bind(this)
        this.loadUnions = this.loadUnions.bind(this)
        this.searchUnion = this.searchUnion.bind(this)
    }

    componentDidMount() {
        this.loadPage()

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
    }

    loadUnions(union){

        this.setState({ preloader: true })
        this.props.unionStore.loadUnionsPpo(union.resource_id, null,() => {
            this.setState({ preloader: false })

            this.props.unionStore.loadUnion(union.resource_id,
                () => {
                this.setState({
                    unionName: this.props.unionStore.union.name
                })
                })

            if (union.has_child){
                this.props.history.push(`/dispute/ppo/${union.resource_id}`)
            }else{
                this.props.history.push(`/dispute/list/categories/${union.resource_id}`)
            }

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

    loadPage(){

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

    searchUnion(search){
        if (search.length > 2){
            this.setState({ preloader: true })
            if (this.props.match.params.id !== 'undefined' && this.props.match.params.id !== undefined){
                this.props.unionStore.loadUnionsPpo(this.props.match.params.id, search, () => {
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
                this.props.unionStore.loadUnionsPpo(this.props.userStore.profile.union.resource_id, search, () => {
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

                <div className={'panel'}>

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
                                            <> <a style={{color: '#0052A4'}}
                                                     href={`/dispute/ppo/${breadcrumb.resource_id}`}>{breadcrumb.name}</a>
                                                {
                                                    index !== this.props.unionStore.breadCrumbs.length - 1 &&
                                                    <span> -> </span>
                                                }
                                            </>
                                        )
                                        break;
                                    case 2:
                                        return (
                                            <> <a style={{color: '#0052A4'}} href={`/dispute/ppo/${breadcrumb.resource_id}`}>{breadcrumb.name}</a>
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
                                            <> <a style={{color: '#0052A4'}} href={`/dispute/ppo/${breadcrumb.resource_id}`}>{breadcrumb.name}</a>
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

                    <div className='ppos-list'>

                        <ul className="list__wrapper">
                            {
                                this.props.disputeStore.disputeInfoCategory.map((category, index) => {
                                    return  <li key={index} >
                                        <Link
                                            to={`/dispute/list/opo/${
                                                this.props.match.params.id !== 'undefined' &&
                                                this.props.match.params.id !== undefined ?
                                                this.props.match.params.id : this.props.userStore.profile.union.resource_id
                                            }/?category_id=${category.resource_id}`}
                                            style={{ justifyContent: "space-between" }}
                                        >
                                            <div>{this.props.userStore.languageList[category.name] || category.name}</div>
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

            <div className={'panel'}>
                <h3>{ this.props.unionStore.union.name }</h3>
                <div className='ppos-list'>
                    <Search
                        currentPage={this.props.unionStore.currentPageUnionsPpo}
                        pageCount={this.props.unionStore.pageCountUnionsPpo}
                        prevPage={this.prevPage}
                        nextPage={this.nextPage}
                        search={this.searchUnion}
                    />

                    <ul className="list__wrapper">
                        {
                            this.props.unionStore.unionsPpoList.map(union => (
                            <li>
                                <Link onClick={() => this.loadUnions(union)}>
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

export default withRouter(inject('permissionsStore', 'unionStore', 'userStore', 'disputeStore')(observer(PpoList)));