import React, {Component} from 'react';
import ReactQuill from 'react-quill';
import {inject, observer} from "mobx-react";
import {NotificationContainer, NotificationManager} from "react-notifications";
import Preloader from "../../fragments/preloader/Preloader";
import {Link} from "react-router-dom";
import CookieService from "../../services/CookieService";

class DisputeSingleInfo extends Component {
    constructor(props){
        super(props);

        this.state = {
            preloader: true,
            resolved: false,
        }
    }

    componentDidMount() {
        this.props.disputeStore.loadDispute(this.props.match.params.id, CookieService.get('language-admin') || 'ru',() => {
            this.setState({
                preloader: false,
                resolved: this.props.disputeStore.resolved
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
                        {/*<div className="lang ru">Информация на русском языке</div>*/}
                        {/*<div className="lang kz">Информация на казахском языке</div>*/}
                    </div>
                    <div className="data">
                        <label>
                            <span>{this.props.userStore.languageList["Тема"] || 'Тема'}</span>
                            <p dangerouslySetInnerHTML={{ __html: this.props.disputeStore.dispute.title }}></p>
                        </label>
                        <label>
                            <span>{this.props.userStore.languageList["Описание"] || 'Описание'}</span>
                            <p dangerouslySetInnerHTML={{ __html: this.props.disputeStore.disputeThesis }}></p>
                        </label>
                        <label>
                            <span>{this.props.userStore.languageList["Решение"] || 'Решение'}</span>
                            <p dangerouslySetInnerHTML={{ __html: this.props.disputeStore.disputeSolution }}></p>
                        </label>
                        <div className='checkbox'>
                            <input type="checkbox"
                                   checked={this.state.resolved}
                                   id="source"
                                   name='source'
                                   disabled
                            />
                            <label htmlFor="source">
                                <div>{this.props.userStore.languageList["Решено"] || 'Решено'}</div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default inject('disputeStore', 'userStore', 'permissionsStore')(observer(DisputeSingleInfo));