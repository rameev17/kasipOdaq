import React, {Component} from 'react';
import Layout from "../../fragments/layout/Layout";

import {Switch, Route, Link} from 'react-router-dom'

import {ReactComponent as MarkIcon} from '../../assets/icons/exclamation-mark.svg'
import {ReactComponent as LeftArrowIcon} from '../../assets/icons/arrow.svg'
import './style.scss'
import Preloader from "../../fragments/preloader/Preloader";
import {NotificationContainer, NotificationManager} from 'react-notifications';
import {inject, observer} from "mobx-react";
import CookieService from "../../services/CookieService";


class Partners extends Component {
    constructor(props) {
        super(props);

    }

    render() {

        return (
            <Layout title='Партнеры'>

                <div className="plate-wrapper plate-wrapper__height">
                    <div className="partners">
                        <Switch>
                            <Route exact path='/partners'
                                   render={props => (<CategoriesList {...props}/>)}/>
                            <Route exact path='/partners/category/:id' render={
                                (props) => <PartnersList {...props} />}/>
                            <Route exact path='/partners/:id' render={
                                (props) => <Partner {...props} />}/>
                        </Switch>
                    </div>
                </div>

            </Layout>
        );
    }
}

const CategoriesList = inject('partnersStore', 'userStore', 'permissionsStore')(observer(class CategoriesList extends Component {

    constructor(props){
        super(props)

        this.state = {
            preloader: true
        }

    }

    componentDidMount() {
        this.setState({ preloader: false })

        this.props.partnersStore.loadPartnerCategoryList(() => {

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
                CookieService.remove('token')
                this.setState({ preloader: false })
                this.props.history.push('/auth')
            }
        })
    }

    render() {

        return (
            <React.Fragment>

                {
                    this.state.preloader &&
                    <Preloader/>
                }

                <NotificationContainer/>
                {
                    this.props.partnersStore.partnerCategoryList.map(category => {
                        return <li className={'partner-list'}>
                            <Link to={`/partners/category/` + category.resource_id }>
                                <div className="category-title">
                                    {
                                        this.state.editButtons ?
                                            <form className="edit"
                                                  style={{display: 'block' }}>
                                                <input type="text"
                                                       name="title"
                                                       placeholder={this.props.userStore.languageList["Название категории"] || 'Название категории'}
                                                />
                                            </form>
                                            :
                                            <div className="text">
                                                {this.props.userStore.languageList[category.name] || category.name}
                                            </div>
                                    }
                                </div>
                            </Link>

                        </li>
                    })
                }

            </React.Fragment>
        )
    }
}))

const PartnersList = inject('partnersStore', 'permissionsStore')(observer(class PartnersList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            preloader: true,
        }
    }

    componentDidMount() {
        this.props.partnersStore.loadPartnerList(
            this.props.match.params.id,
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
                    CookieService.remove('token')
                    this.setState({ preloader: false })
                    this.props.history.push('/auth')
                }
            })

        {
            this.props.partnersStore.partnerCategoryList.map(partner =>
            partner.resource_id == this.props.match.params.id &&
            (this.props.partnersStore.partnerName = partner.name,
            this.props.partnersStore.partnerId = partner.resource_id)
        )}

    }

    render() {

        return (
            <React.Fragment>

                {
                    this.state.preloader &&
                    <Preloader/>
                }

                <NotificationContainer/>

                <div className="wrapper">

                    <div style={{ marginBottom: 16 }}>
                        <Link style={{ color: '#0052A4' }} to={'/partners'}>Все категории</Link>
                        <span> -> </span>
                        <Link style={{ color: '#0052A4', borderBottom: '1px solid #0052A4' }}>
                            {this.props.partnersStore.partnerName}
                        </Link>
                    </div>

                    {/*<Select*/}
                    {/*    placeholder='Выберите категорию'*/}
                    {/*    noOptionsMessage={() => 'Категория не найдена'}*/}
                    {/*/>*/}
                    <div className="partners-list">
                        <ul>
                            {
                                this.props.partnersStore.partnerList.map(partner => {
                                    return <li>
                                        <Link to={`/partners/` + partner.resource_id} className="partner__name">
                                            <div className={"logo default"}>
                                                <img src={ partner.picture_uri } alt=""/>
                                            </div>
                                            <div className="title">{ partner.name }</div>
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
            </React.Fragment>
        )
    }
}))

