import React from 'react';
import logo from './logo.svg';
import './App.css';
import './views/GlobalStyles/index.scss';
import { Provider } from "mobx-react";
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import AboutUs from "./views/aboutUs/AboutUsView";
import Auth from "./views/auth/AuthView";
import Biot from "./views/biot/BiotView";
import CabinetMember from "./views/cabinetMember/CabinetMemberView";
import Contacts from "./views/contacts/ContactsView";
import CreateTicket from "./views/createTIcket/CreateTicketView";
import Eula from "./views/eula/EulaView";
import FprkDivisions from "./views/fprkDivision/FprkDivisionView";
import FrontPage from "./views/frontPage/FrontView";
import Help from "./views/help/helpView";
import LawDatabase from "./views/lawDatabase/LawDatabaseView";
import MyEpb from "./views/myEpb/MyEpbView";
import MyUnion from "./views/myUnion/MyUnionView";
import NotFound from "./views/notFound/NotFound";
import Partners from "./views/partners/PartnersView";
import Preferences from "./views/preferences/PreferencesView";
import RequestToFprk from "./views/requestToFprk/RequestToFprkView";
import RestorePass from "./views/restorePass/RestorePassView";
import Support from "./views/support/SupportView";
import Tribune from "./views/tribune/TribuneView";
import UnionCreate from "./views/unionCreate/UnionCreateView";
import UnionJoin from "./views/unionJoin/UnionJoinView";
import WorkerDispute from "./views/workerDispute/WorkerDisputeView";
import News from "./views/news/NewsView";

import unionStore from './stores/UnionStore'
import newsStore from "./stores/NewsStore";
import appealStore from "./stores/AppealStore";
import disputeStore from "./stores/DisputeStore";
import fileStore from "./stores/FileStore";
import lawStore from "./stores/LawStore";
import pollStore from "./stores/PollStore";
import userStore from "./stores/UserStore";
import testStore from "./stores/TestStore";
import infoStore from "./stores/InfoStore";
import legalStore from "./stores/LegalStore";
import partnersStore from "./stores/PartnersStore";
import faqStore from "./stores/FaqStore";
import biotStore from "./stores/BiotStore";
import permissionsStore from "./stores/PermissionsStore";
import tribuneStore from "./stores/tribuneStore";
import notificationStore from "./stores/NotificationStore";
import Register from "./views/register/Register";
import Notifications from "./views/notifications/notifications";
import 'react-notifications/lib/notifications.css';
import CookieService from "./services/CookieService";
import {toast} from "react-toastify";
import PlaceList from "./views/unionCreate/PlaceList";
import UnionList from "./views/unionCreate/UnionList";
import IndustryList from "./views/unionCreate/IndustryList";
import IndustryListJoin from "./views/unionJoin/IndustryList";
import UnionListJoin from "./views/unionJoin/UnionList";
import PlaceListJoin from "./views/unionJoin/PlaceList";
import AllNews from "./views/news/AllNews";
import {loadReCaptcha} from "react-recaptcha-v3";

const stores = {
    unionStore,
    newsStore,
    appealStore,
    disputeStore,
    fileStore,
    lawStore,
    pollStore,
    userStore,
    testStore,
    infoStore,
    legalStore,
    partnersStore,
    faqStore,
    biotStore,
    permissionsStore,
    tribuneStore,
    notificationStore,

};


