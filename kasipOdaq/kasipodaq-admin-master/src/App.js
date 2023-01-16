import React from 'react';
import {Provider} from 'mobx-react';
import {Switch, BrowserRouter, Route, Redirect} from 'react-router-dom';
import './Views/globalStyles/index.scss';
import 'react-notifications/lib/notifications.css';

import Auth from "./Views/auth"
import FrontPage from './Views/frontPage'
import Eula from './Views/eula'
import RestorePass from './Views/restorePass'
import Union from './Views/union'
import News from './Views/news'
import Requests from './Views/requests'
import Biot from './Views/biot'
import Dispute from './Views/dispute'
import About from './Views/about'
import LawRequests from './Views/lawRequests'
import Partners from "./Views/partners"
import Options from "./Views/options"
import Support from "./Views/support";
import CreateTicket from "./Views/createTicket";
import NotFound from "./Views/notFound";
import Contacts from './Views/contacts'
import AboutProject from './Views/aboutProject';
import YntymaqRequests from "./Views/appeal/YntymaqRequests";
import LegalFramework from "./Views/legalFramework";
import Tribune from "./Views/tribune";

import unionStore from './stores/UnionStore'
import newsStore from "./stores/NewsStore";
import appealStore from "./stores/AppealStore";
import disputeStore from "./stores/DisputeStore";
import eticketStore from "./stores/eticketStore";
import fileStore from "./stores/FileStore";
import lawStore from "./stores/LawStore";
import pollStore from "./stores/PollStore";
import pollAddStore from "./stores/PollAddStore";
import userStore from "./stores/userStore";
import testAddStore from "./stores/TestAddStore";
import testStore from "./stores/TestStore";
import infoStore from "./stores/InfoStore";
import legalStore from "./stores/LegalStore";
import partnersStore from "./stores/PartnersStore";
import faqStore from "./stores/FaqStore";
import biotStore from "./stores/BiotStore";
import permissionsStore from "./stores/PermissionStore";
import tribuneStore from "./stores/TribuneStore";
import Preloader from "./fragments/preloader/Preloader";
import CookieService from "./services/CookieService";
import UnionRequestsNew from "./Views/requests/UnionRequestsNew";
import SupportRequests from "./Views/support/SupportRequests";

const stores = {
    unionStore,
    newsStore,
    appealStore,
    disputeStore,
    eticketStore,
    fileStore,
    lawStore,
    pollStore,
    pollAddStore,
    userStore,
    testAddStore,
    testStore,
    infoStore,
    legalStore,
    partnersStore,
    faqStore,
    biotStore,
    permissionsStore,
    tribuneStore,

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
            window.location = "/";
        })

        if (CookieService.get('language-admin') !== undefined){
            stores.userStore.getLanguage(CookieService.get('language-admin'))
        }
    }

    renderComponent(use_case, method, component) {
        if (stores.permissionsStore.hasPermission(use_case, method)) {
            return component
        }

        return <Redirect to={"/"} />
    }

    render(){

        return (
            <>
                {
                    this.state.permissionsHadLoaded ?
                        <Provider {...stores}>
                            <BrowserRouter>
                                <Switch>
                                    <Route exact path='/' component={Auth}/>
                                    <Route path='/union' render={
                                        props => this.renderComponent("union", "get_list", <Union {...props}/>)
                                    }/>
                                    <Route path='/news' render={
                                        props => this.renderComponent("order", "get_list", <News {...props}/>)
                                    }/>
                                    <Route path='/requests' render={
                                        props => this.renderComponent("union", "get_union_applications", <Requests {...props}/>)
                                    }/>
                                    <Route path='/create' render={
                                        props => this.renderComponent("union", "get_union_applications", <Requests {...props}/>)
                                    }/>
                                    <Route path='/biot' render={
                                        props => this.renderComponent("order", "get_list", <Biot {...props}/>)
                                    }/>
                                    <Route path='/dispute' render={
                                        props => this.renderComponent("dispute", "get_list", <Dispute {...props}/>)
                                    }/>
                                    <Route path='/about' render={
                                        props => this.renderComponent("article", "create", <About {...props}/>)
                                    }/>
                                    <Route path='/law-requests' render={
                                        props => this.renderComponent("appeal", "get_list", <LawRequests {...props}/>)
                                    }/>
                                    <Route path='/partners' render={
                                        props => this.renderComponent("partner", "get_category_list", <Partners {...props}/>)
                                    }/>
                                    <Route path='/options' render={
                                        props => this.renderComponent("appeal", "get_list", <Options {...props}/>)
                                    }/>
                                    <Route path='/support' render={
                                        props => this.renderComponent("appeal", "get_list", <SupportRequests {...props}/>)
                                    }/>
                                    <Route path='/about-project' render={
                                        props => this.renderComponent("article", "create", <AboutProject {...props}/>)
                                    }/>
                                    <Route path='/contacts' render={
                                        props => this.renderComponent("article", "edit", <Contacts {...props}/>)
                                    }/>
                                    <Route path='/restore-pass' component={RestorePass}/>
                                    <Route path='/appeal' render={
                                        props => this.renderComponent("appeal", "get_list", <YntymaqRequests {...props}/>)
                                    }/>
                                    <Route path='/legals' render={
                                        props => this.renderComponent("legislation", "edit", <LegalFramework {...props}/>)
                                    }/>
                                    <Route path='/tribune' render={
                                        props => this.renderComponent("revision", "get_list", <Tribune {...props}/>)
                                    }/>
                                    <Route render={
                                        props => this.renderComponent("appeal", "get_list", <NotFound {...props}/>)
                                    }/>
                                </Switch>
                            </BrowserRouter>
                        </Provider>
                        :
                        <Preloader/>
                }
            </>

        )
    }
}

export default App;