const Partner = inject('partnersStore', 'permissionsStore')(observer(class Partner extends Component {

    constructor(props) {
        super(props);

        this.state = {
            preloader: false,
            partnerId: null
        }
    }

    componentDidMount() {
        this.props.partnersStore.loadPartner(this.props.match.params.id, () => {

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
                CookieService.remove('token')
                this.setState({ preloader: false })
                this.props.history.push('/auth')
            }
        })
    }

    render() {

        return (
            <React.Fragment>

                {
                    this.state.preloader &&
                    <Preloader/>
                }

                <NotificationContainer/>

                <div style={{ marginBottom: 16 }}>
                    <Link style={{ color: '#0052A4' }} to={'/partners'}>Все категории</Link>
                    <span> -> </span>
                    {
                        <Link style={{color: '#0052A4'}} to={`/partners/category/${this.props.partnersStore.partnerId}`}>
                            {this.props.partnersStore.partnerName}
                        </Link>
                    }
                    <span> -> </span>
                    <Link style={{ color: '#0052A4', borderBottom: '1px solid #0052A4' }}>{ this.props.partnersStore.partner.name }</Link>
                </div>

                <div className="heading">
                    <div className="logo">
                        <img src={ this.props.partnersStore.partner.picture_uri } alt=""/>
                    </div>
                </div>
                <div className='partner-full'>
                    <ul className="socials">
                        {
                            this.props.partnersStore.partner.vk &&
                            <li>
                                <a href={this.props.partnersStore.partner.vk} target='_blank' className={'vk'} />
                            </li>
                        }
                        {
                            this.props.partnersStore.partner.odnoklassniki &&
                            <li>
                                <a href={this.props.partnersStore.partner.odnoklassniki} target='_blank' className={'ok'} />
                            </li>
                        }
                        {
                            this.props.partnersStore.partner.instagram &&
                            <li>
                                <a href={this.props.partnersStore.partner.instagram} target='_blank' className={'instagram'} />
                            </li>
                        }
                        {
                            this.props.partnersStore.partner.facebook &&
                            <li>
                                <a href={this.props.partnersStore.partner.facebook} target='_blank' className={'facebook'} />
                            </li>
                        }
                        {
                            this.props.partnersStore.partner.whatsapp &&
                            <li>
                                <a href={this.props.partnersStore.partner.whatsapp} target='_blank' className={'whatsapp'} />
                            </li>
                        }
                        {
                            this.props.partnersStore.partner.twitter &&
                            <li>
                                <a href={this.props.partnersStore.partner.twitter} target='_blank' className={'twitter'} />
                            </li>
                        }
                        {
                            this.props.partnersStore.partner.telegram &&
                            <li>
                                <a href={this.props.partnersStore.partner.telegram} target='_blank' className={'telegram'} />
                            </li>
                        }
                    </ul>

                    <div className="title_text">
                        { this.props.partnersStore.partner.name }
                    </div>
                    <div className="info" dangerouslySetInnerHTML={{ __html: this.props.partnersStore.partner.description }}>

                    </div>
                </div>
                <div className="info">
                    <div className="icon">
                        <MarkIcon/>
                    </div>
                    <div className="text">
                        Если у Вас остались вопросы, обращайтесь в свой <Link to='/my-union'>профсоюз</Link>.
                    </div>
                </div>
            </React.Fragment>
        )
    }
}))

export default inject('partnersStore', 'permissionsStore')(observer(Partners));