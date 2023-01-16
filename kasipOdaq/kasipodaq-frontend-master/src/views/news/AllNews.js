import React, {Component} from 'react'
import {ModalEnterToUnion} from '../../fragments/modals/Modal';
import "slick-carousel/slick/slick.scss";
import Slider from "react-slick/lib";
import {Link} from 'react-router-dom'
import {Scrollbars} from 'react-custom-scrollbars';

import {ReactComponent as NextIcon} from '../../assets/icons/next.svg';
import {ReactComponent as PrevIcon} from '../../assets/icons/prev.svg';

import { observer, inject } from "mobx-react";
import Preloader from "../../fragments/preloader/Preloader";
import {NotificationContainer, NotificationManager} from 'react-notifications';
import CookieService from "../../services/CookieService";
import TabsLayout from "../../fragments/tabsLayout/TabsLayout";
import Layout from "../../fragments/layout";
import {ReactComponent as SearchLogo} from "../../assets/icons/search-input.svg";

const dateFormat = require('dateformat');


class AllNews extends Component {

    constructor(props) {
        super(props);

        this.state = {
            preloader: true,
            scrollTop: 0,
            scrollHeight: 0,
            clientHeight: 0,
            count: 4,
            tabs: [
                {
                    name: this.props.userStore.languageList["События"] || 'События'
                },
                {
                    name: this.props.userStore.languageList["Все новости"] || 'Все новости'
                }
            ],
        }

        this.searchRef = React.createRef()

        this.prev = this.prev.bind(this)
        this.next = this.next.bind(this)
        this.searchNews = this.searchNews.bind(this)
        this.newsPaginate = this.newsPaginate.bind(this)
        this.changeTabCallback = this.changeTabCallback.bind(this)
    }

    componentDidMount() {
        this.setState({ preloader: true }, () => {
            this.props.newsStore.loadNewsList(this.state.count,null, () => {
                this.setState({ preloader: false })
            }, response => {
                if (Array.isArray(response.data)) {
                    response.data.forEach(error => {
                        this.setState({ preloader: false })
                        NotificationManager.error(error.message)
                    })
                } else {
                    this.setState({ preloader: false })
                    NotificationManager.error(response.data.message)
                }
                if (response.status == 401){
                    CookieService.remove('token')
                    this.setState({ preloader: false })
                    this.props.history.push('/auth')
                }
            })
        })
    }

    prev = () => {
        this.slider.slickPrev();
    }

    next = () => {
        this.slider.slickNext();
    }

    newsPaginate = () => {
        this.setState({
            count: this.state.count + 1
        }, () => {
            this.props.newsStore.loadNewsList(this.state.count,null, () => {
                this.setState({ preloader: false })
            }, response => {
                if (Array.isArray(response.data)) {
                    response.data.forEach(error => {
                        this.setState({ preloader: false })
                        NotificationManager.error(error.message)
                    })
                } else {
                    this.setState({ preloader: false })
                    NotificationManager.error(response.data.message)
                }
                if (response.status == 401){
                    CookieService.remove('token')
                    this.setState({ preloader: false })
                    this.props.history.push('/auth')
                }
            })
        })
    }

    changeTabCallback = (tab) => {
        switch (tab) {
            case '1':
                this.props.history.push({
                    pathname: `/news`,
                    state: { tabId: 1 }
                })
                break;
            case '2':
                this.props.history.push({
                    pathname: `/news/all`,
                    state: { tabId: 2 }
                })
                break;
            default:
                this.props.history.push({
                    pathname: `/news`,
                    state: { tabId: 1 }
                })
        }
    }

    searchNews(){
        if (this.searchRef.current.value.length >= 3){
            this.setState({ preloader: true })
            this.props.newsStore.loadNewsList(
                this.state.count,
                this.searchRef.current.value,
                (data) => {
                    this.props.newsStore.newsList = data
                    this.setState({ preloader: false })
                }, response => {
                    if (Array.isArray(response.data)) {
                        response.data.forEach(error => {
                            this.setState({ preloader: false })
                            NotificationManager.error(error.message)
                        })
                    } else {
                        this.setState({ preloader: false })
                        NotificationManager.error(response.data.message)
                    }
                    if (response.status == 401){
                        CookieService.remove('token')
                        this.setState({ preloader: false })
                        this.props.history.push('/auth')
                    }
                })
        }else{
            this.props.newsStore.loadNewsList(
                this.state.count,
                null,
                data => {

                }, response => {
                    if (Array.isArray(response.data)) {
                        response.data.forEach(error => {
                            this.setState({ preloader: false })
                            NotificationManager.error(error.message)
                        })
                    } else {
                        this.setState({ preloader: false })
                        NotificationManager.error(response.data.message)
                    }
                    if (response.status == 401){
                        CookieService.remove('token')
                        this.setState({ preloader: false })
                        this.props.history.push('/auth')
                    }
                })
        }
    }

