import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {ReactComponent as ArrowLeft} from '../../../assets/icons/arrow.svg'
import './index.scss'

class BreadCrumbs extends Component{

    state = {
        breadCrumbs: this.props.breadCrumbs,
        margin:this.props.margin__left
    }

    render() {
        return(
            <div className={'bread-crumbs' + (this.state.margin ? ' bread-crumbs__ml' : '')}>
                {
                    this.state.breadCrumbs
                        .map( item => <Link to={item.link}>{item.label}</Link>)
                        .reduce((prev, curr) => [prev, <ArrowLeft/>, curr])
                }
            </div>
        )
    }
}

export default BreadCrumbs;