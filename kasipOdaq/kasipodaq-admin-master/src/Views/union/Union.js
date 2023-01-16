import React, {Component} from 'react';
import Layout from "../Containers/Layout";
import Fprk from './Fprk';
import Opo from './Opo';
import Ppo from './Ppo';

import './index.scss';
import {inject, observer} from "mobx-react";
import {Redirect} from "react-router";
import Filial from "./Filial";
import Top from "./Top";
import FilialEdit from "./FilialEdit";

export class Union extends Component {

    constructor(props){
        super(props)

        this.state = {
            role: 0,
        }

    }

    componentDidMount() {
        if (this.props.userStore.role == 'industry'){
            return <Redirect to={'/union/opo'}/>
        }
    }

    render() {
        return (
            <Layout title='Профсоюз'>
                <div className="content">

                    {
                        this.props.userStore.role == 'fprk' &&
                        <Fprk/>
                    }

                    {
                        this.props.userStore.role == 'industry' &&
                        <Opo/>
                    }

                    {
                        this.props.userStore.role == 'company' &&
                        <Ppo/>
                    }

                    {
                        this.props.userStore.role == 'branch' &&
                        <Filial/>
                    }

                    {
                        this.props.userStore.role == 'association' &&
                        <Top/>
                    }

                </div>
            </Layout>
        );
    }
}

export default inject('permissionsStore', 'userStore')(observer(Union));