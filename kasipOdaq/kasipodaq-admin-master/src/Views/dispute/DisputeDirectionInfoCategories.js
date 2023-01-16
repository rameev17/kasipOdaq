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

class DisputeDirectionInfoCategories extends Component {
    constructor(props) {
        super(props);

        this.state = {
            title: 'Трудовой спор',
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
    }

    changeTabCallback = (tab) => {
        switch (tab) {
            case '1':
                this.props.history.push({
                    pathname:`/dispute`,
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
                this.props.history.push({
                    pathname:`/dispute`,
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
                    <TabsLayout tabs={this.state.tabs}
                                changeTabCallback={this.changeTabCallback}>

                        <div className="plate-wrapper plate-wrapper__height">
                            <div className='menu-dispute'>
                                <ul>
                                    {
                                        this.props.disputeStore.disputeInfoCategory.map((category, index) => {
                                            return  <li key={index} className={'dispute-category'}>
                                                <Link onClick={ this.props.permissionsStore.hasPermission('article', 'edit') ? () => {
                                                    this.props.history.push({
                                                        pathname: `/dispute/info/` + category.resource_id,
                                                        state: { tabId: 2 }
                                                    })
                                                } : '' }>
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

export default inject('disputeStore', 'permissionsStore', 'userStore')(observer(DisputeDirectionInfoCategories));