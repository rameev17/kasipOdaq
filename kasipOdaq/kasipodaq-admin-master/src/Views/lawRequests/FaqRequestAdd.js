import React, {Component} from 'react';
import ReactQuill from 'react-quill';
import {inject, observer} from "mobx-react";
import Preloader from "../../fragments/preloader/Preloader";
import {NotificationContainer, NotificationManager} from "react-notifications";

class FaqRequestAdd extends Component {

    constructor(props){
        super(props)

        this.state = {
            preloader: false,
        }

        this.questionRef = React.createRef()
        this.answerRef = React.createRef()

        this.createRequest = this.createRequest.bind(this)
    }

    componentDidMount() {

        this.setState({
            backLink: `/law-requests/faq`
        })
    }

    createRequest(){

        this.setState({ preloader: true })

        if (this.answerRef.current.value == null){
            this.setState({ preloader: false })
            NotificationManager.error('Заполните пожалуйста поле "ответ"!')
        }else{
            this.props.faqStore.createFaq(
                this.questionRef.current.value,
                this.answerRef.current.value,
                () => {
                    this.setState({ preloader: false })
                    this.props.history.goBack()
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
                }
            )
        }

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
                               name='title'
                               ref={this.questionRef}
                               placeholder={this.props.userStore.languageList["Наименование"] || 'Наименование'}
                               required
                        />
                    </label>
                    <label>
                        <span>{this.props.userStore.languageList["Ответ"] || 'Ответ'}</span>
                        <ReactQuill
                            ref={this.answerRef}
                            onChange={(text) => { this.answerRef.current.value = text }}
                            placeholder={this.props.userStore.languageList["Ответ"] || 'Ответ'}
                        />
                    </label>
                </div>
                <div className="btns">
                    <button className="cancel" onClick={() => { this.props.history.goBack() }}>{this.props.userStore.languageList["Отменить"] || 'Отменить'}</button>
                    <button className="save" onClick={this.createRequest}>{this.props.userStore.languageList["Сохранить"] || 'Сохранить'}</button>
                </div>
            </div>
        );
    }
}

export default inject('faqStore', 'userStore', 'permissionsStore')(observer(FaqRequestAdd));