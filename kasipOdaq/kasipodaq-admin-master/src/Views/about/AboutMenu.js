import React, {Component} from 'react';
import {Link} from "react-router-dom";
import AboutInfo from './AboutInfo'
import {inject, observer} from "mobx-react";

class AboutMenu extends Component {
    render() {
        return (
            <div className='content'>
                <h1 className="title">{this.props.userStore.languageList["О Федерации"] || 'О Федерации'}</h1>
                <div className="panel">
                    {/*<ul className="about-menu">*/}
                    {/*    <li>*/}
                    {/*        <Link to='/about/regulations'>Устав ФПРК</Link>*/}
                    {/*    </li>*/}
                    {/*    <li>*/}
                    {/*        <Link to='/about/divisions/congress'>Органы ФПРК</Link>*/}
                    {/*    </li>*/}
                    {/*    <li>*/}
                    {/*        <Link to='/about/direction'>Руководство</Link>*/}
                    {/*    </li>*/}
                    {/*    <li>*/}
                    {/*        <Link to='/about/history'>История</Link>*/}
                    {/*    </li>*/}
                    {/*    <li>*/}
                    {/*        <Link to='/about/activity'>Деятельность</Link>*/}
                    {/*    </li>*/}
                    {/*</ul>*/}
                    <AboutInfo/>
                </div>
            </div>
        );
    }
}

export default inject('userStore')(observer(AboutMenu));