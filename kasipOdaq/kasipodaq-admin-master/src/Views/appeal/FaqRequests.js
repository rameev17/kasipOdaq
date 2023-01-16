import React, {Component} from 'react';
import {Link} from 'react-router-dom';

import {ReactComponent as CloseIcon} from "../../assets/icons/cross.svg";
import {inject, observer} from "mobx-react";

class FaqRequests extends Component {

    constructor(props) {
        super(props);

        this.state = {

        }
    }


    componentDidMount() {

        this.props.history.push({
            state: { tabId: 2 }
        })
    }

    render() {

        return (

            <div className='faq-requests'>
                <div className="subtitle-wrapper">
                    <h2 className="subtitle">Часто задаваемые вопросы</h2>
                    <div className="line"/>
                    <Link to='/law-requests/faq/add'>
                        <div className="btn-action">
                            <span>
                                Добавить
                            </span>
                        </div>
                    </Link>
                </div>
                <ul className="requests-list">
                    <li>
                        <Question />
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
                <div className={"icon" + (this.state.expanded ? ' is-active' : '')}>
                    <CloseIcon/>
                </div>

                <React.Fragment>
                    <div className="links">
                        <Link to={`/law-requests/request/1/edit`}>Редактировать</Link>
                        <span className="delete">Удалить</span>
                    </div>
                    <div className="answer">
                        answer
                    </div>
                </React.Fragment>

            </div>
        )
    }
}

export default inject('permissionsStore')(observer(FaqRequests));