import React, {Component} from 'react';
import Search from "../../fragments/search";
import {withRouter} from "react-router";
import {connect} from 'react-redux'

import {ReactComponent as DownloadIcon} from '../../assets/icons/download.svg'
import {ReactComponent as RemoveIcon} from '../../assets/icons/delete.svg'
import {ReactComponent as AppendIcon} from '../../assets/icons/clip.svg'
import {inject, observer} from "mobx-react";
import Preloader from "../../fragments/preloader/Preloader";
import {NotificationContainer, NotificationManager} from "react-notifications";
import {Link} from "react-router-dom";

const dateFormat = require('dateformat')

class OrdersList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            preloader: true
        }

        this.deleteOrder = this.deleteOrder.bind(this)
        this.loadPage = this.loadPage.bind(this)
        this.nextPage = this.nextPage.bind(this)
        this.prevPage = this.prevPage.bind(this)
        this.searchOrder = this.searchOrder.bind(this)
    }

    componentDidMount() {
        this.loadPage()
    }

    loadPage(){
        if (this.props.match.params.id !== undefined && this.props.match.params.id !== 'undefined'){
            this.props.biotStore.loadOrderList(this.props.match.params.id,null,
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
            this.props.biotStore.loadOrderList(this.props.userStore.profile.union.resource_id,null,
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

    deleteOrder(e){
        this.setState({ preloader: true })
        let id = e.target.dataset.id

        this.props.biotStore.deleteOrder(
            id,
            () => {
                this.loadPage()
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
            }
        )
    }

    prevPage(){
        this.setState({ preloader: true })
        if (this.props.biotStore.pageNumberOrders > 1){
            this.props.biotStore.pageNumberOrders = this.props.biotStore.pageNumberOrders - 1
            this.loadPage()
        }else{
            this.setState({ preloader: false })
        }
    }

    nextPage(){
        this.setState({ preloader: true })
        if (this.props.biotStore.pageNumberOrders < this.props.biotStore.pageCountOrders){
            this.props.biotStore.pageNumberOrders = this.props.biotStore.pageNumberOrders + 1
            this.loadPage()
        }else{
            this.setState({ preloader: false })
        }
    }

    searchOrder(search){
        if (search.length > 2){
            this.setState({ preloader: true })
            if (this.props.match.params.id !== 'undefined' && this.props.match.params.id !== undefined){
                this.props.biotStore.loadOrderList(this.props.match.params.id, search, () => {
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
                this.props.biotStore.loadOrderList(this.props.userStore.profile.union.resource_id, search, () => {
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
            <div className='plate-wrapper orders'>

                {
                    this.state.preloader &&
                        <Preloader/>
                }

                <NotificationContainer/>

                {
                    this.props.userStore.role !== 'company' &&
                    <div style={{ marginBottom: 16 }}>
                        {
                            this.props.unionStore.breadCrumbs?.map((breadcrumb, index) => {
                                switch (breadcrumb.level) {
                                    case 'main_union':
                                        return (
                                            index !== this.props.unionStore.breadCrumbs.length - 1 &&
                                            <> <a style={{color: '#0052A4'}} href={`/biot`}>{breadcrumb.name}</a>
                                                {
                                                    index !== this.props.unionStore.breadCrumbs.length - 1 &&
                                                    <span> -> </span>
                                                }
                                            </>
                                        )
                                        break;
                                    case 'industry':
                                        return (
                                            index !== this.props.unionStore.breadCrumbs.length - 1 &&
                                            <> <a style={{color: '#0052A4'}}
                                                     href={`/biot/opo/${breadcrumb.resource_id}`}>{breadcrumb.name}</a>
                                                {
                                                    index !== this.props.unionStore.breadCrumbs.length - 1 &&
                                                    <span> -> </span>
                                                }
                                            </>
                                        )
                                        break;
                                    case 'branch':
                                        return (
                                            index !== this.props.unionStore.breadCrumbs.length - 1 &&
                                            <> <a style={{color: '#0052A4'}} href={`/biot/opo/${breadcrumb.resource_id}`}>{breadcrumb.name}</a>
                                                {
                                                    index !== this.props.unionStore.breadCrumbs.length - 1 &&
                                                    <span> -> </span>
                                                }
                                            </>
                                        )
                                        break;
                                    case 'union':
                                        return (
                                            index !== this.props.unionStore.breadCrumbs.length - 1 &&
                                            <> <Link style={{color: '#0052A4'}} to={`/biot/opo/${breadcrumb.resource_id}`}>{breadcrumb.name}</Link>
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

                <h2 className="from">
                    {
                        this.props.match.params.id !== 'undefined' && this.props.match.params.id !== undefined ?
                        this.props.biotStore.orderList.map(order => {
                            return order.union.resource_id == this.props.match.params.id &&
                                order.union.name
                        })
                            :
                            this.props.biotStore.orderList.map(order => {
                                return order.union.resource_id == this.props.userStore.profile.union.resource_id &&
                                    order.union.name
                            })
                    }

                    {
                        this.props.unionName
                    }
                </h2>

                <Search
                    currentPage={this.props.biotStore.currentPageOrders}
                    pageCount={this.props.biotStore.pageCountOrders}
                    prevPage={this.prevPage}
                    nextPage={this.nextPage}
                    search={this.searchOrder}
                />

                <ul className="orders-list">{
                    this.props.biotStore.orderList.map(order => {
                        return <li>
                                    <div className="document-container">
                                        <div className="document">
                                            <div className="placeholder">
                                                <span className='title'>{order.title}</span>
                                                <span
                                                    className="date">{dateFormat(order.created_date, 'dd.mm.yyyy')}</span>
                                            </div>
                                            <div className="icons__wrapper">
                                                <a href={order.files[0] !== undefined && order.files[0].uri} target='_blank' className="icon download">
                                                    <DownloadIcon/>
                                                </a>

                                                {
                                                    this.props.userStore.profile.union.resource_id == order.union.resource_id &&
                                                    <div className="icon remove"  data-id={order.resource_id} onClick={this.deleteOrder}>
                                                        <RemoveIcon data-id={order.resource_id} onClick={this.deleteOrder} />
                                                    </div>
                                                }

                                                {/*<label className="icon append">*/}
                                                {/*    <AppendIcon/>*/}
                                                {/*    <input type="file" name="document"*/}
                                                {/*           style={{display: 'none'}}/>*/}
                                                {/*</label>*/}

                                            </div>
                                        </div>
                                        <input type="file"
                                               style={{display: 'none'}}/>
                                    </div>
                                </li>
                            })
                            }

            </ul>
        </div>
        );
    }
}

export default withRouter(inject('biotStore', 'permissionsStore', 'userStore', 'unionStore')(observer(OrdersList)));