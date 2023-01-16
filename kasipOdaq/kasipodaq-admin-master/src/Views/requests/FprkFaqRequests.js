import React, {Component} from 'react';
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'

import {ReactComponent as CloseIcon} from "../../assets/icons/cross.svg";

class FaqRequests extends Component {

    state = {
        requests: []
    }

    render() {

        return (

            <div className='faq-requests'>
                <div className="subtitle-wrapper">
                    <h2 className="subtitle">Часто задаваемые вопросы</h2>
                    <div className="line"/>
                    <Link to='/requests/faq/add'>
                        <div className="btn-action">
                            <span>
                                Добавить
                            </span>
                        </div>
                    </Link>
                </div>
                <ul className="requests-list">
                    <li>
                        <Question
                                  deleteRequest={this.deleteRequest}/>
                    </li>
                </ul>
            </div>
        );
    }
}

class Question extends Component{

    state = {
        expanded: false
    }

    expand = () => {
        this.setState({expanded: !this.state.expanded})
    }

    render(){

        return(

            <div className='question-item' onClick={this.expand}>
                <div className="question">
                    question
                </div>
                <div className={"icon is-active"}>
                    <CloseIcon/>
                </div>
                {this.state.expanded &&
                <React.Fragment>
                    <div className="links">
                        <Link to={`/requests/request/1/edit`}>Редактировать</Link>
                        <span className="delete">Удалить</span>
                    </div>
                    <div className="answer">
                    answer
                    </div>
                </React.Fragment>
                }
            </div>
        )
    }
}

export default FaqRequests;