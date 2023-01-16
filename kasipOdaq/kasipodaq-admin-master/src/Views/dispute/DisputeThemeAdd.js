import React, {Component} from 'react';
import {Link} from "react-router-dom";
import ReactQuill from "react-quill";
import {inject, observer} from "mobx-react";
import Preloader from "../../fragments/preloader/Preloader";
import {NotificationContainer, NotificationManager} from "react-notifications";
import CookieService from "../../services/CookieService";

class DisputeThemeAdd extends Component {
    constructor(props){
        super(props);

        this.state = {
            preloader: false,
            lang: CookieService.get('language-admin'),
            status: false,
            subjectRu: '',
            contentRu: '',
            answerRu: '',
            subjectKk: '',
            contentKk: '',
            answerKk: ''
        };

        this.subjectRef = React.createRef();
        this.subjectKkRef = React.createRef();
        this.contentRef = React.createRef();
        this.resolvedRef = React.createRef();
        this.categoryId = React.createRef();

        this.createDispute = this.createDispute.bind(this);
        this.statusChange = this.statusChange.bind(this)
    }

    componentDidMount() {
        this.props.disputeStore.loadCategoryDispute(() => {

        },response => {
            if (Array.isArray(response.data)) {
                response.data.forEach(error => {
                    this.setState({ preloader: false });
                    NotificationManager.error(error.message)
                })
            } else {
                this.setState({ preloader: false });
                NotificationManager.error(response.data.message)
            }
            if (response.status == 401){
                this.setState({ preloader: false });
                this.props.history.push('/')
            }
        })
    }

    statusChange(){
        this.setState({
            status: !this.state.status
        })
    }

    createDispute(){
        let status = this.state.status ? 1 : 0;

        if(this.state.subjectRu == '') {
            NotificationManager.error('Заполните поле "Тема"')
        }else if( this.state.content == '') {
            NotificationManager.error('Заполните поле "Описание" ')
        }else if (this.state.status && this.state.answerRu == ''){
            NotificationManager.error('Заполните поле "Решение')
        }else if (this.state.answerRu.length > 11 && !this.state.status) {
            NotificationManager.error('Поставьте пожалуйста галочку "Решено"')
        }else{

            this.setState({ preloader:true });

            this.props.disputeStore.createDispute(
                this.props.match.params.id,
                this.categoryId.current.value,
                this.state.subjectRu,
                this.state.subjectKk,
                this.state.contentRu,
                this.state.contentKk,
                this.state.answerRu,
                this.state.answerKk,
                status,
                () => {
                    this.setState({ preloader: false });
                    NotificationManager.success('Спор успешно добавлен');
                    this.props.history.push(`/dispute/list/${this.props.match.params.id}?category_id=${this.categoryId.current.value}`)
                }, response => {
                    if (Array.isArray(response.data)) {
                        response.data.forEach(error => {
                            this.setState({ preloader: false });
                            NotificationManager.error(error.message)
                        })
                    } else {
                        this.setState({ preloader: false });
                        NotificationManager.error(response.data.message)
                    }
                    if (response.status == 401){
                        this.setState({ preloader: false });
                        this.props.history.push('/')
                    }
                }
            )

        }


    }

