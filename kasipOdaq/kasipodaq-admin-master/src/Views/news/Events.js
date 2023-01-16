import React, {Component} from 'react';
import {Link, Route, Switch} from "react-router-dom";
import EventsList from "./EventsList";
import EventEdit from "./EventEdit";
import EventAdd from "./EventAdd";

class Events extends Component {

    render() {
        return (
            <Switch>
                <Route exact path='/news/ppo/:id' render={props => (<EventsList {...props} id={this.props.id} title='События'/>)}/>
                <Route exact path='/news/opo/:id/events/ppo/:id' render={props => (<EventsList {...props} id={this.props.id}/>)}/>
                <Route exact path='/news/ppo/:ppo/article/:id/edit' render={props => (<EventEdit {...props} id={this.props.id}/>)}/>
                <Route exact path='/news/ppo/:id/article/add' render={props => (<EventAdd {...props} id={this.props.id}/>)}/>
            </Switch>
        );
    }
}

export default Events;