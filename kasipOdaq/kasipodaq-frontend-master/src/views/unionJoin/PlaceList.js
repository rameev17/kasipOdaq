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

class PlaceListJoin extends Component{

    constructor(props){
        super(props)

        this.state = {
            preloader: true
        }

        this.placeSelect = this.placeSelect.bind(this)
    }

    componentDidMount() {
        this.props.unionStore.loadPlaces( response => {
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

    placeSelect(place){
        this.props.unionStore.place.resource_id = place.resource_id
        this.props.unionStore.place.name = place.city_name
        this.props.history.push("/enter-to-union")
    }

    render(){
        return(
            <Layout title={'Город/область'}>
                {
                    this.state.preloader &&
                    <Preloader/>
                }
                <NotificationContainer/>
                <div className='placeList'>
                    <ul>
                        {
                            this.props.unionStore.placeList.map(place => {
                                return <li onClick={() => this.placeSelect(place)}>{ place.city_name }</li>
                            })
                        }
                    </ul>
                </div>

            </Layout>
        )
    }
}

export default inject('userStore', 'unionStore', 'permissionsStore')(observer(PlaceListJoin));
