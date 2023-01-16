import React, {Component} from 'react'
import Slider from "react-slick/lib";
import Layout from '../../fragments/layout/Layout'
import {Link} from 'react-router-dom'
import {ReactComponent as NextIcon} from "../../assets/icons/next.svg";
import {ReactComponent as PrevIcon} from "../../assets/icons/prev.svg";

import { observer, inject } from "mobx-react";
import Preloader from "../../fragments/preloader/Preloader";
import {NotificationContainer, NotificationManager} from 'react-notifications';
import CookieService from "../../services/CookieService";

const dateFormat = require('dateformat');

class NewsListSingle extends Component {

    state = {
        preloader: false
    }

    prev = () => {
        this.slider.slickPrev();
    }

    next = () => {
        this.slider.slickNext();
    }

    componentDidMount() {
        this.setState({ preloader: true }, () => {
            this.props.newsStore.loadNews(this.props.match.params.id,() => {},
                    response => {
                if (Array.isArray(response.data)) {
                    response.data.forEach(error => {
                        this.setState({ preloader: false })
                        NotificationManager.error(error.message)
                    })
                } else {
                    this.setState({ preloader: false })
                    NotificationManager.error(response.message)
                }
                if (response.status == 401){
                    CookieService.remove('token')
                    this.setState({ preloader: false })
                    this.props.history.push('/auth')
                }
            })
            this.props.newsStore.loadNewsList(10,null, () => {
                this.setState({ preloader: false })
            }, response => {
                if (Array.isArray(response.data)) {
                    response.data.forEach(error => {
                        this.setState({ preloader: false })
                        NotificationManager.error(error.message)
                    })
                } else {
                    this.setState({ preloader: false })
                    NotificationManager.error(response.message)
                }
                if (response.status == 401){
                    CookieService.remove('token')
                    this.setState({ preloader: false })
                    this.props.history.push('/auth')
                }
            })
        })
    }

    render() {
        const settings = {
            autoplay: true,
            variableWidth: true,
            speed: 500,
            arrows: false,
            infinite: true,
        };

        return (

            <React.Fragment>

                {
                    this.state.preloader &&
                        <Preloader/>
                }

                <NotificationContainer/>

                <div className="plate-wrapper">

                    <div style={{ marginBottom: 16 }}>
                        <Link style={{ color: '#0052A4' }} to={'/news'}>Все новости</Link>
                        <span> -> </span>
                        <Link style={{ color: '#0052A4', borderBottom: '1px solid #0052A4' }}>{ this.props.newsStore.news.title }</Link>
                    </div>

                    <div className="news-full">
                        <h1 className="title">{ this.props.newsStore.news.title }</h1>
                        {
                            this.props.newsStore.news.picture_uri ?
                                <div className="text"
                                     dangerouslySetInnerHTML={{__html: `<img src=${this.props.newsStore.news.picture_uri} alt=${this.props.newsStore.news.title}/>${this.props.newsStore.news.content}`}}>
                                </div>
                                :
                                <div className="text"
                                     dangerouslySetInnerHTML={{__html: `${this.props.newsStore.news.content}`}}>
                                </div>
                        }
                    </div>

                    <p className="subtitle">{this.props.userStore.languageList["Читайте также"] || 'Читайте также'}</p>
                    <div className="read-more">
                        <div className="prev-slde" onClick={this.prev}>
                            <PrevIcon/>
                        </div>
                        <Slider {...settings} ref={c => (this.slider = c)}>
                            {
                                this.props.newsStore.newsList.map((news, index) => {
                                    return <a href={'/news/' + news.resource_id } key={index}
                                                 className="news news-additional">
                                        <div className="img">
                                            <img src={ news.picture_uri }/>
                                        </div>
                                        <div className="text-wrapper">
                                            <div className="title">
                                                { news.title.length > 60 ?
                                                    news.title.substring(0, 60) + ' ...'
                                                    :
                                                    news.title
                                                }
                                            </div>
                                            <div className="time-wrapper">
                                                <div className="date">{ dateFormat(news.updated_date, 'dd.mm.yyyy') }</div>
                                                <div className="from">{ news.source }</div>
                                            </div>
                                        </div>
                                    </a>
                                })
                            }
                        </Slider>
                        <div className="next-slde" onClick={this.next}>
                            <NextIcon/>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default inject('newsStore', 'userStore', 'permissionsStore')(observer(NewsListSingle));