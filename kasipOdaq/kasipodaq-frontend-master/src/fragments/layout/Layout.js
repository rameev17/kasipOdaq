import React from 'react'
import TopBar from '../topBar/TopBar'
import BottomBar from '../bottomBar/BottomBar'
import DesktopMenu from "../desktopMenu/DesktopMenu";
import DesktopTopBar from "../desktopTopBar/DesktopTopBar";


import './index.scss'

class Layout extends React.Component{

    state = {
        mobileMenuIsOpen: true
    }

    toggleMenu = () => {
        this.setState({mobileMenuIsOpen: !this.state.mobileMenuIsOpen})
    }

    render(){

        return(
            <div className="page-container">
                <DesktopMenu isActive={this.state.mobileMenuIsOpen} toggleMenu={this.toggleMenu}/>
                <div className="page">
                    <DesktopTopBar title={this.props.title}/>
                    <TopBar title={this.props.title}/>
                    <div className="page-wrapper">
                        {this.props.children}
                    </div>
                    <BottomBar toggleMenu={this.toggleMenu}/>
                </div>
            </div>
        )
    }
}

export default Layout