class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            permissionsHadLoaded: false
        }

    }

    componentDidMount() {
        stores.permissionsStore.loadPermissions(response => {
            this.setState({
                permissionsHadLoaded: true
            })
        }, response => {
            window.location = "/auth";
        })
        if (CookieService.get('language') !== undefined) {
            stores.userStore.getLanguage(CookieService.get('language'))
        }
        loadReCaptcha('6LePrcEZAAAAALsgoRcFIYjJYMbfQSeflyjP6Bam', () => {});
    }

    renderComponent(use_case, method, component) {
        if (stores.permissionsStore.hasPermission(use_case, method)) {
            return component
        }

        return <Redirect to={"/"} />
    }

    render() {
        return (

            <>
                {
                    this.state.permissionsHadLoaded &&
                    <Provider {...stores}>
                        <BrowserRouter>
                            <Switch>
                                <Route exact path='/' component={FrontPage}/>
                                <Route path='/auth' component={Auth}/>
                                <Route exact path='/news' render={props => (<News {...props}/>)}/>
                                <Route exact path='/news/:id' render={props => (<News {...props}/>)}/>
                                <Route exact path='/news-events' render={props => (<News {...props}/>)}/>
                                <Route exact path='/news-events/:id' render={props => (<News {...props}/>)}/>
                                <Route exact path='/news/all/:id' render={props => (<AllNews {...props}/>)}/>

                                <Route exact path='/enter-to-union' render={
                                    props => this.renderComponent("union", "join", <UnionJoin {...props}/>)
                                }/>
                                <Route exact path='/enter-to-union/places' render={
                                    props => this.renderComponent("union", "create", <PlaceListJoin {...props}/>)
                                }/>
                                <Route exact path='/enter-to-union/unions' render={
                                    props => this.renderComponent("union", "create", <UnionListJoin {...props}/>)
                                }/>
                                <Route exact path='/enter-to-union/industries' render={
                                    props => this.renderComponent("union", "create", <IndustryListJoin {...props}/>)
                                }/>
                                <Route exact path='/create-union' render={
                                    props => this.renderComponent("union", "create", <UnionCreate {...props}/>)
                                }/>
                                <Route exact path='/create-union/places' render={
                                    props => this.renderComponent("union", "create", <PlaceList {...props}/>)
                                }/>
                                <Route exact path='/create-union/unions' render={
                                    props => this.renderComponent("union", "create", <UnionList {...props}/>)
                                }/>
                                <Route exact path='/create-union/industries' render={
                                    props => this.renderComponent("union", "create", <IndustryList {...props}/>)
                                }/>
                                <Route path='/register' render={props => {return <Register {...props}/>}}/>
                                <Route exact path='/eula' component={Eula}/>
                                <Route path='/cabinet' render={
                                    props => this.renderComponent("user", "get_person", <CabinetMember {...props}/>)
                                }/>
                                <Route path='/notifications' render={props => {return <Notifications {...props}/>}}/>
                                <Route exact path='/preferences/support' render={
                                    props => this.renderComponent("user", "get_person", <Support {...props}/>)
                                }/>
                                <Route exact path='/preferences/support/create-ticket' render={props => {
                                    return <CreateTicket {...props} type={4}/>
                                }}/>
                                <Route  path='/preferences/restore-pass' component={RestorePass}/>
                                <Route path='/preferences' component={Preferences}/>
                                <Route exact path='/request-to-fprk/create-ticket' render={props => {
                                    return <CreateTicket {...props} type={0}/>
                                }}/>
                                <Route path='/request-to-fprk' render={
                                    props => this.renderComponent("appeal", "get_list", <RequestToFprk {...props}/>)
                                }/>
                                <Route exact path='/request-to-fprk/faq' component={RequestToFprk} />

                                <Route path='/tribune' render={
                                    props => this.renderComponent("revision", "get_list", <Tribune {...props}/>)
                                }/>
                                <Route path='/law-database' component={LawDatabase}/>
                                <Route path='/biot' render={
                                    props => this.renderComponent("order", "get_list", <Biot {...props}/>)
                                }/>
                                <Route path='/dispute' render={
                                    props => this.renderComponent("dispute", "get_list", <WorkerDispute {...props}/>)
                                }/>
                                {/*<Route path='/epb' render={*/}
                                {/*    props => this.renderComponent("user", "get_person", <MyEpb {...props}/>)*/}
                                {/*}/>*/}
                                <Route path='/epb' component={MyEpb}/>
                                <Route path='/about-us' render={
                                    props => this.renderComponent("article", "get_by_union_id", <AboutUs {...props}/>)
                                }/>
                                <Route path='/fprk-divisions' component={FprkDivisions}/>
                                <Route path='/contacts' render={
                                    props => this.renderComponent("article", "get_by_union_id", <Contacts {...props}/>)
                                }/>
                                <Route path='/partners' component={Partners}/>
                                <Route path='/my-union' component={MyUnion}/>
                                <Route exact path='/help/create-ticket' render={
                                    props => { return <CreateTicket {...props} type={3}/> }
                                }/>
                                <Route path='/help' render={
                                    props => this.renderComponent("appeal", "get_list", <Help {...props}/>)
                                }/>
                                <Route exact path='/help/faq' component={Help}/>

                                <Route component={NotFound}/>
                            </Switch>
                        </BrowserRouter>
                    </Provider>
                }
            </>
    )
  }
}

export default App;
