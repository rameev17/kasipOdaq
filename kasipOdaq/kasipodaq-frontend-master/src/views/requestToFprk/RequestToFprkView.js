import React, {Component} from 'react';
import Layout from "../../fragments/layout/Layout";
import Ticket from "../../fragments/ticket/Ticket";
import TabsLayout from "../../fragments/tabsLayout/TabsLayout";
import './style.scss'
import {Route, Switch} from "react-router";
import {Scrollbars} from 'react-custom-scrollbars';
import {ReactComponent as ClipIcon} from '../../assets/icons/clip.svg'
import {ReactComponent as PlusIcon} from '../../assets/icons/plus.svg'
import {inject, observer} from "mobx-react";

class RequestToFprk extends Component {

    constructor(props) {
        super(props);

        this.state = {

        }
    }

    createTicket = () => {
        this.props.history.push('/request-to-fprk/create-ticket')
    }

    render() {
        return (
            <Layout title={this.props.userStore.languageList["Обращения"] || 'Обращения'}>
                <Scrollbars>
                    <div className='requests'>
                        <div className="requests__wrapper">
                            <Ticket type={0}/>
                            <button className="send-request" onClick={this.createTicket}>{this.props.userStore.languageList["Подать обращение"] || 'Подать обращение'}</button>
                        </div>
                    </div>
                </Scrollbars>
            </Layout>
        );
    }
}

export default inject('appealStore', 'userStore', 'permissionsStore')(observer(RequestToFprk));