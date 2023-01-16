import React, {Component} from 'react';
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import Search from "../../fragments/search";
import {withRouter} from 'react-router-dom'

import {ReactComponent as FolderIcon} from '../../assets/icons/folder.svg'
import {inject, observer} from "mobx-react";
import Preloader from "../../fragments/preloader/Preloader";
import {NotificationContainer, NotificationManager} from "react-notifications";

class OpoPpoList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            preloader: true,
        };

        this.prevPage = this.prevPage.bind(this);
        this.nextPage = this.nextPage.bind(this);
        this.loadPage = this.loadPage.bind(this);
        this.searchMembers = this.searchMembers.bind(this);
        this.loadPpos = this.loadPpos.bind(this)
    }

    componentWillMount() {
        this.props.unionStore.pageNumberUnionsPpo = 1;
       this.loadPage()
    }

    loadPpos(union){

        this.setState({ preloader: true });
        this.props.unionStore.loadUnionsPpo(union.resource_id, null,() => {
            this.setState({ preloader: false });

            if (!union.has_child){
                this.props.history.push(`/union/ppo/${union.resource_id}`)
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
                this.setState({ preloader: false });
                this.props.history.push('/')
            }
        })
    }

    loadPage(){
        if (this.props.match.params.id !== 'undefined' && this.props.match.params.id !== undefined){
            this.setState({ preloader: true });
            this.props.unionStore.loadUnionsPpo(this.props.match.params.id, null,() => {
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
            this.setState({ preloader: true });
            this.props.unionStore.loadUnionsPpo(this.props.userStore.profile.union.resource_id, null,() => {
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
            <div className='ppos-list'>

                {
                    this.state.preloader &&
                        <Preloader/>
                }

                <NotificationContainer/>

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
                            <Link to={
                                union.has_child ?
                                    `/union/list/${union.resource_id}`
                                    :
                                    `/union/ppo/${union.resource_id}`
                            }>
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

export default inject('unionStore', 'permissionsStore', 'userStore')(observer(withRouter(OpoPpoList)));