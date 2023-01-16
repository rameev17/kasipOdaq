import React, {Component} from 'react';
import {Link} from "react-router-dom";
import {connect} from 'react-redux'
import {ReactComponent as EditIcon} from "../../assets/icons/edit.svg";
import {ReactComponent as RemoveIcon} from "../../assets/icons/remove.svg";
import {inject, observer} from "mobx-react";
import {NotificationContainer, NotificationManager} from "react-notifications";

class AboutOpo extends Component {

    constructor(props){
        super(props);

        this.state = {
            preloader: false,
        }

    }

    componentDidMount() {

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
                    this.setState({ preloader: false });
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
                    this.setState({ preloader: false });
                    this.props.history.push('/')
                }
            })
        }
    }

    render() {
        return (
            <div>

                {
                    this.props.userStore.role == 'industry' &&
                    <div className="title-wrapper" style={{display: 'flex', justifyContent: 'flex-end'}}>
                        {/*<h1>{ this.props.unionStore.union.name }</h1>*/}
                        {/*<Link to={`/union/opo/${this.state.id}/ppos/add`}>Добавить ППО </Link>*/}
                        <Link to={`/union/reports?union_id=${this.props.userStore.profile.union.resource_id}`} style={{
                            border: '1px solid #002F6C',
                            color: '#002F6C',
                            backgroundColor: 'transparent'
                        }}>{this.props.userStore.languageList['Отчеты'] || 'Отчеты'}</Link>
                    </div>
                }

                <div className='opo-info'>
                    <div className="heading">
                        <div className="logo">
                            { this.props.unionStore.union.picture &&
                            <img src={ this.props.unionStore.union.picture.uri } alt=""/>
                            }
                        </div>
                        <div className="name">{ this.props.unionStore.union.name }</div>
                    </div>
                    <div className="container">
                        <div className="about-opo">
                            <div className="wrapper">
                                <p className="subtitle">
                                    {this.props.userStore.languageList["Об отрасли"] || 'Об отрасли'}
                                </p>
                                <div className="line"/>
                                <div className="links">
                                    {/*<div className="remove" onClick={this.handleRemove}>*/}
                                    {/*    <div className="btn-action">*/}
                                    {/*        <div className="icon">*/}
                                    {/*            <RemoveIcon/>*/}
                                    {/*        </div>*/}
                                    {/*        <span>Удалить</span>*/}
                                    {/*    </div>*/}
                                    {/*</div>*/}
                                    {
                                        this.props.userStore.role == 'industry' &&
                                        <Link className='edit-ppo' to={`/union/opo/${this.props.unionStore.union.resource_id}/edit`}>
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
                            </div>
                            <div className="text" dangerouslySetInnerHTML={{ __html: this.props.unionStore.union.about_company }}>

                            </div>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}

export default inject('unionStore', 'permissionsStore', 'userStore')(observer(AboutOpo));