import React, {Component} from 'react';
import Layout from "../../fragments/layout/Layout";

import {NotificationContainer, NotificationManager} from 'react-notifications';
import { ModalCreateUnion } from '../../fragments/modals/Modal';

import {ReactComponent as LogoIcon} from '../../assets/icons/logo.svg';
import {ReactComponent as DeleteIcon} from '../../assets/icons/close.svg';
import {ReactComponent as DownloadIcon} from '../../assets/icons/download.svg';

import './style.scss';

import { observer, inject } from "mobx-react";
import Preloader from "../../fragments/preloader/Preloader";
import CookieService from "../../services/CookieService";
import {ReactComponent as CheckedIcon} from "../../assets/icons/checked.svg";
import {Textbox} from "react-inputs-validation";

class IndustryList extends Component{

    constructor(props){
        super(props)

        this.state = {
            preloader: true
        }

        this.industrySelect = this.industrySelect.bind(this)
    }

    componentDidMount() {
        this.props.unionStore.loadIndustryAssociations( response => {
            this.setState({ preloader: false })
            if (Array.isArray(response.data)) {
                response.data.forEach(error => {
                    this.setState({preloader: false})
                    NotificationManager.error(error.message)
                })
            } else {
                NotificationManager.error(response.data.message)
                this.setState({preloader: false})
            }
            if (response.status == 401){
                CookieService.remove('token')
                this.setState({ preloader: false })
                this.props.history.push('/auth')
            }
        });
    }

    industrySelect(industry){
        this.props.unionStore.industry.resource_id = industry.resource_id
        this.props.unionStore.industry.name = industry.name
        this.props.unionStore.unionAssociation = {}
        this.props.unionStore.unions = {}
        this.props.history.push("/create-union")
    }

    render(){
        return(
            <Layout title={'отраслевое объединение'}>
                {
                    this.state.preloader &&
                    <Preloader/>
                }
                <NotificationContainer/>
                <div className='placeList'>
                    <ul>
                        {
                            this.props.unionStore.industryList.map(industry => {
                                return <li onClick={() => this.industrySelect(industry)}>{ industry.name }</li>
                            })
                        }
                    </ul>
                </div>

            </Layout>
        )
    }
}

export default inject('userStore', 'unionStore', 'permissionsStore')(observer(IndustryList));
