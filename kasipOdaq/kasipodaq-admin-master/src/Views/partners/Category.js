import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import Search from "../../fragments/search";
import {inject, observer} from "mobx-react";
import Preloader from "../../fragments/preloader/Preloader";
import {NotificationContainer, NotificationManager} from "react-notifications";

const Category = inject('partnersStore', 'userStore', 'permissionsStore')(observer(class Category extends Component {

    constructor(props){
        super(props);

        this.state = {
            preloader: false,
        }

    }

    componentDidMount() {
        this.props.partnersStore.loadPartnerList(this.props.match.params.id,
            () => {

                {
                    this.props.partnersStore.partnerCategoryList.map(category =>
                        category.resource_id == this.props.match.params.id &&
                        (this.props.partnersStore.partnerCategoryName = category.name,
                        this.props.partnersStore.partnerCategoryId = category.resource_id)
                    )}

            },response => {
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
        });

        this.props.partnersStore.loadPartnerCategoryList(null,() => {},response => {
            if (response.status == 401){
                this.setState({ preloader: false });
                this.props.history.push('/')
            }
        })
    }

    render() {
        return (
            <div className='partner-category'>

                {
                    this.state.preloader &&
                        <Preloader/>
                }

                <NotificationContainer/>

                <div className="title-wrapper">
                    <h1 className="title">
                        {
                            this.props.partnersStore.partnerCategoryList.map(category => {
                                return category.resource_id == this.props.match.params.id &&
                                    category.name
                            })
                        }
                    </h1>
                    {
                        this.props.permissionsStore.hasPermission('partner', 'create') &&
                        <Link to={`/partners/${this.props.match.params.id}/add`}>{this.props.userStore.languageList["Добавить партнера"] || 'Добавить партнера'}</Link>
                    }
                </div>
                <div className="panel">

                    <div style={{ marginBottom: 16, marginTop: 16 }}>
                        <Link style={{ color: '#0052A4' }} to={`/partners`}>{this.props.userStore.languageList['Все категории'] || 'Все категории'}</Link>
                        <span> -> </span>
                        <Link style={{ color: '#0052A4' }}>
                            {
                            this.props.partnersStore.partnerCategoryList.map(category => {
                                return category.resource_id == this.props.match.params.id &&
                                    category.name
                            })
                            }
                        </Link>
                    </div>

                    <Search
                            pagingCallback={this.loadPage}
                            searchCallback={this.search}
                            showSearchString={false}/>

                    <ul className="partners-list">
                        {
                            this.props.partnersStore.partnerList.map(partner => {
                                return  <li>
                                            <Link to={`/partners/` + partner.resource_id }>
                                                { partner.name }
                                            </Link>
                                        </li>
                            })
                        }

                    </ul>
                </div>
            </div>
        );
    }
}));

export default Category;