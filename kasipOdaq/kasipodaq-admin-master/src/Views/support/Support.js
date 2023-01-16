import React, {Component} from 'react';
import Layout from "../Containers/Layout";
import Ticket from "../../fragments/ticket";
import './index.scss'
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
        this.props.history.push('/options/support/create-ticket')
    }

    render() {
        return (
            <Layout title='Служба поддержки'>
                <div className="content">
                    <div className="title-wrapper">
                        <h1 className="title">Техническая служба поддержки</h1>
                        <a className="add-article" onClick={this.createTicket}><span>Подать обращение</span></a>
                    </div>
                    <div className="support panel">
                        {this.state.tickets.map((item, index) => (
                            <Ticket ticket={item} key={index}/>
                        ))}
                    </div>
                </div>
            </Layout>
        );
    }
}

export default Support;