import React, {Component} from 'react';
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import Search from '../../fragments/search'

import {ReactComponent as FolderIcon} from '../../assets/icons/folder.svg'
import {inject, observer} from "mobx-react";
import Preloader from "../../fragments/preloader/Preloader";
import {NotificationContainer, NotificationManager} from "react-notifications";
import CookieService from "../../services/CookieService";

class UnionsList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            preloader: false,
        };

        this.loadPage = this.loadPage.bind(this);
        this.loadPpos = this.loadPpos.bind(this);
        this.searchMembers = this.searchMembers.bind(this);
        this.prevPage = this.prevPage.bind(this);
        this.nextPage = this.nextPage.bind(this)
    }

    loadPage(){
        if (this.props.match.params.id !== 'undefined' && this.props.match.params.id !== undefined){
            this.setState({ preloader: true });
            this.props.unionStore.loadUnionsPpo(this.props.match.params.id, null,() => {
                this.setState({ preloader: false });

                this.props.unionStore.loadUnion(this.props.match.params.id)

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
            this.setState({ preloader: true });
            this.props.unionStore.loadUnionsPpo(this.props.userStore.profile.union.resource_id, null,() => {
                this.setState({ preloader: false });

                this.props.unionStore.loadUnion(this.props.userStore.profile.union.resource_id)

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

    loadPpos(union){

        this.setState({ preloader: true });
        this.props.unionStore.loadUnionsPpo(union.resource_id, null,() => {
            this.setState({ preloader: false });

            if (!union.has_child){
                this.props.history.push(`/union/ppo/${union.resource_id}`)
            }else if (union.kind == 'union'){
                this.props.history.push(`/union/ppo/${union.resource_id}`)
            }

            this.props.unionStore.loadUnion(union.resource_id)

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
    }

    componentDidMount(){
        this.props.unionStore.pageNumberUnionsPpo = 1;
        this.loadPage()
    }

    prevPage(){
        this.setState({ preloader: true });
        if (this.props.unionStore.pageNumberUnionsPpo > 1){
            this.props.unionStore.pageNumberUnionsPpo = this.props.unionStore.pageNumberUnionsPpo - 1;
            this.loadPage()
        }else{
            this.setState({ preloader: false })
        }
    }

    nextPage(){
        this.setState({ preloader: true });
        if (this.props.unionStore.pageNumberUnionsPpo < this.props.unionStore.pageCountUnionsPpo){
            this.props.unionStore.pageNumberUnionsPpo = this.props.unionStore.pageNumberUnionsPpo + 1;
            this.loadPage()
        }else{
            this.setState({ preloader: false })
        }
    }

    searchMembers(search){
        if (search.length > 2){
            if (this.props.match.params.id !== 'undefined' && this.props.match.params.id !== undefined){
                this.props.unionStore.loadUnionsPpo(this.props.match.params.id, search,() => {
                    this.setState({ preloader: false })
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
                this.props.unionStore.loadUnionsPpo(this.props.userStore.profile.union.resource_id, search,() => {
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

        return (
            <div className='opo-list'>

                <div className="title-wrapper" style={{display: 'flex', justifyContent: 'flex-end'}}>
                    {/*<h1>{ this.props.unionStore.union.name }</h1>*/}
                    {/*<Link to={`/union/opo/${this.state.id}/ppos/add`}>Добавить ППО </Link>*/}
                    <Link to={`/union/reports?union_id=${this.props.match.params.id}`} style={{
                        border: '1px solid #002F6C',
                        color: '#002F6C',
                        backgroundColor: 'transparent',
                        marginBottom: 8,
                    }}>{this.props.userStore.languageList['Отчеты'] || 'Отчеты'}</Link>
                </div>

                {
                    this.state.preloader &&
                    <Preloader/>
                }

                <NotificationContainer/>

                <div style={{ marginBottom: 16 }}>
                    {
                        this.props.unionStore.breadCrumbs?.map((breadcrumb, index) => {
                            switch (index) {
                                case 0:
                                    return (
                                        <> <Link style={{color: '#0052A4'}} to={`/union`}>{breadcrumb.name}</Link>
                                            {
                                                index !== this.props.unionStore.breadCrumbs.length - 1 &&
                                                <span> -> </span>
                                            }
                                        </>
                                    );
                                    break;
                                case 1:
                                    return (
                                        <> <Link style={{color: '#0052A4'}}
                                                 to={`/union/opo/${breadcrumb.resource_id}`}>{breadcrumb.name}</Link>
                                            {
                                                index !== this.props.unionStore.breadCrumbs.length - 1 &&
                                                <span> -> </span>
                                            }
                                        </>
                                    );
                                    break;
                                case 2:
                                    return (
                                        <> <Link style={{color: '#0052A4'}} to={`/union/list/${breadcrumb.resource_id}`}>{breadcrumb.name}</Link>
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

                <h3>{ this.props.unionStore.union.name }</h3>
                <Search
                    currentPage={this.props.unionStore.currentPageUnionsPpo}
                    pageCount={this.props.unionStore.pageCountUnionsPpo}
                    prevPage={this.prevPage}
                    nextPage={this.nextPage}
                    search={this.searchMembers}
                />
                <ul className="list__wrapper">
                    {
                        this.props.unionStore.unionsPpoList.map(union => (
                            <li key={union.resource_id}>
                                <Link onClick={() => this.loadPpos(union)}>
                                    <div className="icon">
                                        <FolderIcon/>
                                    </div>
                                    { union.name } ({union.member_count})
                                </Link>
                            </li>
                        ))}
                </ul>
            </div>
        );
    }
}

export default inject('unionStore', 'userStore', 'permissionsStore')(observer(UnionsList));