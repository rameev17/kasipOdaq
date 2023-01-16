import React, {Component} from 'react';
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import Search from "../../fragments/search";
import {withRouter} from 'react-router-dom'

import {ReactComponent as FolderIcon} from '../../assets/icons/folder.svg'
import {inject, observer} from "mobx-react";
import Preloader from "../../fragments/preloader/Preloader";
import {NotificationContainer, NotificationManager} from "react-notifications";
import Fprk from "../union/Fprk";
import Opo from "../union/Opo";
import Filial from "../union/Filial";
import Layout from "../Containers/Layout";
import {ReactComponent as LeftArrowIcon} from "../../assets/icons/arrow.svg";

class TopPpoList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            preloader: true,
        }

        this.prevPage = this.prevPage.bind(this)
        this.nextPage = this.nextPage.bind(this)
        this.loadPage = this.loadPage.bind(this)
        this.searchMembers = this.searchMembers.bind(this)
    }

    componentWillMount() {
        this.props.unionStore.pageNumberUnionsPpo = 1;
        this.loadPage()
    }

    loadPage(){
        if (this.props.match.params.id !== 'undefined' && this.props.match.params.id !== undefined){
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
                    this.setState({ preloader: false })
                    this.props.history.push('/')
                }
            })
        }else{
            this.props.unionStore.loadUnionsPpo(this.props.userStore.profile.union.resource_id, null,() => {
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
                        this.setState({ preloader: false })
                        this.props.history.push('/')
                    }
                })
            }else{
                this.props.unionStore.loadUnionsPpo(this.props.userStore.profile.union.resource_id, search,() => {
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
            <div>

                <div className="union__wrapper panel">
                    <div className="content">
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
                                            <Link to={`/dispute/ppo/` + union.resource_id}>
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
                </div>

            </div>
        );
    }
}

export default inject('unionStore', 'permissionsStore', 'disputeStore', 'userStore')(observer(withRouter(TopPpoList)));