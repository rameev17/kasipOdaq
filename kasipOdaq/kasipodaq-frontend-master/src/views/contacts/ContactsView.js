import React, {Component} from 'react'
import Layout from "../../fragments/layout/Layout"

import {ReactComponent as SimpleLogoIcon} from '../../assets/icons/simple-logo.svg'

import './style.scss'
import {inject, observer} from "mobx-react";
import {NotificationContainer, NotificationManager} from 'react-notifications';
import Preloader from "../../fragments/preloader/Preloader";
import CookieService from "../../services/CookieService";

const ARTICLE_ID = 285


class Contacts extends Component {
    constructor(props){
        super(props)
        this.state = {
            preloader: false,
        }
    }

    componentDidMount() {
        this.props.infoStore.loadInfo(null, this.props.infoStore.INFO_KEY_CONTACTS,null, data => {
            this.setState({preloader: false})

            if (data[0] !== undefined){
                this.props.infoStore.infoContacts = data[0].content
            }

        }, response => {
            if (Array.isArray(response.data)) {
                response.data.forEach(error => {
                    this.setState({ preloader: false })
                })
            } else {
                this.setState({ preloader: false })
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
            <Layout title='Контакты'>

                {
                    this.state.preloader &&
                        <Preloader/>
                }

                <NotificationContainer/>

                <div className="plate-wrapper plate-wrapper__height">
                    <div className="contacts">
                        <div className="logo">
                            <div className="img">
                                <div className="icon">
                                    <SimpleLogoIcon/>
                                </div>
                            </div>
                            <div className="text">{this.props.userStore.languageList["Федерация профсоюзов Республики Казахстан"]
                            || 'Федерация профсоюзов Республики Казахстан'}</div>
                        </div>

                        <div className="content" dangerouslySetInnerHTML={{__html: this.props.infoStore.infoContacts}}>
                        </div>

                    </div>
                </div>
            </Layout>
        );
    }
}

export default inject('infoStore', 'userStore', 'permissionsStore')(observer(Contacts));