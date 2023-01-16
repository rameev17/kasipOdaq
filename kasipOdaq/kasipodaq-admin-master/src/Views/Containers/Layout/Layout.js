import React from 'react'
import './index.scss'
import Header from "../../../fragments/header";
import Sidebar from "../../../fragments/sidebar";
import UserProfile from "../../../fragments/userProfile";
import {connect} from "react-redux";

class Layout extends React.Component{

    constructor(props) {
        super(props);

        this.state = {
            mobileMenuIsOpen: false,
            profileIsOpen: false
        }

        this.toggleMenu = this.toggleMenu.bind(this)
        this.toggleProfile = this.toggleProfile.bind(this)

    }

    toggleMenu() {
        this.setState({mobileMenuIsOpen: !this.state.mobileMenuIsOpen})
    }

    toggleProfile() {
        this.setState({profileIsOpen: !this.state.profileIsOpen})
    }

    render(){

        return(
            <div className="page-wrapper">
                <Sidebar/>
                <div className="col-right">
                    <Header/>

                    {this.props.children}
                </div>
            </div>
        )
    }
}

export default Layout;