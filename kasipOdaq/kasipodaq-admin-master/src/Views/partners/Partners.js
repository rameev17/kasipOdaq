import React, {Component} from 'react';
import Layout from "../Containers/Layout";
import {Switch,Route} from 'react-router'
import CategoriesList from './CategoriesList'
import Category from './Category'
import PartnerAdd from './PartnerAdd'
import Partner from './Partner'
import PartnerEdit from './PartnerEdit'
import './index.scss'

class Partners extends Component {
    render() {
        return (
            <Layout title='Партнеры'>
                <div className="content">
                    <Switch>
                        <Route exact path='/partners'
                                render={props => (<CategoriesList {...props}/>)}/>
                        <Route exact path='/partners/category/:id(\d+)'
                               render={props => (<Category {...props}/>)}/>
                        <Route path='/partners/:id(\d+)/add'
                               render={props => (<PartnerAdd {...props}/>)}/>
                        <Route exact path='/partners/:id(\d+)'
                               render={props => (<Partner {...props}/>)}/>
                        <Route exact path='/partners/:id(\d+)/edit'
                               render={props => (<PartnerEdit {...props}/>)}/>
                    </Switch>
                </div>
            </Layout>
        );
    }
}

export default Partners;