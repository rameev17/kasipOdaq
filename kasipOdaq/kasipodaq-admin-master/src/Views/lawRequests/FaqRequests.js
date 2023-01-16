import React, {Component} from 'react';
import {Link} from 'react-router-dom';

import {ReactComponent as CloseIcon} from "../../assets/icons/cross.svg";
import {inject, observer} from "mobx-react";
import Preloader from "../../fragments/preloader/Preloader";
import {NotificationContainer, NotificationManager} from "react-notifications";
import Pager from 'react-pager';

class FaqRequests extends Component {
    constructor(props) {
        super(props);

        this.state = {
            preloader: true,
            page: 1,
        }

        this.handlePageChanged = this.handlePageChanged.bind(this)
    }

    componentDidMount() {
        this.props.history.push({
            state: { tabId: 2 }
        })
        this.loadPage()
    }

    loadPage(){
        this.props.faqStore.loadFaqList(
            this.state.page,() => {
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

    handlePageChanged(newPage) {
        this.setState({page : newPage })
        this.loadPage()
    }

    render() {

        return (

            <div className='faq-requests'>

                {
                    this.state.preloader &&
                        <Preloader/>
                }

                <NotificationContainer/>

                <div className="subtitle-wrapper">
                    <h2 className="subtitle">{this.props.userStore.languageList["Часто задаваемые вопросы"] || 'Часто задаваемые вопросы'}</h2>
                    <div className="line"/>
                    {
                        this.props.permissionsStore.hasPermission('faq', 'create') &&
                        <Link to='/law-requests/faq/add'>
                            <div className="btn-action">
                            <span>
                                {this.props.userStore.languageList["Добавить"] || 'Добавить'}
                            </span>
                            </div>
                        </Link>
                    }

                </div>
                <ul className="requests-list">
                    {
                        this.props.faqStore.faqList.map(faq => {
                           return <li>
                                <Question faq={faq}/>
                            </li>
                        })
                    }
                </ul>

                <Pager
                    total={parseInt(this.props.faqStore.faqHeaders['x-pagination-page-count'])}
                    current={parseInt(this.props.faqStore.faqHeaders['x-pagination-current-page']) - 1}
                    visiblePages={10}
                    titles={{first: '<', last: '>' }}
                    className="search-pagination"
                    onPageChanged={this.handlePageChanged}
                />

            </div>
        );
    }
}

const Question = inject('faqStore', 'userStore', 'permissionsStore')(observer(class Question extends Component{

    constructor(props) {
        super(props);

        this.state = {
            preloader: false,
            expanded: false,
        }

        this.deleteFaq = this.deleteFaq.bind(this)
        this.expand = this.expand.bind(this)
    }

    deleteFaq(e){
        let id = e.target.dataset.id
        this.setState({
            preloader: true
        }, () => {
            this.props.faqStore.deleteFaq(id, () => {
                this.props.faqStore.loadFaqList(1,() => {
                    this.setState({ preloader: false })
                })
            })
        })

    }

    expand() {
        this.setState({
            expanded: !this.state.expanded
        })
    }

    render(){

        return(

            <div className='question-item' onClick={this.expand}>
                <div className="question">
                    {this.props.faq.question}
                </div>
                <div className={"icon" + (this.state.expanded ? ' is-active' : '')}>
                    <CloseIcon/>
                </div>

                {
                    this.state.expanded &&
                    <React.Fragment>
                        <div className="links">
                            {
                                this.props.permissionsStore.hasPermission('faq', 'edit') &&
                                <Link to={`/law-requests/faq/${this.props.faq.resource_id}/edit`}>{this.props.userStore.languageList["Редактировать"] || 'Редактировать'}</Link>
                            }
                            {
                                this.props.permissionsStore.hasPermission('faq', 'deelte') &&
                                <span className="delete" data-id={this.props.faq.resource_id} onClick={this.deleteFaq}>{this.props.userStore.languageList["Удалить"] || 'Удалить'}</span>
                            }
                        </div>
                        <div className="answer" dangerouslySetInnerHTML={{ __html: this.props.faq.answer }}>

                        </div>
                    </React.Fragment>

                }

            </div>
        )
    }
}))

export default inject('faqStore', 'userStore', 'permissionsStore')(observer(FaqRequests));