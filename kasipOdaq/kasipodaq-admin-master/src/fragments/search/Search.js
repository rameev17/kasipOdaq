import React, {Component} from 'react';
import './index.scss'
import {withRouter} from 'react-router-dom'

import {ReactComponent as SearchIcon} from '../../assets/icons/search.svg';
import {ReactComponent as ArrowIcon} from '../../assets/icons/arrow.svg';
import {NotificationContainer, NotificationManager} from "react-notifications";
import Preloader from "../preloader/Preloader";
import {inject, observer} from "mobx-react";

class Search extends Component {

    constructor(props) {
        super(props);

        this.state = {

        }

        this.searchRef = React.createRef()
    }

    render() {
        return (
            <div className='search'>

                <NotificationContainer/>

                {
                    this.state.preloader &&
                    <Preloader/>
                }

                <label className='search__input'>
                    <div className="icon">
                        <SearchIcon/>
                    </div>
                    <input type="text"
                           placeholder={this.props.userStore.languageList["Поиск"] || 'Поиск'}
                           ref={this.searchRef}
                           onChange={() => this.props.search(this.searchRef.current.value)}
                    />
                </label>


                <div className="paging-wrapper">
                    <div className="pages">
                        <span className="first">{this.props.currentPage}</span>
                        {/*<span className="delimiter">-</span>*/}
                        {/*<span className="last">{ this.props.perPage }</span>*/}
                        <span className="text">-</span>
                        <span className="total">{this.props.pageCount}</span>
                    </div>
                    <div className="arrows">
                        <div className="arrow prev" onClick={this.props.prevPage}>
                            <ArrowIcon />
                        </div>
                        <div className="arrow next" onClick={this.props.nextPage}>
                            <ArrowIcon />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(inject('userStore')(observer(Search)));