    render() {

        const settings = {
            autoplay: true,
            speed: 500,
            variableWidth: true,
            arrows: false,
            infinite: true,
        };

        return (
            <React.Fragment>
                <div className={'news-list'}>
                    {
                        this.state.preloader &&
                        <Preloader/>
                    }

                    <NotificationContainer/>

                    <div className="plate-wrapper">
                        <div className={'input-search'}>
                            <SearchLogo style={{ position: 'absolute', left: 12 }}/>
                            <input type="text"
                                   placeholder={this.props.userStore.languageList["Введите фразу или слово"] || 'Введите фразу или слово'}
                                   ref={this.searchRef}
                                   style={{
                                       width: '100%',
                                       border: '1px solid #E4E8F0',
                                       padding: '9px 48px'
                                   }}
                                   onChange={this.searchNews}
                            />
                        </div>
                        {
                            this.props.userStore.profile.union?.resource_id ?
                                <TabsLayout changeTabCallback={this.changeTabCallback}
                                            tabs={this.state.tabs}
                                            history={this.props.history.location.pathname}
                                >
                                    <div className="main-slider">
                                        <div className="prev-slde" onClick={this.prev}>
                                            <PrevIcon/>
                                        </div>
                                        <Slider {...settings} ref={c => (this.slider = c)}>
                                            {
                                                this.props.newsStore.newsList.map((news, index) => {
                                                    return <Link to={'/news/' + news.resource_id} className="news" key={index}>
                                                        <div className="img">
                                                            <img src={news.picture_uri}/>
                                                        </div>
                                                        <div className="title">
                                                            { news.title.length > 60 ?
                                                                news.title.substring(0, 60) + ' ...'
                                                                :
                                                                news.title
                                                            }
                                                        </div>
                                                        <div className="wrapper">
                                                            <div className="date">{ dateFormat(news.updated_date, 'dd.mm.yyyy') }</div>
                                                            <div className="from">{ news.source }</div>
                                                        </div>
                                                    </Link>
                                                })
                                            }
                                        </Slider>
                                        <div className="next-slde" onClick={this.next}>
                                            <NextIcon/>
                                        </div>
                                    </div>

                                    <Scrollbars style={{width: '100%', minHeight: 320, borderTop: '1px solid #E4E8F0' }}
                                                renderTrackVertical={props => <div {...props} className="track-vertical"/>}
                                                renderThumbVertical={props => <div {...props} className="thumb-vertical"/>}
                                                onUpdate={this.handleUpdate}>
                                        {
                                            this.props.newsStore.newsList.map((news, index) => {
                                                return <div className="last-news" key={index}>
                                                    <Link to={'/news/' + news.resource_id } className="news">
                                                        <div className="new__inner-wrapper">
                                                            <div className="img">
                                                                <img src={ news.picture_uri }/>
                                                            </div>
                                                            <div className="col-right">
                                                                <div className="title">
                                                                    { news.title.length > 120 ?
                                                                        news.title.substring(0, 120) + ' ...'
                                                                        :
                                                                        news.title
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="wrapper">
                                                            <div className="date">{ dateFormat(news.updated_date, 'dd.mm.yyyy') }</div>
                                                            <div className="from">{ news.source }</div>
                                                        </div>
                                                    </Link>
                                                </div>
                                            })
                                        }

                                        <Link to={'#'} onClick={this.newsPaginate} style={{ display: 'flex', justifyContent: 'center', color: '#2E384D' }}>Загрузить еще...</Link>

                                    </Scrollbars>
                                </TabsLayout>
                                :
                                <>
                                    <div className="main-slider">
                                        <div className="prev-slde" onClick={this.prev}>
                                            <PrevIcon/>
                                        </div>
                                        <Slider {...settings} ref={c => (this.slider = c)}>
                                            {
                                                this.props.newsStore.newsList.map((news, index) => {
                                                    return <Link to={'/news/' + news.resource_id} className="news" key={index}>
                                                        <div className="img">
                                                            <img src={news.picture_uri}/>
                                                        </div>
                                                        <div className="title">
                                                            { news.title.length > 60 ?
                                                                news.title.substring(0, 60) + ' ...'
                                                                :
                                                                news.title
                                                            }
                                                        </div>
                                                        <div className="wrapper">
                                                            <div className="date">{ dateFormat(news.updated_date, 'dd.mm.yyyy') }</div>
                                                            <div className="from">{ news.source }</div>
                                                        </div>
                                                    </Link>
                                                })
                                            }
                                        </Slider>
                                        <div className="next-slde" onClick={this.next}>
                                            <NextIcon/>
                                        </div>
                                    </div>

                                    <Scrollbars style={{width: '100%', minHeight: 320, borderTop: '1px solid #E4E8F0' }}
                                                renderTrackVertical={props => <div {...props} className="track-vertical"/>}
                                                renderThumbVertical={props => <div {...props} className="thumb-vertical"/>}
                                                onUpdate={this.handleUpdate}>
                                        {
                                            this.props.newsStore.newsList.map((news, index) => {
                                                return <div className="last-news" key={index}>
                                                    <Link to={'/news/' + news.resource_id } className="news">
                                                        <div className="new__inner-wrapper">
                                                            <div className="img">
                                                                <img src={ news.picture_uri }/>
                                                            </div>
                                                            <div className="col-right">
                                                                <div className="title">
                                                                    { news.title.length > 120 ?
                                                                        news.title.substring(0, 120) + ' ...'
                                                                        :
                                                                        news.title
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="wrapper">
                                                            <div className="date">{ dateFormat(news.updated_date, 'dd.mm.yyyy') }</div>
                                                            <div className="from">{ news.source }</div>
                                                        </div>
                                                    </Link>
                                                </div>
                                            })
                                        }

                                        <Link to={'#'} onClick={this.newsPaginate} style={{ display: 'flex', justifyContent: 'center', color: '#2E384D' }}>Загрузить еще...</Link>

                                    </Scrollbars>
                                </>
                        }
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default inject('newsStore', 'userStore', 'permissionsStore')(observer(AllNews));