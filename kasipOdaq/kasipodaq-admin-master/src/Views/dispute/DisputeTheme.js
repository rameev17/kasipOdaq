import React, {Component} from 'react';
import ReactQuill from 'react-quill';
import {inject, observer} from "mobx-react";
import {NotificationContainer, NotificationManager} from "react-notifications";
import Preloader from "../../fragments/preloader/Preloader";
import {Link} from "react-router-dom";
import CookieService from "../../services/CookieService";

class DisputeTheme extends Component {
    constructor(props){
        super(props);

        this.state = {
            preloader: true,
            resolved: false,
            language: CookieService.get('language-admin'),
            subjectRu: '',
            contentRu: '',
            answerRu: '',
            subjectKk: '',
            contentKk: '',
            answerKk: ''
        };

        this.titleRef = React.createRef();

        this.editDispute = this.editDispute.bind(this);
        this.thesisChange = this.thesisChange.bind(this)
    }

    componentDidMount() {

        if (CookieService.get('language-admin') == 'kk'){
            this.setState({
                language: 'kk'
            })
        }else{
            this.setState({
                language: 'ru'
            })
        }

        this.props.disputeStore.loadDispute(this.props.match.params.id, 'ru',(data) => {
            this.setState({
                preloader: false,
                resolved: this.props.disputeStore.resolved,
                subjectRu: data.title,
                contentRu: data.thesis,
                answerRu: data.solution,
            })
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
        });

        this.props.disputeStore.loadDispute(this.props.match.params.id, 'kk',(data) => {
            this.setState({
                subjectKk: data.title,
                contentKk: data.thesis,
                answerKk: data.solution,
            })
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

    editDispute(){

        if (this.state.resolved && this.props.disputeStore.disputeSolution == '<p><br></p>'){
            NotificationManager.error('Заполните поле "Решение')
        }else if (this.props.disputeStore.disputeSolution.length > 11 && !this.state.resolved) {
            NotificationManager.error('Поставьте пожалуйста галочку "Решено"')
        }else {
            this.props.disputeStore.editDispute(
                this.state.subjectRu,
                this.state.subjectKk,
                this.state.contentRu,
                this.state.contentKk,
                this.state.answerRu,
                this.state.answerKk,
                this.state.resolved,
                () => {
                    this.setState({preloader: false});
                    this.props.history.goBack()
                }, response => {
                    if (Array.isArray(response.data)) {
                        response.data.forEach(error => {
                            this.setState({preloader: false});
                            NotificationManager.error(error.message)
                        })
                    } else {
                        this.setState({preloader: false});
                        NotificationManager.error(response.data.message)
                    }
                    if (response.status == 401){
                        this.setState({ preloader: false });
                        this.props.history.push('/')
                    }
                }
            )
        }
    }

    thesisChange(text){
        this.props.disputeStore.dispute.thesis = text
    }

    render() {

        return (
            <div className='dispute-theme'>

                {
                    this.state.preloader &&
                        <Preloader/>
                }

                <NotificationContainer/>

                <div className="title-wrapper">
                    {/*<h1 className="title">title</h1>*/}
                    {/*<Link to={`/dispute/ppo/${this.props.match.params.ppo}/direction/${this.props.match.params.direction}/add-dispute`}>Добавить спор</Link>*/}
                </div>
                <div className="panel">

                    <div style={{ marginBottom: 16 }}>
                        <Link style={{color: '#0052A4'}} onClick={() => this.props.history.goBack()}>{this.props.userStore.languageList['Вернуться назад'] || 'Вернуться назад'}</Link>
                    </div>

                    <div className="toggle-lang">
                        <div className="lang ru" style={{ background: this.state.language == 'ru' ? '#00AEEF': '', color: this.state.language == 'ru' ? '#ffffff' : '' }} onClick={() => this.setState({ language: 'ru' }) }>{this.props.userStore.languageList['Информация на русском языке'] || 'Информация на русском языке'}</div>
                        <div className="lang kz" style={{ background: this.state.language == 'kk' ? '#00AEEF': '', color: this.state.language == 'kk' ? '#ffffff' : '' }} onClick={() => this.setState({ language: 'kk' })}>{this.props.userStore.languageList['Информация на казахском языке'] || 'Информация на казахском языке'}</div>
                    </div>
                    {
                        this.state.language == 'ru' &&
                        <div className="data">
                            <label>
                                <span>{this.props.userStore.languageList["Тема"] || 'Тема'}</span>
                                <input type="text"
                                       name='name'
                                       ref={this.titleRef}
                                       onChange={(e)  => { this.setState({ subjectRu: e.target.value }) } }
                                       value={this.state.subjectRu}
                                       placeholder={this.props.userStore.languageList["Наименование"] || 'Наименование'}
                                />
                            </label>
                            <label>
                                <span>{this.props.userStore.languageList["Описание"] || 'Описание'}</span>
                                <ReactQuill
                                    value={this.state.contentRu}
                                    onChange={(text) => { this.setState({ contentRu: text }) } }
                                />
                            </label>
                            <label>
                                <span>{this.props.userStore.languageList["Решение"] || 'Решение'}</span>
                                <ReactQuill
                                    value={this.state.answerRu}
                                    onChange={(text) => { this.setState({ answerRu: text }) } }
                                />
                            </label>
                            <div className='checkbox'>
                                <input type="checkbox"
                                       checked={this.state.resolved}
                                       onChange={() => { this.setState({ resolved: !this.state.resolved  }) }}
                                       id="source"
                                       name='source'
                                />
                                <label htmlFor="source">
                                    <div>{this.props.userStore.languageList["Решено"] || 'Решено'}</div>
                                </label>
                            </div>
                        </div>
                    }

                    {
                        this.state.language == 'kk' &&
                        <div className="data">
                            <label>
                                <span>{this.props.userStore.languageList["Тема"] || 'Тема'}</span>
                                <input type="text"
                                       name='name'
                                       ref={this.titleRef}
                                       onChange={(e)  => { this.setState({ subjectKk: e.target.value }) } }
                                       value={this.state.subjectKk}
                                       placeholder={this.props.userStore.languageList["Наименование"] || 'Наименование'}
                                />
                            </label>
                            <label>
                                <span>{this.props.userStore.languageList["Описание"] || 'Описание'}</span>
                                <ReactQuill
                                    value={this.state.contentKk}
                                    onChange={(text) => { this.setState({ contentKk: text }) } }
                                />
                            </label>
                            <label>
                                <span>{this.props.userStore.languageList["Решение"] || 'Решение'}</span>
                                <ReactQuill
                                    value={this.state.answerKk}
                                    onChange={(text) => { this.setState({ answerKk: text })} }
                                />
                            </label>
                            <div className='checkbox'>
                                <input type="checkbox"
                                       checked={this.state.resolved}
                                       onChange={() => { this.setState({ resolved: !this.state.resolved  }) }}
                                       id="source"
                                       name='source'
                                />
                                <label htmlFor="source">
                                    <div>{this.props.userStore.languageList["Решено"] || 'Решено'}</div>
                                </label>
                            </div>
                        </div>
                    }
                    <div className="btns">
                        <button className="cancel" onClick={() => {  this.props.history.push('/dispute')}}>{this.props.userStore.languageList["Отменить"] || 'Отменить'}</button>
                        <button className="save" onClick={this.editDispute}>{this.props.userStore.languageList["Сохранить"] || 'Сохранить'}</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default inject('disputeStore', 'userStore', 'permissionsStore')(observer(DisputeTheme));