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

class UnionList extends Component{

    constructor(props){
        super(props)

        this.state = {
            preloader: true,
        }

        this.searchRef = React.createRef()

        this.unionSelect = this.unionSelect.bind(this)
        this.searchUnion = this.searchUnion.bind(this)
    }

    searchUnion(){
        if (this.searchRef.current.value.length >= 3){
            this.setState({ preloader: true })
            this.props.unionStore.loadUnionAssociations(
                this.searchRef.current.value,
                () => {
                    this.setState({ preloader: false })
                },
                response => {
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
                        CookieService.remove('token')
                        this.setState({ preloader: false })
                        this.props.history.push('/auth')
                    }
                }
            )
        }else{
            this.loadPage()
        }
    }

    loadPage(){
        this.props.unionStore.loadUnionAssociations(null,
                response => {
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

    componentDidMount() {
        this.loadPage()
    }

    unionSelect(union){
        this.props.unionStore.unionAssociation.resource_id = union.resource_id
        this.props.unionStore.unionAssociation.name = union.name
        this.props.unionStore.unions = union
        this.props.unionStore.industry = {}
        this.props.history.push("/create-union")
    }

    render(){
        return(
            <Layout title={'Профсоюзное объединение'}>
                {
                    this.state.preloader &&
                    <Preloader/>
                }
                <NotificationContainer/>
                <div className='placeList'>
                    <ul>
                        <input type="text"
                               placeholder={'Поиск...'}
                               ref={this.searchRef}
                               onChange={this.searchUnion}
                        />
                        {
                            this.props.unionStore.unionAssociations.map(union => {
                                return <li onClick={() => this.unionSelect(union) }>{ union.name }</li>
                            })
                        }
                    </ul>
                </div>

            </Layout>
        )
    }
}

export default inject('userStore', 'unionStore', 'permissionsStore')(observer(UnionList));
