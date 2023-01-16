import React, {Component} from "react";
import {ReactComponent as LawyerIcon} from '../../assets/icons/help.svg';
import {ReactComponent as DownloadIcon} from "../../assets/icons/download.svg";
import {inject, observer} from "mobx-react";
import Preloader from "../preloader/Preloader";
import {NotificationContainer, NotificationManager} from 'react-notifications';


const dateFormat = require('dateformat')

class Ticket extends Component {
    constructor(props) {
        super(props);

        this.state = {
            preloader: true,
            isVisibleText: false,
            visibleText: 0,
        }

    }

    componentDidMount() {
        this.props.appealStore.loadAppealList(this.props.type,() => {
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
        })
    }

    render() {

        return (
            <div>
            {
                this.state.preloader &&
                    <Preloader/>
            }
            <NotificationContainer/>
            {
                this.props.appealStore.appealList.map((appeal, index) => {
                    return  <div className={'ticket is-ready'} key={index}>
                        <div className="title">{appeal.title}</div>
                        <div className="date">{ dateFormat(appeal.created_date, 'dd.mm.yyyy') }</div>
                        <div className="question">
                            <div className="text">
                                {appeal.content}
                            </div>
                            <ul className='documents-list'>
                                {
                                    appeal.files.map(file => {
                                        return <li style={{  position: 'relative' }}>
                                            <a href={file.uri} className="download__link" target={'_blank'} style={{ minHeight: '44px', height: 'auto' }}>
                                                { file.name }
                                                <div className="icon download__icon" style={{  position: 'absolute', right: '7px', top: '7px' }}>
                                                    <DownloadIcon/>
                                                </div>
                                            </a>
                                        </li>
                                    })
                                }

                            </ul>

                        </div>
                        {
                            !appeal.answer.content &&
                            <div className="answer">
                                <label onClick={() => this.setState({isVisibleText: true})}>
                                    <div className="icon__human">
                                        <LawyerIcon/>
                                    </div>
                                    <span>{this.props.userStore.languageList["Ответ:"] || 'Ответ:'}</span>
                                    <span className="status">{this.props.userStore.languageList["В обработке"] || 'В обработке'}</span>
                                </label>
                            </div>
                        }

                        {
                            appeal.answer.content &&
                            <div className="answer">
                                <label onClick={() => { this.setState({ isVisibleText: !this.state.isVisibleText }) }}>
                                    <div className="icon__human">
                                        <LawyerIcon/>
                                    </div>
                                    <span>{this.props.userStore.languageList["Ответ"] || 'Ответ'}:
                                        { this.state.isVisibleText ? this.props.userStore.languageList['Свернуть'] || 'Свернуть' : this.props.userStore.languageList['Развернуть'] || 'Развернуть' }
                                    </span>
                                    {/*<span className="status">{this.state.status}</span>*/}
                                    <div className={"icon " + (this.state.isVisibleText ? "rotate180" : "")}></div>
                                </label>
                                <div className={"text " + (this.state.isVisibleText ? "is-visible" : "")}
                                     dangerouslySetInnerHTML={{__html: appeal.answer.content}}
                                >
                                </div>
                                <ul className='documents-list'>
                                    {
                                        appeal.answer.files.map(file => {
                                            return  <li>
                                                <div className={'document ' + (this.state.isVisibleText ? "is-visible" : "")}>
                                                    <a href={file.uri} target={'_blank'} >{file.name}</a>
                                                </div>
                                            </li>
                                        })
                                    }
                                </ul>
                            </div>
                        }
                    </div>
                })
            }
            </div>
        )
    }
}

export default inject('appealStore', 'userStore')(observer(Ticket));