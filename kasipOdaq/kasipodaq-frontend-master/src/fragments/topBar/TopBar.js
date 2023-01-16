import React, {Component} from 'react'
import { Link } from 'react-router-dom'

import './index.scss'
import BottomBar from "../bottomBar/BottomBar";
import {ReactComponent as BellDesktopIcon} from "../../assets/icons/belldesktopicon.svg";
import CookieService from "../../services/CookieService";

class TopBar extends Component{

    state = {
        notifications: false,
    }

    componentDidMount() {

    }

    render(){

        return(
            <div className="top-bar">
                <div className="title">
                    {this.props.title}
                </div>
                <div className="notifications">
                    {
                        CookieService.get('token') &&
                        <Link to='/notifications'>
                            <div className="icon">
                            </div>
                            <BellDesktopIcon />
                        </Link>
                    }
                </div>
            </div>
        )
    }
}

export default TopBar