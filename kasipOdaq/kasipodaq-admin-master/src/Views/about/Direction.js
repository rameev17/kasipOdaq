import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import Search from "../../fragments/search";

class Direction extends Component {

    state = {
        management: []
    }

    loadPage = (page,query) => {

        if(page !== this.state.currentPage){
            if(page > 1){
                this.props.history.push(`/about/direction/#page-${page}`)
            }else{
                this.props.history.push(`/about/direction`)
            }
        }
    }

    render() {

        return (
            <div className='content about-us-direction'>
                <div className="title-wrapper">
                    <h1 className="title">Руководство</h1>
                    <Link to='/about/direction/add'>Добавить</Link>
                </div>
                <div className="panel">
                    <Search
                            pagingCallback={this.loadPage}
                            searchCallback={this.searchSubject}
                            showSearchString={false}/>
                    <ul className="direction-list__wrapper">
                        <li key={1}>
                            <div className={"col-left default"}>
                                {/*{item.photo_url &&*/}
                                {/*<img src={ item.photo_url['128x128'] }/>*/}
                                {/*}*/}
                            </div>
                            <div className="col-right">
                                <div className="full-name">
                                    <span>first_name</span>

                                    <span>item.last_name</span>

                                    <span>item.middle_name</span>

                                </div>
                                <div className="position">item.post</div>
                                <div className="birthday">Родился item.birthday</div>
                                <div className="links">
                                    <Link to={`/about/direction/person/1`}>Редактировать</Link>
                                    <span className='delete'>Удалить</span>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
}

export default Direction;