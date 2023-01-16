import React, {Component} from 'react';
import {Link} from "react-router-dom";
import {ReactComponent as EditIcon} from "../../assets/icons/edit.svg";
import {ReactComponent as DownloadIcon} from "../../assets/icons/download.svg";
import {ReactComponent as RemoveIcon} from "../../assets/icons/delete.svg";
import {ReactComponent as AppendIcon} from "../../assets/icons/clip.svg";
import AddDocument from './AddDocument'

const ARTICLE_ID = 283

class Activity extends Component{

    state={
        attachments: []
    }

    render() {
        return (
            <div className='content'>
                <h1>Деятельность</h1>
                <div className="panel">
                    <AddDocument/>
                    <div className="activity">

                                    <div className="document">
                                        <span>
                                            doc name
                                        </span>
                                        <div className="icons__wrapper">
                                            <div className="icon download">
                                                <a href='#'><DownloadIcon/></a>
                                            </div>
                                            <div className="icon remove" >
                                                <RemoveIcon/>
                                            </div>
                                            <div className="icon append">
                                                <AppendIcon/>
                                            </div>
                                        </div>
                                    </div>

                        {/* <div className="document">
                            <span>
                                Социальное партнерство
                            </span>
                            <div className="icons__wrapper">
                                <div className="icon download">
                                    <DownloadIcon/>
                                </div>
                                <div className="icon remove"
                                     onClick={() => this.handleRemoveFile('agreement')}>
                                    <RemoveIcon/>
                                </div>
                                <div className="icon append"
                                     onClick={() => this.handleSetFile('agreement')}>
                                    <AppendIcon/>
                                </div>
                            </div>
                        </div>

                        <div className="document">
                            <span>
                                Гендерная политика
                            </span>
                            <div className="icons__wrapper">
                                <div className="icon download">
                                    <DownloadIcon/>
                                </div>
                                <div className="icon remove"
                                     onClick={() => this.handleRemoveFile('agreement')}>
                                    <RemoveIcon/>
                                </div>
                                <div className="icon append"
                                     onClick={() => this.handleSetFile('agreement')}>
                                    <AppendIcon/>
                                </div>
                            </div>
                        </div>

                        <div className="document">
                            <span>
                                Молодежная политика
                            </span>
                            <div className="icons__wrapper">
                                <div className="icon download">
                                    <DownloadIcon/>
                                </div>
                                <div className="icon remove"
                                     onClick={() => this.handleRemoveFile('agreement')}>
                                    <RemoveIcon/>
                                </div>
                                <div className="icon append"
                                     onClick={() => this.handleSetFile('agreement')}>
                                    <AppendIcon/>
                                </div>
                            </div>
                        </div>

                        <div className="document">
                            <span>
                                Международная работа
                            </span>
                            <div className="icons__wrapper">
                                <div className="icon download">
                                    <DownloadIcon/>
                                </div>
                                <div className="icon remove"
                                     onClick={() => this.handleRemoveFile('agreement')}>
                                    <RemoveIcon/>
                                </div>
                                <div className="icon append"
                                     onClick={() => this.handleSetFile('agreement')}>
                                    <AppendIcon/>
                                </div>
                            </div>
                        </div>

                        <div className="document">
                            <span>
                                Коллективный договор
                            </span>
                            <div className="icons__wrapper">
                                <div className="icon download">
                                    <DownloadIcon/>
                                </div>
                                <div className="icon remove"
                                     onClick={() => this.handleRemoveFile('agreement')}>
                                    <RemoveIcon/>
                                </div>
                                <div className="icon append"
                                     onClick={() => this.handleSetFile('agreement')}>
                                    <AppendIcon/>
                                </div>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
        )
    }
}

export default Activity;