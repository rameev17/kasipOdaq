import React from 'react'
import { Link } from 'react-router-dom';
import {ReactComponent as CheckedIcon} from '../../assets/icons/checked.svg'

class StepsLayout extends React.Component{

    state = {
        steps: []
    }

    componentDidMount() {
        this.setState({steps: Array.from(Array(this.props.paging).keys())})
    }

    render(){

        return(
            <React.Fragment>
                <div className="steps">
                    {this.props.children}
                </div>
                <div className="paging">
                    {this.state.steps.map((item,idx) => (
                        <div className={"step" + (this.props.currentStep == idx + 1 ? ' is-active' : '') + (this.props.currentStep > idx + 1 ? ' completed' : '')}
                             key={idx + 1}>{idx + 1}
                        </div>
                    ))}
                </div>
            </React.Fragment>
        )
    }
}

export default StepsLayout