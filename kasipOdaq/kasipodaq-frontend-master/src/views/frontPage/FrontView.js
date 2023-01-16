import React, {Component} from 'react';
import Layout from '../../fragments/layout/Layout';
import {Link} from "react-router-dom";

import { observer, inject } from "mobx-react";

import {ReactComponent as LogoIcon} from '../../assets/icons/simple-logo-text.svg';

import './style.scss'
import CookieService from "../../services/CookieService";

class FrontPage extends Component{

    state = {
        loading: true
    }

    componentDidMount() {

        setTimeout(()=>{
            this.setState({loading: false})
        }, 500)
    }

    render(){

        return(
            <Layout title="Выбор языка">
                {this.state.loading && <Preloader/>}
                {!this.state.loading && <Language {...this.props}/>}
            </Layout>
        )
    }
}

class Preloader extends Component{

    render(){

        return(
            <div className='preloader'>
                <LogoIcon/>
            </div>
        )
    }
}

class Language extends Component{
    constructor(props) {
        super(props);

        this.setLanguageKz = this.setLanguageKz.bind(this)
        this.setLanguageRu = this.setLanguageRu.bind(this)
    }

    setLanguageKz(){
        CookieService.create('language','kk' )
        this.props.userStore.getLanguage(CookieService.get('language'))
        this.props.history.push('/news')
    }

    setLanguageRu(){
        CookieService.create('language', 'ru')
        this.props.userStore.getLanguage(CookieService.get('language'))
        this.props.history.push('/news')
    }

    render(){
        return(
            <div className="plate-wrapper language__wrapper">
                <div className="language">
                    <LogoIcon/>
                    <div className="btns">
                        <Link className="btn" onClick={this.setLanguageKz}>Қазақ тілі</Link>
                        <Link className="btn" onClick={this.setLanguageRu}>Русский язык</Link>
                    </div>
                    <div className="text">
                        Вы всегда сможете изменить язык
                        в настройках приложения
                    </div>
                </div>
            </div>

        )
    }
}

export default inject('unionStore', 'userStore', 'permissionsStore')(observer(FrontPage))