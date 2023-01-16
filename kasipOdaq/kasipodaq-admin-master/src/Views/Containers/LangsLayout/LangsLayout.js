import React, {Component} from 'react';

class LangsLayout extends Component {

    state = {
        currentTab: 0
    }

    componentDidMount() {
        this.setState({currentTab: this.props.currentTab})
    }


    changeTab = (tab) => {
        this.setState({currentTab: tab}, () => {
            this.props.changeTabCallback(tab)
        })
    }

    render() {
        return (
            <React.Fragment>
                <div className='tabs'>
                    {this.props.tabs.map((item, idx) => (
                        <Tab tab={item}
                             currentTab={this.state.currentTab}
                             idx={idx}
                             key={idx}
                             changeTab={this.changeTab}
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
        id: ''
    }

    componentDidMount() {
        this.setState({
            name: this.props.tab.name,
            route: this.props.tab.route,
            id: this.props.idx
        })
    }

    handleClick = (e) => {
        e.preventDefault()
        this.props.changeTab(e.target.id)
    }

    render() {

        return (
            <a href='#' className={'tab' + (this.props.currentTab == this.state.id + 1 ? ' is-active' : '')}
               onClick={this.handleClick}
               id={this.state.id + 1}
            >{this.state.name}</a>
        )
    }
}

export default LangsLayout;