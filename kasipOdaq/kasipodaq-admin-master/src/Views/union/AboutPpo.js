import React, {Component} from 'react';
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {ReactComponent as EditIcon} from "../../assets/icons/edit.svg";
import {ReactComponent as RemoveIcon} from "../../assets/icons/remove.svg";
import {ReactComponent as DownloadIcon} from '../../assets/icons/download.svg';
import {ReactComponent as LeftArrowIcon} from '../../assets/icons/arrow.svg';
import {inject, observer} from "mobx-react";
import Preloader from "../../fragments/preloader/Preloader";
import {NotificationContainer, NotificationManager} from "react-notifications";

class AboutPpo extends Component {

    constructor(props) {
        super(props);

        this.state = {
            preloader: false
        }

        this.deleteUnion = this.deleteUnion.bind(this)

    }

    loadPage(){
        if (this.props.match.params.id !== 'undefined' && this.props.match.params.id !== undefined){
            this.props.unionStore.loadUnion(this.props.match.params.id, () => {

            }, response => {
                if (Array.isArray(response.data)) {
                    response.data.forEach(error => {
                        this.setState({ preloader: false })
                        // NotificationManager.error(error.message)
                    })
                } else {
                    this.setState({ preloader: false })
                    // NotificationManager.error(response.data.message)
                }
                if (response.status == 401){
                    this.setState({ preloader: false })
                    this.props.history.push('/')
                }
            })
        }else{
            this.props.unionStore.loadUnion(this.props.userStore.profile.union.resource_id, () => {

            }, response => {
                // if (Array.isArray(response.data)) {
                //     response.data.forEach(error => {
                //         this.setState({ preloader: false })
                //         NotificationManager.error(error.message)
                //     })
                // } else {
                //     this.setState({ preloader: false })
                //     NotificationManager.error(response.data.message)
                // }
                if (response.status == 401){
                    this.setState({ preloader: false })
                    this.props.history.push('/')
                }
            })
        }
    }

    componentDidMount() {
        this.loadPage()
    }

    deleteUnion(event){
        this.setState({ preloader: true })

        let id = this.props.match.params.id

        this.props.unionStore.deleteUnion(id,
            () => {
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
        })
    }

