import React, {Component} from 'react';
import {withRouter} from 'react-router-dom'

class TabsLayout extends Component {

    state={
        tabId: 1
    }

    // static defaultProps = {
    //     tabId: 1
    // }

    changeTab = (tab) => {
        this.props.changeTabCallback(tab)
    }

    componentWillReceiveProps(nextProps, nextContext) {
        // console.log(
        //     nextProps.location
        // )

        if(nextProps.location.state){
            this.setState({
                tabId: nextProps.location.state.tabId
            })
        }
    }

    render() {
        return (
            <React.Fragment>
                <div className='tabs'>
                    {this.props.tabs?.map((item, idx) => (
                        <Tab tab={item}
                             idx={idx}
                             key={idx}
                             changeTab={this.changeTab}
                             tabId={this.state.tabId}
                        />
                    ))}
                </div>

                {this.props.children}
            </React.Fragment>
        );
    }
}

class Tab extends Component {

    state = {
        name: '',
        route: '',
        id: '',
        tabId:1
    }

    componentDidMount() {
        this.setState({
            name: this.props.tab.name,
            route: this.props.tab.route,
            id: this.props.idx,
            tabId: this.props.tabId
        })
    }

    handleClick = (e) => {
        e.preventDefault()
        this.props.changeTab(e.target.id)
    }

    render() {

        return (
            <a href='#' className={'tab' + (this.props.tabId == this.state.id + 1 ? ' is-active' : '')}
               onClick={this.handleClick}
               id={this.state.id + 1}
            >{this.state.name}</a>
        )
    }
}

export default withRouter(TabsLayout);