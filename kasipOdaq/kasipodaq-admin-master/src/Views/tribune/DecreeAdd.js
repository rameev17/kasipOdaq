import React, {Component} from 'react';
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css';
import {inject, observer} from "mobx-react";
import Preloader from "../../fragments/preloader/Preloader";
import {toast, ToastContainer} from "react-toastify";

class DecreeAdd extends Component {

    constructor(props) {
        super(props);

        this.state = {
            preloader: false,
            content: '',
        };

        this.createDecree = this.createDecree.bind(this);
        this.handleChangeContent = this.handleChangeContent.bind(this);
    }

    createDecree() {
        this.setState({preloader: true});

        const revisionId = this.props.match.params.revision_id;

        this.props.tribuneStore.createDecree(
            revisionId,
            this.state.content,

            () => {
                this.setState({preloader: false});
                // this.props.history.push('/tribune');
                this.props.history.goBack();
            }, response => {
                if (response.status == 401) {
                    this.setState({preloader: false});
                    this.props.history.push('/')
                }
            }
        )
    }

    handleChangeContent(text) {
        this.setState({
            content: text
        })
    }

    render() {

        const {revisionName} = this.props.tribuneStore;

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
                                       value={revisionName}
                                       disabled={false}
                                />
                            </label>
                            <label>
                                <span>{this.props.userStore.languageList["Контент"] || 'Контент'}</span>
                                <ReactQuill
                                    value={this.state.content}
                                    onChange={this.handleChangeContent}
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
                            <button className="save" onClick={this.createDecree}>{this.props.userStore.languageList["Сохранить"] || 'Сохранить'}</button>
                        </div>

                    </div>
                </div>

            </div>
        );
    }
}

export default inject('tribuneStore', 'userStore', 'permissionsStore')(observer(DecreeAdd));