    render() {

        return (
            <div className='opo-info opo-wrapper'>

                {
                    this.state.preloader &&
                        <Preloader/>
                }

                <NotificationContainer/>

                <div className="heading">
                    <div className="logo">
                        { this.props.unionStore.union.picture &&
                            <img src={ this.props.unionStore.union.picture.uri } alt=""/>
                        }
                    </div>
                    <div className="name">{ this.props.unionStore.union.name }</div>
                    <div className="line"/>
                    <div className="links">
                        {
                            this.props.userStore.role == 'industry' &&
                            <div className="remove" onClick={this.deleteUnion}>
                                <div className="btn-action">
                                    <div className="icon" onClick={this.deleteUnion}>
                                        <RemoveIcon/>
                                    </div>
                                    <span>{this.props.userStore.languageList["Удалить"] || 'Удалить'}</span>
                                </div>
                            </div>
                        }
                        {
                            this.props.userStore.role == 'industry' &&

                                <div style={{ display: 'flex' }}>
                                    {this.props.match.params.id !== 'undefined' && this.props.match.params.id !== undefined ?
                                        <Link className='edit-ppo' to={{
                                            pathname: `/union/ppo/${this.props.match.params.id}/edit`,
                                            state: {tabId: 1}
                                        }}
                                        >
                                            <div className="btn-action">
                                                <div className="icon">
                                                    <EditIcon/>
                                                </div>
                                                <span>
                                    {this.props.userStore.languageList["Редактировать"] || 'Редактировать'}
                                </span>
                                            </div>
                                        </Link>
                                        :
                                        <Link className='edit-ppo' to={{
                                            pathname: `/union/ppo/${this.props.userStore.profile.union.resource_id}/edit`,
                                            state: {tabId: 1}
                                        }}
                                        >
                                            <div className="btn-action">
                                                <div className="icon">
                                                    <EditIcon/>
                                                </div>
                                                <span>
                                    {this.props.userStore.languageList["Редактировать"] || 'Редактировать'}
                                </span>
                                            </div>
                                        </Link>
                                    }
                                </div>
                        }

                        {
                            this.props.userStore.role == 'company' &&

                            <div style={{ display: 'flex' }}>
                                {this.props.match.params.id !== 'undefined' && this.props.match.params.id !== undefined ?
                                    <Link className='edit-ppo' to={{
                                        pathname: `/union/ppo/${this.props.match.params.id}/edit`,
                                        state: {tabId: 1}
                                    }}
                                    >
                                        <div className="btn-action">
                                            <div className="icon">
                                                <EditIcon/>
                                            </div>
                                            <span>
                                    {this.props.userStore.languageList["Редактировать"] || 'Редактировать'}
                                </span>
                                        </div>
                                    </Link>
                                    :
                                    <Link className='edit-ppo' to={{
                                        pathname: `/union/ppo/${this.props.userStore.profile.union.resource_id}/edit`,
                                        state: {tabId: 1}
                                    }}
                                    >
                                        <div className="btn-action">
                                            <div className="icon">
                                                <EditIcon/>
                                            </div>
                                            <span>
                                    {this.props.userStore.languageList["Редактировать"] || 'Редактировать'}
                                </span>
                                        </div>
                                    </Link>
                                }
                            </div>
                        }


                    </div>
                </div>
                <div className="container">
                    <div className="about-company">
                        <p className="subtitle">
                            {this.props.userStore.languageList["О компании"] || 'О компании'}
                        </p>
                        <div className="text" dangerouslySetInnerHTML={{ __html: this.props.unionStore.union.about_company }}>

                        </div>
                    </div>
                    <div className="about-union">
                        <p className="subtitle">
                            {this.props.userStore.languageList["О профсоюзе"] || 'О профсоюзе'}
                        </p>
                        <div className="text" dangerouslySetInnerHTML={{ __html: this.props.unionStore.union.about_union }}>

                        </div>
                        <div className="bottom">
                
                <span className="subtitle">{this.props.userStore.languageList["Документы"] || 'Документы'}</span>
                <div className="documents">
                    {/*{*/}
                    {/*    this.props.unionStore.union.files.map(file => {*/}
                    {/*        return <label className="document">*/}
                    {/*            <span>{ file.name }</span>*/}
                    {/*            <div className="icons__wrapper">*/}
                    {/*                <a href={ file.uri } className="icon download">*/}
                    {/*                    <DownloadIcon/>*/}
                    {/*                </a>*/}
                    {/*            </div>*/}
                    {/*        </label>*/}
                    {/*    })*/}
                    {/*}*/}

                    {
                        this.props.unionStore.union.protocol &&
                        <label className="document">
                            <span>{ this.props.unionStore.union.protocol.name }</span>
                            <div className="icons__wrapper">
                                <a href={ this.props.unionStore.union.protocol.uri } className="icon download">
                                    <DownloadIcon/>
                                </a>
                            </div>
                        </label>
                    }

                    {
                        this.props.unionStore.union.position &&
                        <label className="document">
                            <span>{ this.props.unionStore.union.position.name }</span>
                            <div className="icons__wrapper">
                                <a href={ this.props.unionStore.union.position.uri } className="icon download">
                                    <DownloadIcon/>
                                </a>
                            </div>
                        </label>
                    }

                    {
                        this.props.unionStore.union.statement &&
                            <label className="document">
                                <span>{ this.props.unionStore.union.statement.name }</span>
                                <div className="icons__wrapper">
                                    <a href={ this.props.unionStore.union.statement.uri } className="icon download">
                                        <DownloadIcon/>
                                    </a>
                                </div>
                            </label>
                    }


                    {
                        this.props.unionStore.union.agreement &&
                        <label className="document">
                            <span>{ this.props.unionStore.union.agreement.name }</span>
                            <div className="icons__wrapper">
                                <a href={ this.props.unionStore.union.agreement.uri } className="icon download">
                                    <DownloadIcon/>
                                </a>
                            </div>
                        </label>
                    }

                    <label className="document">
                        <a href={`/union/ppo/${this.props.unionStore.union.resource_id}/sample_application`} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <span>{this.props.userStore.languageList["Образцы заявлений"] || 'Образцы заявлений'}</span>
                            <div className="icons__wrapper">
                                <LeftArrowIcon />
                            </div>
                        </a>
                    </label>
                
                </div>
                
            </div>
                    </div>
                </div>
                
            </div>
        );
    }
}

export default inject('unionStore', 'permissionsStore', 'userStore')(observer(AboutPpo));