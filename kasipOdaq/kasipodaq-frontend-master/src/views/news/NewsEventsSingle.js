import React, {Component} from 'react'
import Slider from "react-slick/lib";
import Layout from '../../fragments/layout/Layout'
import {Link} from 'react-router-dom'
import {ReactComponent as NextIcon} from "../../assets/icons/next.svg";
import {ReactComponent as PrevIcon} from "../../assets/icons/prev.svg";

class NewsEventsSingle extends Component {

    state = {
        id: '',
        img: '',
        title: '',
        date: '',
        from: '',
        text: '',
        readMore: []
    }


    componentDidMount() {
        this.props.history.push({
            state: {
                tabId: 2
            }
        })
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
            variableWidth: true,
            speed: 500,
            arrows:false
        };

        return (

            <React.Fragment>
                <div className="plate-wrapper">
                    <div className="news-full">
                        <h1 className="title">title</h1>
                        {/*<div className="text"*/}
                        {/*     dangerouslySetInnerHTML={{__html: `<img src=${this.state.img} alt=${this.state.title}/>${this.state.text}`}}>*/}
                        {/*</div>*/}
                    </div>
                </div>
                <div className="plate-wrapper">
                    <p className="subtitle">Читайте также</p>
                    <div className="read-more">
                        <div className="prev-slde" onClick={this.prev}>
                            <PrevIcon/>
                        </div>
                        <Slider {...settings} ref={c => (this.slider = c)}>
                            <Link to={'/news-events/1'}
                                  className="news news-additional">
                                <div className="img">

                                    <img src='download' alt='title'/>
                               
                                </div>
                                <div className="text-wrapper">
                                    <div className="title">title</div>
                                    <div className="time-wrapper">
                                        <div className="date">DD.MM.YYYY</div>
                                        <div className="from">source</div>
                                    </div>
                                </div>
                            </Link>
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

export default NewsEventsSingle