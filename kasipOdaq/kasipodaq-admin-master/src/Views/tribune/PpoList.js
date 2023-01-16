import React, {Component} from 'react';
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import Search from "../../fragments/search";
import {withRouter} from 'react-router-dom'

import {ReactComponent as FolderIcon} from '../../assets/icons/folder.svg'
import {NotificationContainer, NotificationManager} from "react-notifications";
import {inject, observer} from "mobx-react";

class PpoList extends Component {

    constructor(props) {
        super(props);

        this.state = {

        }

        this.prevPage = this.prevPage.bind(this)
        this.nextPage = this.nextPage.bind(this)
        this.loadPage = this.loadPage.bind(this)

    }

    componentDidMount() {
        this.loadPage()
    }

    loadPage(){
        if (this.props.match.params.id !== 'undefined' && this.props.match.params.id !== undefined){
            this.props.unionStore.loadUnionsPpo(this.props.match.params.id,() => {
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
            this.props.unionStore.loadUnionsPpo(this.props.userStore.profile.union.resource_id,() => {
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

    render() {
        return (
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
                                <li key={union.resource_id}>
                                    <Link to={`/tribune/list/` + union.resource_id}>
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
        );
    }
}

export default withRouter(inject('permissionsStore', 'unionStore', 'userStore')(observer(PpoList)));