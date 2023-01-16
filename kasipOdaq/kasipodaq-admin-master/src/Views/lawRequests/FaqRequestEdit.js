import React, {Component} from 'react';
import ReactQuill from 'react-quill';
import Preloader from "../../fragments/preloader/Preloader";
import {NotificationContainer, NotificationManager} from "react-notifications";
import {inject, observer} from "mobx-react";

class FaqRequestEdit extends Component {

    constructor(props){
        super(props)

        this.state = {
            preloader: true,
        }

        this.questionRef = React.createRef()
        this.answerRef = React.createRef()

        this.saveRequest = this.saveRequest.bind(this)

    }

    componentDidMount() {

        this.props.faqStore.loadFaq(this.props.match.params.id, () => {
            this.setState({ preloader: false })
        },response => {
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

    saveRequest(){
        this.setState({ preloader: true })

        this.props.faqStore.editFaq(
            this.props.match.params.id,
            this.questionRef.current.value,
            this.props.faqStore.faq.answer,
            () => {
                this.setState({ preloader: false })
                this.props.history.goBack()
            },response => {
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

    render() {
        return (
            <div className='law-request-edit'>

                {
                    this.state.preloader &&
                        <Preloader/>
                }

                <NotificationContainer/>

                <div className="toggle-lang">
                    {/*<div className="lang ru">Информация на русском языке</div>*/}
                    {/*<div className="lang kz">Информация на казахском языке</div>*/}
                </div>
                <div className="data">
                    <label>
                        <span>{this.props.userStore.languageList["Вопрос"] || 'Вопрос'}</span>
                        <input type="text"
                               ref={this.questionRef}
                               name='title'
                               value={this.props.faqStore.faq.question}
                               onChange={(e) => { this.props.faqStore.faq.question = e.target.value }}
                               placeholder={this.props.userStore.languageList["Наименование"] || 'Наименование'}
                        />
                    </label>
                    <label>
                        <span>{this.props.userStore.languageList["Ответ"] || 'Ответ'}</span>
                        <ReactQuill
                            ref={this.answerRef}
                            value={this.props.faqStore.faq.answer}
                            onChange={(text) => { this.props.faqStore.faq.answer = text }}
                        />
                    </label>
                </div>
                <div className="btns">
                    <button className="cancel" onClick={() => { this.props.history.goBack() }}>{this.props.userStore.languageList["Отменить"] || 'Отменить'}</button>
                    <button className="save" onClick={this.saveRequest}>{this.props.userStore.languageList["Сохранить"] || 'Сохранить'}</button>
                </div>
            </div>
        );
    }
}

export default inject('faqStore', 'userStore', 'permissionsStore')(observer(FaqRequestEdit));