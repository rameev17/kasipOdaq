import React from 'react'
import { Link } from 'react-router-dom'

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
                <div className="steps content steps__margin">
                    {this.props.children}
                    <div className="paging">
                        {this.state.steps.map((item,idx) => (
                            <div className={"step" + (this.props.currentStep == idx + 1 ? ' is-active' : '') + (this.props.currentStep > idx + 1 ? ' completed' : '')}
                                 key={idx + 1}>{idx + 1}
                            </div>
                        ))}
                    </div>
                </div>
                {/*<div className="eula">*/}
                {/*    <Link to="/eula">*/}
                {/*        Пользовательское соглашение*/}
                {/*    </Link>*/}
                {/*</div>*/}
            </React.Fragment>
        )
    }
}

export default StepsLayout