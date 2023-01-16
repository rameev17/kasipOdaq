import React, {Component} from 'react';
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import Search from '../../fragments/search'

import {ReactComponent as FolderIcon} from '../../assets/icons/folder.svg'
import {inject, observer} from "mobx-react";
import Preloader from "../../fragments/preloader/Preloader";
import {NotificationContainer, NotificationManager} from "react-notifications";
import CookieService from "../../services/CookieService";

class FprkOpoList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            preloader: true,
        };

        this.loadPage = this.loadPage.bind(this);
        this.prevPage = this.prevPage.bind(this);
        this.nextPage = this.nextPage.bind(this);
        this.searchIndustries = this.searchIndustries.bind(this)
    }

    loadPage(){

        this.props.unionStore.loadIndustries(null,() => {
            this.setState({ preloader: false })
        }, response => {
            if (Array.isArray(response.data)) {
                response.data.forEach(error => {
                    this.setState({ preloader: false });
                    NotificationManager.error(error.message)
                })
            } else {
                this.setState({ preloader: false });
                NotificationManager.error(response.data.message)
            }
            if (response.status == 401){
                CookieService.remove('token-admin');
                this.setState({ preloader: false });
                this.props.history.push('/')
            }
        });

        this.setState({ preloader: false })
    }

    componentDidMount(){
        this.loadPage()
    }

    searchIndustries(search){
        if (search.length > 2){
            this.setState({ preloader: true });
            this.props.unionStore.loadIndustries(search, () => {
                this.setState({ preloader: false })
            }, response => {
                if (Array.isArray(response.data)) {
                    response.data.forEach(error => {
                        this.setState({ preloader: false });
                        NotificationManager.error(error.message)
                    })
                } else {
                    this.setState({ preloader: false });
                    NotificationManager.error(response.data.message)
                }
                if (response.status == 401){
                    this.setState({ preloader: false });
                    this.props.history.push('/')
                }
            });
            this.setState({ preloader: false })
        }else{
            this.loadPage()
        }
    }

    prevPage(){
        this.setState({ preloader: true });
        if (this.props.unionStore.pageNumberIndustries > 1){
            this.props.unionStore.pageNumberIndustries = this.props.unionStore.pageNumberIndustries - 1;
            this.loadPage()
        }else{
            this.setState({ preloader: false })
        }
    }

    nextPage(){
        this.setState({ preloader: true });
        if (this.props.unionStore.pageNumberIndustries < this.props.unionStore.pageCountIndustries){
            this.props.unionStore.pageNumberIndustries = this.props.unionStore.pageNumberIndustries + 1;
            this.loadPage()
        }else{
            this.setState({ preloader: false })
        }
    }

    render() {

        return (

            <div>

                <div className="title-wrapper" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    {/*<h1>Отраслевые объединения</h1>*/}
                    {/*<Link to={`/union/opo/add`}>Добавить отрасль</Link>*/}
                    <Link to={`/union/reports`} style={{ border: '1px solid #002F6C', color: '#002F6C', backgroundColor: 'transparent' }}>{this.props.userStore.languageList['Отчеты'] || 'Отчеты'}</Link>
                    {/*<Link to={`/union/reports/create`} style={{ border: '1px solid #002F6C', color: '#002F6C', backgroundColor: 'transparent' }}>Добавить отчет</Link>*/}
                </div>

                <div className='opo-list'>

                    {
                        this.state.preloader &&
                        <Preloader/>
                    }

                    <NotificationContainer/>

                    <Search
                        currentPage={this.props.unionStore.currentPageIndustries}
                        pageCount={this.props.unionStore.pageCountIndustries}
                        prevPage={this.prevPage}
                        nextPage={this.nextPage}
                        search={this.searchIndustries}
                    />
                    <ul className="list__wrapper">
                        {
                            this.props.unionStore.industriesList.map((industry, index) => {
                                return <li key={index}>
                                    <Link to={`/union/opo/` + industry.resource_id }>
                                        <div className="icon">
                                            <FolderIcon/>
                                        </div>
                                        { this.props.userStore.languageList[industry.name] || industry.name } ({industry.member_count})
                                    </Link>
                                </li>
                            })
                        }
                    </ul>
                </div>

            </div>
        );
    }
}

export default inject('unionStore', 'userStore', 'permissionsStore')(observer(FprkOpoList));