    render() {

        return (
            <div className='dispute-theme content'>

                {
                    this.state.preloader &&
                        <Preloader/>
                }

                <NotificationContainer/>

                <div className="title-wrapper">
                    <h1 className="title">{this.props.userStore.languageList["Трудовой спор"] || 'Трудовой спор'}</h1>
                </div>
                <div className="panel">
                    <div className="toggle-lang">
                        <div className="lang ru" style={{ background: this.state.lang == 'ru' ? '#00AEEF': '', color: this.state.lang == 'ru' ? '#ffffff' : '' }} onClick={() => this.setState({ lang: 'ru' }) }>{this.props.userStore.languageList['Информация на русском языке'] || 'Информация на русском языке'}</div>
                        <div className="lang kz" style={{ background: this.state.lang == 'kk' ? '#00AEEF': '', color: this.state.lang == 'kk' ? '#ffffff' : '' }} onClick={() => this.setState({ lang: 'kk' })}>{this.props.userStore.languageList['Информация на казахском языке'] || 'Информация на казахском языке'}</div>
                    </div>
                    {
                        this.state.lang == 'ru' &&
                        <div className="data">
                            <label>
                                <span>{this.props.userStore.languageList["Категория"] || 'Категория'}*</span>
                                <select style={{ width: '100%', border: '1px solid #E4E8F0', padding: '10px', borderRadius: '5px', fontSize: '16px', color: '#cfd2dc' }}
                                        ref={this.categoryId}
                                        defaultValue={this.categoryId.current?.value}
                                        required
                                >
                                    <option value=''>{this.props.userStore.languageList["Выберите категорию"] || 'Выберите категорию'}</option>
                                    {
                                        this.props.disputeStore.disputeCategory.map((category, index) => {
                                            return <option value={category.resource_id} key={index}>{ category.name }</option>
                                        })
                                    }

                                </select>
                            </label>
                            <label>
                                <span>{this.props.userStore.languageList["Тема"] || 'Тема'}</span>
                                <input type="text"
                                       name='name'
                                       ref={this.subjectRef}
                                       onChange={() => this.setState({ subjectRu: this.subjectRef.current.value })}
                                       defaultValue={this.state.subjectRu}
                                       placeholder={this.props.userStore.languageList["Наименование"] || 'Наименование'}
                                />
                            </label>
                            <label>
                                <span>{this.props.userStore.languageList["Описание"] || 'Описание'}</span>
                                <ReactQuill
                                    value={this.state.contentRu}
                                    onChange={(text) => { this.state.contentRu = text }}
                                />
                            </label>
                            <label>
                                <span>{this.props.userStore.languageList["Решение"] || 'Решение'}</span>
                                <ReactQuill
                                    value={this.state.answerRu}
                                    onChange={(text) => { this.state.answerRu = text }}
                                />
                            </label>
                            <div className='checkbox'>
                                <input type="checkbox"
                                       checked={this.state.status}
                                       onClick={this.statusChange}
                                       id="source"
                                       name='source'
                                />
                                <label htmlFor="source">
                                    <div>{this.props.userStore.languageList["Решено"] || 'Решено'}</div>
                                </label>
                            </div>
                        </div>
                    }

                    {
                        this.state.lang == 'kk' &&
                        <div className="data">
                            <label>
                                <span>{this.props.userStore.languageList["Категория"] || 'Категория'}*</span>
                                <select style={{ width: '100%', border: '1px solid #E4E8F0', padding: '10px', borderRadius: '5px', fontSize: '16px', color: '#cfd2dc' }}
                                        ref={this.categoryId}
                                        defaultValue={this.categoryId.current?.value}
                                        required
                                >
                                    <option value=''>{this.props.userStore.languageList["Выберите категорию"] || 'Выберите категорию'}</option>
                                    {
                                        this.props.disputeStore.disputeCategory.map((category, index) => {
                                            return <option value={category.resource_id} key={index}>{ category.name }</option>
                                        })
                                    }

                                </select>
                            </label>
                            <label>
                                <span>{this.props.userStore.languageList["Тема"] || 'Тема'}</span>
                                <input type="text"
                                       name='name'
                                       ref={this.subjectKkRef}
                                       onChange={() => this.setState({ subjectKk: this.subjectKkRef.current.value })}
                                       defaultValue={this.state.subjectKk}
                                       placeholder={this.props.userStore.languageList["Наименование"] || 'Наименование'}
                                />
                            </label>
                            <label>
                                <span>{this.props.userStore.languageList["Описание"] || 'Описание'}</span>
                                <ReactQuill
                                    value={this.state.contentKk}
                                    onChange={(text) => { this.state.contentKk = text }}
                                />
                            </label>
                            <label>
                                <span>{this.props.userStore.languageList["Решение"] || 'Решение'}</span>
                                <ReactQuill
                                    value={this.state.answerKk}
                                    onChange={(text) => { this.state.answerKk = text }}
                                />
                            </label>
                            <div className='checkbox'>
                                <input type="checkbox"
                                       checked={this.state.status}
                                       onClick={this.statusChange}
                                       id="source"
                                       name='source'
                                />
                                <label htmlFor="source">
                                    <div>{this.props.userStore.languageList["Решено"] || 'Решено'}</div>
                                </label>
                            </div>
                        </div>
                    }
                    <div className="btns">
                        <button className="cancel" onClick={() => { this.props.history.push('/dispute') }}>{this.props.userStore.languageList["Отменить"] || 'Отменить'}</button>
                        <button className="save" onClick={this.createDispute}>{this.props.userStore.languageList["Сохранить"] || 'Сохранить'}</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default inject('disputeStore', 'userStore', 'permissionsStore')(observer(DisputeThemeAdd));