import React, {Component} from 'react';
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import Search from "../../fragments/search";
import {withRouter} from 'react-router-dom'
import {ReactComponent as FolderIcon} from "../../assets/icons/folder.svg";

class PpoList extends Component {

    state = {
        ppoList: [],
        perPage: 10
    }

    render() {
        return (
            <div className='ppos-list'>
                <Search totalCount={this.state.totalCount}
                        currentPage={this.state.currentPage}
                        pageCount={this.state.pageCount}
                        perPage={this.state.perPage}
                        pagingCallback={this.loadPage}
                        searchCallback={this.searchPpo}/>

                <ul className="list__wrapper">
                    <li >
                        <Link to={`/news/opo/1/events/ppo/1`}>
                            <div className="icon">
                                <FolderIcon/>
                            </div>
                            name
                        </Link>
                    </li>
                </ul>
            </div>
        );
    }
}


export default withRouter(PpoList);