import React, {Component} from 'react';
import TabsLayout from "../Containers/TabsLayout"
import {Link} from "react-router-dom";
import Search from "../../fragments/search";

import {ReactComponent as RemoveIcon} from '../../assets/icons/remove.svg';
import {ReactComponent as EditIcon} from '../../assets/icons/edit.svg';
import {inject, observer} from "mobx-react";
import {NotificationContainer, NotificationManager} from "react-notifications";
import './index.scss';
import Modal from "react-modal";
import {ReactComponent as CloseIcon} from "../../assets/icons/cross.svg";
import {ReactComponent as Folder} from "../../assets/icons/folder.svg";

const dateFormat = require('dateformat');

class ArticlesList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            title: this.props.userStore.languageList["Законодательная база"] || 'Законодательная база',
            tabs: [
                {name: this.props.userStore.languageList["Разделы"] || 'Разделы'},
                {name: this.props.userStore.languageList["Главы"] || 'Главы'},
                {name: this.props.userStore.languageList["Статьи"] || 'Статьи'}
            ],
            preloader: true,
            modal: false,
            modalEdit: false,
        }

        this.sectionName = React.createRef()

        this.changeTabCallback = this.changeTabCallback.bind(this)
        this.createArticle = this.createArticle.bind(this)
        this.openEdit = this.openEdit.bind(this)
        this.editArticle = this.editArticle.bind(this)
        this.deleteArticle = this.deleteArticle.bind(this)
        this.prevPage = this.prevPage.bind(this)
        this.nextPage = this.nextPage.bind(this)

    }

    componentDidMount() {
        this.props.legalStore.loadLegislationList(this.props.match.params.id,() => {
            this.setState({ preloader: false })
        },response => {
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
                this.setState({ preloader: false })
                this.props.history.push('/')
            }
        })
    }

    createArticle(e){
        e.preventDefault()

        this.setState({ preloader: true })

        this.props.legalStore.createLegislation(this.props.match.params.id, this.sectionName.current.value, () => {
            this.setState({
                preloader: false,
                modal: false
            }, () => {
                this.props.legalStore.loadLegislationList(this.props.match.params.id)
            })
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
                this.setState({ preloader: false })
                this.props.history.push('/')
            }
        })

    }

    openEdit(e){
        let id = e.target.dataset.id

        this.setState({
            modalEdit: true,
            sectionId: e.target.dataset.id
        }, () => {
            this.props.legalStore.loadLegislation(id,() => {

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
                    this.setState({ preloader: false })
                    this.props.history.push('/')
                }
            })
        })
    }

    editArticle(e){
        e.preventDefault()

        this.props.legalStore.editLegislation(this.state.sectionId, this.sectionName.current.value,null, () => {
            NotificationManager.success('Вы успешно изменили раздел!')
            this.setState({ modalEdit: false })
            this.props.legalStore.loadLegislationList(this.props.match.params.id,() => {

            },response => {
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
                    this.setState({ preloader: false })
                    this.props.history.push('/')
                }
            })
        },response => {
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
                this.setState({ preloader: false })
                this.props.history.push('/')
            }
        })
    }

    prevPage(){
        this.setState({ preloader: true })
        if (this.props.legalStore.legalPageNumber > 1){
            this.props.legalStore.legalPageNumber = this.props.legalStore.legalPageNumber - 1
            this.loadPage()
        }else{
            this.setState({ preloader: false })
        }
    }

    nextPage(){
        this.setState({ preloader: true })
        if (this.props.legalStore.legalPageNumber < this.props.legalStore.legalPageCount){
            this.props.legalStore.legalPageNumber = this.props.legalStore.legalPageNumber + 1
            this.loadPage()
        }else{
            this.setState({ preloader: false })
        }
    }

    deleteArticle(event){
        let id = event.target.dataset.id;

        this.props.legalStore.deleteLegislation(id, () => {

            this.props.legalStore.loadLegislationList(this.props.match.params.id,() => {

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
                    this.setState({ preloader: false })
                    this.props.history.push('/')
                }
            })
        },response => {
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
                this.setState({ preloader: false })
                this.props.history.push('/')
            }
        })
    }

    changeTabCallback = (tab) => {
        switch (tab) {
            case '1':
                this.props.history.push({
                    pathname:`/legals`,
                    state: { tabId: 1 }
                })
                break;
            case '2':
                this.props.history.push({
                    pathname: `/legals/chapters`,
                    state: { tabId: 2,
                        title: this.state.title}
                })
                break;
            case '3':
                this.props.history.push({
                    pathname: `/legals/articles`,
                    state: { tabId: 3,
                        title: this.state.title}
                })
                break;
            default:
                this.props.history.push({
                    pathname:`/legals`,
                    state: { tabId: 1 }
                })
        }
    }

    render() {

        return (
            <div className='discussion-direction content'>
                <div className="title-wrapper">
                    <h1 className="title">{this.props.userStore.languageList["Законодательная база"] || 'Законодательная база'}</h1>
                </div>
                <div className="panel">
                    <Search currentPage={this.props.legalStore.legalCurrentPage}
                            pageCount={this.props.legalStore.legalPageCount}
                            prevPage={this.prevPage}
                            nextPage={this.nextPage}/>

                    <div className="title-wrapper create-buttons">
                        {
                            this.props.permissionsStore.hasPermission('legislation', 'create') &&
                            <>
                                <Link onClick={() => { this.setState({ modal: true }) }}>{this.props.userStore.languageList["Создать папку"] || 'Создать папку'}</Link>
                                <Link to={'/legals/' + this.props.match.params.id + '/create'}>{this.props.userStore.languageList["Создать документ"] || 'Создать документ'}</Link>
                            </>
                        }
                    </div>

                    <div className='legal-block'>
                        <div className="toggle-lang">
                            {/*<div className="lang ru" onClick={() => { this.setState({ lang: 'ru' }) }}>Информация на русском языке</div>*/}
                            {/*<div className="lang kz" onClick={() => { this.setState({ lang: 'kz' }) }}>Информация на казахском языке</div>*/}
                        </div>

                        <div className='legal-wrapper'>
                            <table>
                                <thead className="heading">
                                <tr>
                                    <td className="subject">{this.props.userStore.languageList["Название"] || 'Название'}</td>

                                    <React.Fragment>
                                        {
                                            this.props.permissionsStore.hasPermission('legislation', 'edit') &&
                                            <td className="edit"/>
                                        }
                                        {
                                            this.props.permissionsStore.hasPermission('legislation', 'delete') &&
                                            <td className="remove"/>
                                        }
                                    </React.Fragment>

                                </tr>
                                </thead>
                                <tbody className="list">
                                {
                                    this.props.legalStore.LegislationList.map((article, index) => {
                                        return <tr className={'shown'} key={index}>
                                            <td className="subject">
                                                <div className={'legal-subject'}>
                                                    { !article.content ?
                                                        <Folder/>
                                                        : ''
                                                    }

                                                    { article.title }
                                                </div>
                                            </td>

                                            {
                                                this.props.permissionsStore.hasPermission('legislation', 'edit') &&
                                                <td className="edit">
                                                    {
                                                        article.content ?
                                                            <Link to={ '/legals/articles/edit/' + article.resource_id }>
                                                                <div className="btn-action">
                                                                    <div className="icon">
                                                                        <EditIcon/>
                                                                    </div>
                                                                </div>
                                                            </Link>
                                                            :
                                                            <Link  data-id={article.resource_id}>
                                                                <div className="btn-action" onClick={this.openEdit} data-id={article.resource_id}>
                                                                    <div className="icon">
                                                                        <EditIcon data-id={article.resource_id}/>
                                                                    </div>
                                                                </div>
                                                            </Link>
                                                    }

                                                </td>
                                            }
                                            {
                                                this.props.permissionsStore.hasPermission('legislation', 'delete') &&
                                                <td className="remove">
                                                    <div className="btn-action" data-id={article.resource_id} onClick={this.deleteArticle}>
                                                        <div className="icon" data-id={article.resource_id}>
                                                            <RemoveIcon data-id={article.resource_id}/>
                                                        </div>
                                                    </div>
                                                </td>
                                            }

                                        </tr>
                                    })
                                }

                                {
                                    this.state.modal &&
                                    <Modal
                                        isOpen={true}
                                        onRequestClose={this.props.closeChangePassModal}
                                        className="Modal"
                                        overlayClassName="Overlay"
                                    >
                                        <NotificationContainer/>
                                        <div className='modal__wrapper create-section__wrapper'>
                                            <div className="section-create-title">
                                                {this.props.userStore.languageList["Создать раздел"] || 'Создать раздел'}
                                                <div className={"icon is-active"} onClick={() => { this.setState({ modal: false }) }}>
                                                    <CloseIcon style={{ transform: 'rotate(45deg)' }}/>
                                                </div>
                                            </div>
                                            <form onSubmit={this.createArticle}>

                                                <label>
                                                    <p className="label">{this.props.userStore.languageList["Название раздела"] || 'Название раздела'}</p>
                                                    <div className="wrapper">

                                                        <input name='sectionName'
                                                               ref={this.sectionName}
                                                               type={'text'}
                                                               placeholder={this.props.userStore.languageList["Введите название раздела"] || 'Введите название раздела'}
                                                               className="section-name"
                                                        />

                                                    </div>
                                                </label>

                                                <button type='submit' className='btn btn-save'>{this.props.userStore.languageList["Сохранить"] || 'Сохранить'}</button>
                                            </form>
                                        </div>
                                    </Modal>
                                }


                                {
                                    this.state.modalEdit &&
                                    <Modal
                                        isOpen={true}
                                        className="Modal"
                                        overlayClassName="Overlay"
                                    >
                                        <NotificationContainer/>
                                        <div className='modal__wrapper create-section__wrapper'>
                                            <div className="section-create-title">
                                                {this.props.userStore.languageList["Изменить раздел"] || 'Изменить раздел'}
                                                <div className={"icon is-active"} onClick={() => { this.setState({ modalEdit: false }) }}>
                                                    <CloseIcon style={{ transform: 'rotate(45deg)' }}/>
                                                </div>
                                            </div>
                                            <form onSubmit={this.editArticle}>

                                                <label>
                                                    <p className="label">{this.props.userStore.languageList["Название раздела"] || 'Название раздела'}</p>
                                                    <div className="wrapper">

                                                        <input name='sectionName'
                                                               ref={this.sectionName}
                                                               value={this.props.legalStore.legislation.title}
                                                               onChange={(e) => { this.props.legalStore.legislation.title = e.target.value }}
                                                               type='text'
                                                               placeholder={this.props.userStore.languageList["Введите название раздела"] || 'Введите название раздела'}
                                                               className="section-name"
                                                        />

                                                    </div>
                                                </label>

                                                <button type='submit' className='btn btn-save'>{this.props.userStore.languageList["Сохранить"] || 'Сохранить'}</button>
                                            </form>
                                        </div>
                                    </Modal>
                                }

                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default inject('legalStore', 'userStore', 'permissionsStore')(observer(ArticlesList));