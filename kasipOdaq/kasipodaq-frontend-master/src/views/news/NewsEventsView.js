import React, {Component} from 'react'
import { ModalEnterToUnion } from '../../fragments/modals/Modal';
import Slider from "react-slick/lib";
import {Link} from 'react-router-dom'
// import "slick-carousel/slick/slick.scss";
import { Scrollbars } from 'react-custom-scrollbars';

import {ReactComponent as NextIcon} from '../../assets/icons/next.svg'
import {ReactComponent as PrevIcon} from '../../assets/icons/prev.svg'


class NewsEvents extends Component {

    state = {
        newsMain: [],
        newsLast: [],
        eventsHeaders: {},
        scrollTop: 0,
        scrollHeight: 0,
        clientHeight: 0
    }

    prev = () => {
        this.slider.slickPrev();
    }

    next = () => {
        this.slider.slickNext();
    }

    render() {

        const settings = {
            autoplay:true,
            speed: 500,
            variableWidth: true,
            arrows:false,
            infinite: true,
        };

        return (
            <React.Fragment>
                <div className="plate-wrapper">
                    <div className="main-slider">
                        <div className="prev-slde" onClick={this.prev}>
                            <PrevIcon/>
                        </div>
                        <Slider {...settings} ref={c => (this.slider = c)}>
                            <Link to={'/news-events/1'} className="news">
                                <div className="img">

                                    <img src='download' alt='title'/>

                                </div>
                                <div className="title">title</div>
                                <div className="wrapper">
                                    <div className="date">DD.MM.YYYY</div>
                                    <div className="from">source</div>
                                </div>
                            </Link>
                        </Slider>
                        <div className="next-slde" onClick={this.next}>
                            <NextIcon/>
                        </div>
                    </div>
                </div>
                <div className="plate-wrapper">

                    <Scrollbars style={{ width: '100%', minHeight: 320}}
                                renderTrackVertical={props => <div {...props} className="track-vertical"/>}
                                renderThumbVertical={props => <div {...props} className="thumb-vertical"/>}
                                onUpdate={this.handleUpdate}>
                        <div className="last-news">
                            <Link to={'/news-events/1' } className="news">
                                <div className="new__inner-wrapper">
                                    <div className="img">

                                        <img src='download' />

                                    </div>
                                    <div className="col-right">
                                        <div className="title">title</div>
                                        <div className="wrapper">
                                            <div className="date">DD.MM.YYYY</div>
                                            <div className="from">source</div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </Scrollbars>
                </div>
            </React.Fragment>
        )
    }
}

export default NewsEvents