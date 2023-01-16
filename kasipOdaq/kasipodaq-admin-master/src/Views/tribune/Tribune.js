import React, {Component} from 'react';
import Layout from "../Containers/Layout";
import {Route, Switch} from "react-router";

import TestList from "./TestList";
import TestCreate from "./TestCreate";
import Test from "./Test";
import TestStatistics from "./TestStatistics";
import PollStatistics from "./PollStatistics";
import './index.scss';
import PollList from "./PollList";
import PollEdit from "./PollEdit";
import PollCreate from "./PollCreate";
import {inject, observer} from "mobx-react";
import OpoList from "./OpoList";
import PpoList from "./PpoList";
import TestEdit from "./TestEdit";
import Poll from "./Poll";
import TestIndividualStatistic from "./TestIndividualStatistic";
import PollIndividualStatistic from "./PollIndividualStatistic";
import DecreeAdd from "./DecreeAdd";
import Decree from "./Decree";
import PpoTest from "./PpoTest";
import PpoPoll from "./PpoPoll";
import TestListUnion from "./TestListUnion";

class Tribune extends Component {

    constructor(props){
        super(props)

        this.state = {

        }
    }

    componentDidMount() {

    }

    render() {
        return (
            <Layout title='Трибуна'>
                <Switch>
                    {/*{*/}
                    {/*    this.props.userStore.role == 'fprk' &&*/}
                    {/*    <Route exact path='/tribune' render={props => ( <OpoList {...props} /> )}/>*/}
                    {/*}*/}
                    {/*{*/}
                    {/*    this.props.userStore.role == 'industry' &&*/}
                    {/*    <Route exact path='/tribune' render={props => ( <PpoList {...props} /> )}/>*/}
                    {/*}*/}
                    {
                        this.props.userStore.role == 'company'

                    }

                    <Route exact path='/tribune' render={props => (<TestList {...props} />)}/>

                    <Route exact path='/tribune/ppo/:id' render={props => ( <PpoTest {...props} /> )}/>
                    <Route exact path='/tribune/ppo/poll/:id' render={props => (<PpoPoll {...props} />)}/>
                    <Route exact path='/tribune/list/:id' render={props => (<TestListUnion {...props} />)}/>
                    <Route exact path='/tribune/poll' render={props => (<PollList {...props} />)}/>
                    <Route exact path='/tribune/poll/list/:id' render={props => (<PollList {...props} />)}/>
                    <Route exact path='/tribune/poll/edit/:id' render={props => (<PollEdit {...props} />)}/>
                    <Route exact path='/tribune/test/edit/:id' render={props => (<TestEdit {...props} />)}/>
                    <Route exact path='/tribune/:id' render={props => (<Test {...props} />)}/>
                    <Route exact path='/tribune/poll/:id' render={props => (<Poll {...props} />)}/>
                    <Route exact path='/tribune/:id/statistics' render={props => (<TestStatistics {...props} />)}/>
                    <Route exact path='/tribune/poll/:id/statistics' render={props => (<PollStatistics {...props} />)}/>
                    <Route exact path='/tribune/statistics/individual/:revision_id' render={props => (<TestIndividualStatistic {...props} />)}/>
                    <Route exact path='/tribune/poll/statistics/individual/:revision_id' render={props => (<PollIndividualStatistic {...props} />)}/>
                    <Route exact path='/tribune/statistics/decree/add/:revision_id' render={props => (<DecreeAdd {...props} />)}/>
                    <Route exact path='/tribune/statistics/decree/:revision_id' render={props => (<Decree {...props} />)}/>
                    <Route exact path='/tribune/add-test/:id' render={props => (<TestCreate {...props} />)}/>
                    <Route exact path='/tribune/add-poll/:id' render={props => (<PollCreate {...props} />)}/>
                </Switch>
            </Layout>
        );
    }
}

export default inject('tribuneStore', 'permissionsStore', 'userStore')(observer(Tribune));
