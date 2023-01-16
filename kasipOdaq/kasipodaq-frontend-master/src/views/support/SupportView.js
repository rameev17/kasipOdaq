import React, {Component} from 'react';
import Layout from "../../fragments/layout/Layout";
import Ticket from "../../fragments/ticket/Ticket";
import './style.scss'
import {inject, observer} from "mobx-react";

class Support extends Component {

    state = {
        tickets: []
    }

    componentDidMount() {

        const tickets = [
            {
                title: 'Единовременное поощрение за добросовестный труд',
                date: '15.05.19',
                question: 'Почему мне не выплатили единовременное поощрение за добросовестный труд?',
                answer: '',
                status: 'В обработке'
            },
            {
                title: 'Единовременное поощрение за добросовестный труд',
                date: '15.05.19',
                question: 'Почему мне не выплатили единовременное поощрение за добросовестный труд?',
                answer: '',
                status: ''
            },
            {
                title: 'Единовременное поощрение за добросовестный труд',
                date: '15.05.19',
                question: 'Почему мне не выплатили единовременное поощрение за добросовестный труд?',
                answer: 'Федерация профсоюзов Республики Казахстан, рассмотрев ваше обращение сообщает: Профсоюзные организации в своей деятельности руководствуются Конституцией РК, Трудовым Кодексом РК, Законом РК «О профессиональных союзах», Законом РК «Об общественных объединениях».',
                status: ''
            }
        ]

        this.setState({
            tickets: tickets
        })
    }

    createTicket = () => {
        this.props.history.push('/preferences/support/create-ticket')
    }

    render() {
        return (
            <Layout title={this.props.userStore.languageList["Служба поддержки"] || 'Служба поддержки'}>
                <div className="support">
                    <Ticket type={4}/>
                    <button onClick={this.createTicket}>{this.props.userStore.languageList["Подать обращение"] || 'Подать обращение'}</button>
                </div>
            </Layout>
        );
    }
}

export default inject('userStore')(observer(Support));