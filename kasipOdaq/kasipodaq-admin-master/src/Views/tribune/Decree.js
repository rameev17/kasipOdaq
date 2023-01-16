import React, {Component} from 'react';
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css';
import {inject, observer} from "mobx-react";
import Preloader from "../../fragments/preloader/Preloader";
import {toast, ToastContainer} from "react-toastify";

class Decree extends Component {

    constructor(props) {
        super(props);

        this.state = {
            preloader: false,
            content: '',
        };

    }

    loadPage(){
        this.props.tribuneStore.loadTestSingle(
            this.props.match.params.revision_id,
            () => {

            }
        )
    }

    componentDidMount() {
        this.loadPage()
    }

    render() {

        return (
            <div className='article-edit content'>
                {
                    this.state.preloader &&
                    <Preloader/>
                }
                <ToastContainer/>
                <h1 className="title">
                    <span>{this.props.userStore.languageList["Добавить решение"] || 'Добавить решение'}</span>
                </h1>
                <div className={this.role !== 'rManagerOpo' ? 'panel' : ''}>
                    <div className="container top">
                        <div className="data">
                            <label>
                                <span>{this.props.userStore.languageList["Название"] || 'Название'}</span>
                                <input type="text" name='title'
                                       required
                                       placeholder={this.props.userStore.languageList["Наименование"] || 'Наименование'}
                                       value={this.props.tribuneStore.testSingle.name }
                                       disabled={false}
                                />
                            </label>
                            <label>
                                <span>{this.props.userStore.languageList["Контент"] || 'Контент'}</span>
                                <ReactQuill
                                    value={this.props.tribuneStore.testSingle.decree || ''}
                                    required
                                />
                            </label>
                        </div>
                        <div className="btns">
                            <button className="cancel"
                                    onClick={() => {
                                        this.props.history.goBack()
                                    }}
                            >
                                {this.props.userStore.languageList["Отменить"] || 'Отменить'}
                            </button>
                            {/*<button className="save" onClick={this.createDecree}>Сохранить</button>*/}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default inject('tribuneStore', 'userStore', 'permissionsStore')(observer(Decree));
