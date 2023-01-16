import React, {Component} from 'react';
import Ppo from "./Ppo";
import Opo from "./Opo";
import Fprk from "./Fprk";
import Filial from "./Filial";
import Top from "./Top";
import ReactQuill from 'react-quill'
import './index.scss'

import {ReactComponent as EditIcon} from '../../assets/icons/edit.svg'
import {inject, observer} from "mobx-react";
import {toast} from "react-toastify";
import OpoList from "./OpoList";

class LaborProtection extends Component {

    constructor(props){
        super(props)

        this.state = {
            preloader: false,
            editText: false
        }

    }

    componentDidMount() {

    }

    render() {

        return (
            <React.Fragment>
                {
                    this.props.userStore.role == 'fprk' &&
                    <Fprk/>
                }
                {
                    this.props.userStore.role == 'industry' &&
                    <OpoList {...this.props}/>
                }
                {
                    this.props.userStore.role == 'company' &&
                    <Ppo/>
                }
                {
                    this.props.userStore.role == 'branch' &&
                    <Filial {...this.props}/>
                }
                {
                    this.props.userStore.role == 'association' &&
                    <Top {...this.props}/>
                }
            </React.Fragment>
        );
    }
}

export default inject('unionStore', 'infoStore', 'permissionsStore', 'userStore')(observer(LaborProtection));