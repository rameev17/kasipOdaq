import React, {Component} from 'react';
import {Link} from "react-router-dom";

class DisputeEvents extends Component{

    state = {
        categories: [],
        role: ''
    }

    constructor(props){
        super(props)
    }

    render() {

        return(
            <React.Fragment>
                <div className="content">
                   <h1 className="title">Трудовой спор</h1>
                    <div className={(this.state.role !== 'rManagerPpo' ? 'panel' : '')}>
                        <ul className="direction-list">
                            <li>

                                <Link to={`/dispute/ppo/1/direction/1`}>title</Link>

                                <Link to={`/dispute/ppo/1/direction/1`}>title</Link>

                            </li>
                        </ul>
                    </div>
                </div>
            </React.Fragment>

        )
    }

}

export default DisputeEvents;