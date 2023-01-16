import React, {Component} from 'react';
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import Search from '../../fragments/search'
import {withRouter} from "react-router-dom";

import {ReactComponent as FolderIcon} from "../../assets/icons/folder.svg";
import {inject, observer} from "mobx-react";
import {NotificationContainer, NotificationManager} from "react-notifications";
import CookieService from "../../services/CookieService";

class OpoList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            preloader: true
        }

        this.loadPage = this.loadPage.bind(this)
        this.prevPage = this.prevPage.bind(this)
        this.nextPage = this.nextPage.bind(this)
    }

    componentDidMount() {
        this.loadPage()
    }

    loadPage(){
        this.props.unionStore.loadIndustries(() => {
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
                CookieService.remove('token-admin')
                this.setState({ preloader: false })
                this.props.history.push('/')
            }
        })
    }

    prevPage(){
        this.setState({ preloader: true })
        if (this.props.unionStore.pageNumberIndustries > 1){
            this.props.unionStore.pageNumberIndustries = this.props.unionStore.pageNumberIndustries - 1
            this.loadPage()
        }else{
            this.setState({ preloader: false })
        }
    }

    nextPage(){
        this.setState({ preloader: true })
        if (this.props.unionStore.pageNumberIndustries < this.props.unionStore.pageCountIndustries){
            this.props.unionStore.pageNumberIndustries = this.props.unionStore.pageNumberIndustries + 1
            this.loadPage()
        }else{
            this.setState({ preloader: false })
        }
    }

    render() {
        return (
            <React.Fragment>
                <div className={'union__wrapper panel'}>
                    <div className={'opo-list'}>
                        <Search currentPage={this.props.unionStore.currentPageIndustries}
                                pageCount={this.props.unionStore.pageCountIndustries}
                                prevPage={this.prevPage}
                                nextPage={this.nextPage}
                        />
                        <ul className="list__wrapper">
                            {
                                this.props.unionStore.industriesList.map((industry, index) => {
                                    return <li key={index}>
                                        <Link to={`/tribune/ppo/` + industry.resource_id}>
                                            <div className="icon">
                                                <FolderIcon/>
                                            </div>
                                            { industry.name }
                                        </Link>
                                    </li>
                                })
                            }
                        </ul>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}


export default withRouter(inject('permissionsStore', 'unionStore')(observer(OpoList)));