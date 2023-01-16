import React, {Component} from 'react';
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {ReactComponent as EditIcon} from "../../assets/icons/edit.svg";
import {ReactComponent as RemoveIcon} from "../../assets/icons/remove.svg";
import {inject, observer} from "mobx-react";
import Preloader from "../../fragments/preloader/Preloader";
import {NotificationContainer, NotificationManager} from "react-notifications";
import CookieService from "../../services/CookieService";

class Partner extends Component {
    constructor(props){
        super(props);

        this.state = {
            preloader: false,

        };

        this.deletePartner = this.deletePartner.bind(this)
    }

    componentDidMount() {

        this.props.partnersStore.loadPartner(this.props.match.params.id, CookieService.get('language-admin') || 'ru',() => {

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

    deletePartner(e){
        let id = e.target.dataset.id;

        this.props.partnersStore.deletePartner(id, () => {
            this.props.history.goBack()
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

    render() {

        return (
            <div className='partner-info'>

                {
                    this.state.preloader &&
                        <Preloader/>
                }

                <NotificationContainer/>

                <h1 className="title">{this.props.partnersStore.partnerCategoryName}</h1>
                <div className="panel">

                    <div style={{ marginBottom: 16 }}>
                        <Link style={{ color: '#0052A4' }} to={'/partners'}>{this.props.userStore.languageList['Все категории'] || 'Все категории'}</Link>
                        <span> -> </span>
                        {
                            <Link style={{color: '#0052A4'}} to={`/partners/category/${this.props.partnersStore.partnerCategoryId}`}>
                                {this.props.partnersStore.partnerCategoryName}
                            </Link>
                        }
                        <span> -> </span>
                        <Link style={{ color: '#0052A4', borderBottom: '1px solid #0052A4' }}>{ this.props.partnersStore.partner.name }</Link>
                    </div>

                    <div className="subtitle-wrapper">
                        <div className="col-left">
                            <div className="logo">
                                <img src={ this.props.partnersStore.partner.picture_uri } alt=""/>
                            </div>
                            <h2 className="subtitle">{ this.props.partnersStore.partner.name }</h2>
                        </div>
                        <div className="line"/>
                        <div className="links">
                            {
                                this.props.permissionsStore.hasPermission('partner', 'delete') &&
                                <div className="remove">
                                    <div className="btn-action" data-id={ this.props.partnersStore.partner.resource_id } onClick={this.deletePartner}>
                                        <div className="icon" data-id={ this.props.partnersStore.partner.resource_id }>
                                            <RemoveIcon data-id={ this.props.partnersStore.partner.resource_id } />
                                        </div>
                                        <span>{this.props.userStore.languageList["Удалить"] || 'Удалить'}</span>
                                    </div>
                                </div>
                            }
                            {
                                this.props.permissionsStore.hasPermission('partner', 'edit') &&
                                <Link to={`/partners/${this.props.partnersStore.partner.resource_id}/edit`} className="edit">
                                    <div className="btn-action">
                                        <div className="icon">
                                            <EditIcon/>
                                        </div>
                                        <span>{this.props.userStore.languageList["Редактировать"] || 'Редактировать'}</span>
                                    </div>
                                </Link>
                            }

                        </div>
                    </div>

                    <ul className="socials-list">
                        {
                            this.props.partnersStore.partner.vk &&
                            <li>
                                <a href={this.props.partnersStore.partner.vk} target="_blank">{this.props.partnersStore.partner.vk}</a>
                            </li>
                        }
                        {
                            this.props.partnersStore.partner.odnoklassniki &&
                            <li>
                                <a href={this.props.partnersStore.partner.odnoklassniki} target="_blank">{this.props.partnersStore.partner.odnoklassniki}</a>
                            </li>
                        }
                        {
                            this.props.partnersStore.partner.instagram &&
                            <li>
                                <a href={this.props.partnersStore.partner.instagram} target="_blank">{this.props.partnersStore.partner.instagram}</a>
                            </li>
                        }
                        {
                            this.props.partnersStore.partner.facebook &&
                            <li>
                                <a href={this.props.partnersStore.partner.facebook} target="_blank">{this.props.partnersStore.partner.facebook}</a>
                            </li>
                        }
                        {
                            this.props.partnersStore.partner.whatsapp &&
                            <li>
                                <a href={this.props.partnersStore.partner.whatsapp} target="_blank">{this.props.partnersStore.partner.whatsapp}</a>
                            </li>
                        }
                        {
                            this.props.partnersStore.partner.twitter &&
                            <li>
                                <a href={this.props.partnersStore.partner.twitter} target="_blank">{this.props.partnersStore.partner.twitter}</a>
                            </li>
                        }
                        {
                            this.props.partnersStore.partner.telegram &&
                            <li>
                                <a href={this.props.partnersStore.partner.telegram} target="_blank">{this.props.partnersStore.partner.telegram}</a>
                            </li>
                        }
                    </ul>

                    <div className="description" dangerouslySetInnerHTML={{ __html: this.props.partnersStore.partner.description }}>

                    </div>
                </div>
            </div>
        );
    }
}

export default inject('partnersStore', 'userStore', 'permissionsStore')(observer(Partner));