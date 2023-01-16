import React, {Component} from 'react';
import ReactQuill from "react-quill";
import {ReactComponent as EditIcon} from "../../assets/icons/edit.svg";
import ApiService from "../../services/ApiService";
import {inject, observer} from "mobx-react";

class Regulations extends Component {
    constructor(props) {
        super(props);

        this.state = {
            preloader: false,
        }

        this.saveEditInfo = this.saveEditInfo.bind(this)
    }

    componentDidMount() {
        // this.props.infoStore.loadRegulation()
    }

    saveEditInfo(){
        this.props.infoStore.updateRegulation(
            () => {
                this.setState({ preloader: false })
                this.props.infoStore.loadRegulation()
            }
        )
    }

    render() {
        return (
            <div className='regulations content'>
                <h1 className="title">Устав ФПРК</h1>
                <div className="panel">

                        <div className='charter__wrapper'>
                            <div className="title-wrapper">
                                <div className='line'/>
                                {/*<button onClick={this.editInfo}>*/}
                                {/*    <div className="btn-action">*/}
                                {/*        <div className="icon">*/}
                                {/*            <EditIcon/>*/}
                                {/*        </div>*/}
                                {/*        <span>Редактировать</span>*/}
                                {/*    </div>*/}
                                {/*</button>*/}
                            </div>
                            <div className='info' dangerouslySetInnerHTML={{__html: this.props.infoStore.RegulationsDescription}}>
                            </div>
                        </div>

                        <div className='info-edit'>
                            <div className="toggle-lang">
                                {/*<div className="lang ru">Информация на русском языке</div>*/}
                                {/*<div className="lang kz">Информация на казахском языке</div>*/}
                            </div>
                            <div className="data">
                                <label>
                                    <span>Описание</span>
                                    <ReactQuill
                                        value={this.props.infoStore.RegulationsDescription}
                                        onChange={(text) => { this.props.infoStore.RegulationsDescription = text }}
                                    />
                                </label>
                            </div>
                            <div className="btns">
                                {/*<button className="cancel" onClick={this.editInfo}>Отменить</button>*/}
                                <button className="save" onClick={this.saveEditInfo}>Сохранить</button>
                            </div>
                        </div>

                </div>
            </div>
        );
    }
}

export default inject('infoStore')(observer(Regulations));