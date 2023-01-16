import React, {Component} from 'react';
import DisouteEvents from './DisputeEvents'
import PpoList from './PpoList'
import OpoList from './OpoList'
import './index.scss';
import {inject, observer} from "mobx-react";

class DisputeMenu extends Component {

    constructor(props){
        super(props)
    }

    state = {
        role: ''
    }

    render() {

        return (

            <div className='content'>
                <h1 className='title'>{this.props.userStore.languageList["Трудовой спор"] || 'Трудовой спор'}</h1>
                <div className="panel">
                        <DisouteEvents/>
                        <PpoList/>
                        <OpoList/>
                </div>
            </div>
        );
    }
}

export default inject( 'userStore')(observer(DisputeMenu));