import React, {Component} from 'react'
import Layout from "../../fragments/layout/Layout";
import { Link } from 'react-router-dom'

import { ModalChangeLang } from '../../fragments/modals/Modal';
import { ModalLogout } from '../../fragments/modals/Modal';
import { ModalChangePass } from '../../fragments/modals/Modal';

import {ReactComponent as NotificationsIcon} from '../../assets/icons/preferences-notifications.svg';
import {ReactComponent as ChangeLangIcon} from '../../assets/icons/preferences-change-lang.svg';
import {ReactComponent as ChangePassIcon} from '../../assets/icons/preferences-change-pass.svg';
import {ReactComponent as HelpIcon} from '../../assets/icons/preferences-help.svg';
import {ReactComponent as LogOutIcon} from '../../assets/icons/preferences-logout.svg';
import {inject, observer} from "mobx-react";
import {ReactComponent as NewsIcon} from "../../assets/icons/news.svg";
import {ReactComponent as RevisionIcon} from "../../assets/icons/revision.svg";
import {ReactComponent as DisputeIcon} from "../../assets/icons/dispute.svg";
import {ReactComponent as UnionIcon} from "../../assets/icons/union_notification.svg";
import {ReactComponent as OrderIcon} from "../../assets/icons/order.svg";
import Pager from "react-pager";

class Notifications extends Component {

    constructor(props) {
        super(props);

        this.state = {
            page: 1
        }

        this.readNotification = this.readNotification.bind(this)
        this.renderIcons = this.renderIcons.bind(this)
        this.handlePageChanged = this.handlePageChanged.bind(this)

    }

    componentDidMount() {
        this.props.notificationStore.loadNotificationList(this.state.page)
    }

    readNotification(event, notification){
        event.preventDefault();

        this.props.notificationStore.notificationRead(
            notification.resource_id,
            () => {
                switch(notification.notification_class) {
                    case "news":
                        this.props.history.push("/news/" + notification.record_id)
                    break;
                    case "disputes":
                        this.props.history.push("/dispute/")
                        break;
                    case "union":
                        this.props.history.push("/cabinet/")
                    break;
                    case "orders":
                        this.props.history.push("/biot/")
                    break;
                    case "revisions":
                        this.props.history.push("/tribune/question/" + notification.record_id)
                        break;
                    case "appeals":
                        this.props.history.push("/request-to-fprk/")
                        break;
                }
            }
        )
    }

    renderIcons(notification){
        switch(notification.notification_class) {
            case "news":
                return <div className="icon">
                    <NewsIcon/>
                </div>
                break;
            case "dispute":
                return <div className="icon">
                    <DisputeIcon/>
                </div>
                break;
            case "union":
                return <div className="icon">
                    <UnionIcon/>
                </div>
                break;
            case "appeals":
                return <div className="icon">
                    <OrderIcon/>
                </div>
                break;
            case "revisions":
                return <div className="icon">
                    <RevisionIcon/>
                </div>
                break;
        }
    }

    handlePageChanged(newPage) {
        this.setState({page : newPage }, () => {
            this.props.notificationStore.loadNotificationList(
                this.state.page + 1,
                () => {}
            )
        })

    }

    render() {

        return (
            <Layout title='Уведомления'>
                <div className="plate-wrapper plate-wrapper__height">
                    <div className="preferences">
                        <ul>
                            {
                                this.props.notificationStore.notificationList.map((notification, index) => {
                                    return <Link classname='notifications' onClick={event => this.readNotification(event, notification)} key={index}>
                                                <li className='notifications'>
                                                    <label>
                                                        {
                                                            this.renderIcons(notification)
                                                        }
                                                        <span className={notification.is_seen && 'seen_notification'} >{ notification.content }</span>
                                                    </label>
                                                </li>
                                            </Link>
                                })
                            }
                        </ul>
                    </div>

                    {
                        parseInt(this.props.notificationStore.headers['x-pagination-total-count']) > 0 &&
                        <Pager
                            total={parseInt(this.props.notificationStore.headers['x-pagination-page-count'])}
                            current={parseInt(this.props.notificationStore.headers['x-pagination-current-page']) - 1}
                            visiblePages={10}
                            titles={{first: '<', last: '>' }}
                            className="search-pagination"
                            onPageChanged={this.handlePageChanged}
                        />

                    }

                </div>

            </Layout>
        )
    }
}

export default inject('notificationStore')(observer(Notifications));