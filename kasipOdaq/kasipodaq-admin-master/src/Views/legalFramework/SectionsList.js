import React, {Component} from 'react';
import TabsLayout from "../Containers/TabsLayout"
import {Link} from "react-router-dom";
import Search from "../../fragments/search";

import {ReactComponent as RemoveIcon} from '../../assets/icons/remove.svg';
import {ReactComponent as EditIcon} from '../../assets/icons/edit.svg';
import {inject, observer} from "mobx-react";
import {NotificationContainer, NotificationManager} from "react-notifications";
import {ReactComponent as LogoIcon} from "../../assets/icons/logo.svg";
import {ReactComponent as LockIcon} from "../../assets/icons/lock.svg";
import {ReactComponent as ShowPassIcon} from "../../assets/icons/show-pass.svg";
import {ReactComponent as HidePassIcon} from "../../assets/icons/hide-pass.svg";
import Modal from "react-modal";

import './index.scss';
import {ReactComponent as CloseIcon} from "../../assets/icons/cross.svg";
import ApiService from "../../services/ApiService";
import Preloader from "../../fragments/preloader/Preloader";
import {ReactComponent as Folder} from "../../assets/icons/folder.svg";
import CookieService from "../../services/CookieService";

const dateFormat = require('dateformat');

class SectionsList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            title: this.props.userStore.languageList["Законодательная база"] || 'Законодательная база',
            createTitleRu: '',
            createTitleKk: '',
            tabs: [
                {name: this.props.userStore.languageList["Разделы"] || 'Разделы'},
                {name: this.props.userStore.languageList["Главы"] || 'Главы'},
                {name: this.props.userStore.languageList["Статьи"] || 'Статьи'}
            ],
            modal: false,
            modalEdit: false,
            preloader: true,
            sectionId: 0,
            lang: CookieService.get('language-admin'),
            langList: CookieService.get('language-admin'),
        };

        this.sectionName = React.createRef();
        this.sectionNameKk = React.createRef();

        this.changeTabCallback = this.changeTabCallback.bind(this);
        this.deleteSection = this.deleteSection.bind(this);
        this.createSection = this.createSection.bind(this);
        this.openEdit = this.openEdit.bind(this);
        this.editSection = this.editSection.bind(this);
        this.nextPage = this.nextPage.bind(this);
        this.prevPage = this.prevPage.bind(this);
        this.searchLegislation = this.searchLegislation.bind(this);
        this.changeLangListRu = this.changeLangListRu.bind(this);
        this.changeLangListKk = this.changeLangListKk.bind(this)

    }

    componentDidMount() {
        this.props.legalStore.legalPageNumber = 1;

        this.props.legalStore.loadLegislationList(
            this.props.match.params.id,
            null,
            this.state.langList,
            (data) => {
                this.props.legalStore.breadCrumbs = data[0]?.bread_crumbs;
                this.setState({ preloader: false })
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

    componentDidUpdate(prevProps) {
        if (this.props !== prevProps) {

            this.props.legalStore.legalPageNumber = 1;

            this.props.legalStore.loadLegislationList(
                this.props.match.params.id,
                null,
                this.state.langList,
                (data) => {
                    this.props.legalStore.breadCrumbs = data[0]?.bread_crumbs;
                    this.setState({ preloader: false })
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
    }

    createSection(e){
        e.preventDefault();

        this.setState({ preloader: true });

        this.props.legalStore.createLegislation(
            this.props.match.params.id,
            this.state.createTitleRu,
            this.state.createTitleKk,
            () => {
            this.setState({
                preloader: false,
                modal: false
            });
            this.props.legalStore.loadLegislationList(
                this.props.match.params.id,
                null,
                this.state.langList,
                () => {})
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
        })

    }

    openEdit(e){
        let id = e.target.dataset.id;

        this.setState({
            modalEdit: true,
            sectionId: e.target.dataset.id
        }, () => {
            this.props.legalStore.loadLegislationArticle(id,'ru',() => {
                this.setState({ createTitleRu: this.props.legalStore.legislation.title })
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
            });

            this.props.legalStore.loadLegislationArticle(id,'kk',() => {
                this.setState({ createTitleKk: this.props.legalStore.legislation.title })
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
            })
        })
    }

    editSection(e){
        e.preventDefault();

        this.props.legalStore.editLegislation(
            this.state.sectionId,
            this.state.createTitleRu,
            null,
            this.state.createTitleKk,
            null,
            () => {
            NotificationManager.success('Вы успешно изменили папку!');
            this.setState({ modalEdit: false });
            this.props.legalStore.loadLegislationList(this.props.match.params.id, null, this.state.langList,() => {

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
            })
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
        })
    }

    prevPage(){
        this.setState({ preloader: true });
        if (this.props.legalStore.legalPageNumber > 1){
            this.props.legalStore.legalPageNumber = this.props.legalStore.legalPageNumber - 1;

            this.props.legalStore.loadLegislationList(this.props.match.params.id, null, this.state.langList,() => {
                this.setState({ preloader: false })
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

        }else{
            this.setState({ preloader: false })
        }
    }

    nextPage(){
        this.setState({ preloader: true });
        if (this.props.legalStore.legalPageNumber < this.props.legalStore.legalPageCount){
            this.props.legalStore.legalPageNumber = this.props.legalStore.legalPageNumber + 1;

            this.props.legalStore.loadLegislationList(this.props.match.params.id, null, this.state.langList,() => {
                this.setState({ preloader: false })
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

        }else{
            this.setState({ preloader: false })
        }
    }

    changeLangListRu(){
        this.setState({
            langList: 'ru',
            preloader: true
        }, () => {
            this.props.legalStore.loadLegislationList(
                this.props.match.params.id,
                null,
                this.state.langList,
                (data) => {
                    this.props.legalStore.breadCrumbs = data[0]?.bread_crumbs;
                    this.setState({ preloader: false })
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
        })
    }

    changeLangListKk(){
        this.setState({
            langList: 'kk',
            preloader: true
        }, () => {
            this.props.legalStore.loadLegislationList(
                this.props.match.params.id,
                null,
                this.state.langList,
                (data) => {
                    this.props.legalStore.breadCrumbs = data[0]?.bread_crumbs;
                    this.setState({ preloader: false })
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
        })
    }

    searchLegislation(search){
        if (search.length > 2){
            this.setState({ preloader: true });
            this.props.legalStore.loadLegislationList(
                this.props.match.params.id,
                search,
                this.state.langList,
                () => {
                    this.setState({ preloader: false })
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
        }else{
            this.props.legalStore.loadLegislationList(
                this.props.match.params.id,
                null,
                this.state.langList,
                () => {
                    this.setState({ preloader: false })
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
    }

    deleteSection(event){

        this.setState({  preloader: true });

        let id = event.target.dataset.id;

        this.props.legalStore.deleteLegislation(id, () => {

            this.props.legalStore.loadLegislationList(this.props.match.params.id, null, this.state.langList,() => {
                this.setState({ preloader: false })
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
        })
    }

    changeTabCallback = (tab) => {
        switch (tab) {
            case '1':
                this.props.history.push({
                    pathname:`/legals`,
                    state: { tabId: 1 }
                });
                break;
            case '2':
                this.props.history.push({
                    pathname: `/legals/chapters`,
                    state: { tabId: 2,
                        title: this.state.title}
                });
                break;
            case '3':
                this.props.history.push({
                    pathname: `/legals/articles`,
                    state: { tabId: 3,
                        title: this.state.title}
                });
                break;
            default:
                this.props.history.push({
                    pathname:`/legals`,
                    state: { tabId: 1 }
                })
        }
    };

    render() {

        return (
            <div className='discussion-direction content'>

                {
                    this.state.preloader &&
                        <Preloader/>
                }

                <NotificationContainer/>

                <div className="title-wrapper">
                    <h1 className="title">{this.props.userStore.languageList["Законодательная база"] || 'Законодательная база'}</h1>
                </div>
                <div className="panel">
                    <Search currentPage={this.props.legalStore.legalCurrentPage}
                            pageCount={this.props.legalStore.legalPageCount}
                            prevPage={this.prevPage}
                            nextPage={this.nextPage}
                            search={this.searchLegislation}
                    />

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

                        <div style={{ marginBottom: 16 }}>
                            <Link style={{ color: '#0052A4' }} to={`/legals`} onClick={() => this.props.legalStore.breadCrumbs = null}>{this.props.userStore.languageList['Законодательная база'] || 'Законодательная база'}</Link>
                            <span> -> </span>
                            {
                                this.props.legalStore.breadCrumbs?.map((breadcrumb, index) => {
                                    return index !== this.props.legalStore.breadCrumbs.length - 1 &&
                                            <>
                                            <Link style={{ color: '#0052A4' }} to={`/legals/${breadcrumb.resource_id}`}>{ breadcrumb.name }</Link>
                                                {
                                                    index !== this.props.legalStore.breadCrumbs.length - 1 &&
                                                    <span> -> </span>
                                                }
                                            </>
                                })
                            }
                        </div>

                        <div className="toggle-lang">
                            <div className="lang ru" style={{ background: this.state.lang == 'ru' ? '#00AEEF': '', color: this.state.lang == 'ru' ? '#ffffff' : '' }} onClick={() => this.setState({ lang: 'ru' }) }>{this.props.userStore.languageList['Информация на русском языке'] || 'Информация на русском языке'}</div>
                            <div className="lang kz" style={{ background: this.state.lang == 'kk' ? '#00AEEF': '', color: this.state.lang == 'kk' ? '#ffffff' : '' }} onClick={() => this.setState({ lang: 'kk' })}>{this.props.userStore.languageList['Информация на казахском языке'] || 'Информация на казахском языке'}</div>
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
                                    this.props.legalStore.LegislationList.map((section, index) => {
                                        return <tr className={'shown'} key={index}>
                                            <td className="subject">
                                                <div className={'legal-subject'}>
                                                    { !section.content ?
                                                        <>
                                                        <Folder/>
                                                        <Link to={'/legals/' + section.resource_id} className={'legal-link'}>
                                                    { section.title }
                                                        </Link>
                                                        </>
                                                        :
                                                        <Link to={'#'} className={'legal-link'}>
                                                            { section.title }
                                                        </Link>
                                                    }

                                                </div>
                                            </td>

                                            {
                                                this.props.permissionsStore.hasPermission('legislation', 'edit') &&
                                                <React.Fragment>
                                                    {
                                                        section.content ?
                                                            <td className="edit">
                                                                <Link  to={ '/legals/articles/edit/' + section.resource_id }>
                                                                    <div className="btn-action">
                                                                        <div className="icon">
                                                                            <EditIcon/>
                                                                        </div>
                                                                    </div>
                                                                </Link>
                                                            </td>
                                                            :
                                                            <td className="edit">
                                                                <Link  data-id={section.resource_id}>
                                                                    <div className="btn-action" onClick={this.openEdit} data-id={section.resource_id}>
                                                                        <div className="icon">
                                                                            <EditIcon data-id={section.resource_id}/>
                                                                        </div>
                                                                    </div>
                                                                </Link>
                                                            </td>
                                                    }
                                                </React.Fragment>
                                            }

                                            {
                                                this.props.permissionsStore.hasPermission('legislation', 'delete') &&
                                                <React.Fragment>
                                                    <td className="remove">
                                                        <div className="btn-action" data-id={section.resource_id} onClick={this.deleteSection}>
                                                            <div className="icon">
                                                                <RemoveIcon data-id={section.resource_id}/>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </React.Fragment>
                                            }

                                        </tr>
                                    })
                                }

                                </tbody>
                            </table>
                        </div>
                    </div>

                    {
                        this.state.modal &&
                        <Modal
                            isOpen={true}
                            onRequestClose={this.props.closeChangePassModal}
                            className="Modal"
                            overlayClassName="Overlay"
                        >
                            <NotificationContainer />
                            <div className='modal__wrapper create-section__wrapper'>
                                <div className="section-create-title">
                                    {this.props.userStore.languageList["Создать папку"] || 'Создать папку'}
                                    <div className={"icon is-active"} onClick={() => { this.setState({ modal: false }) }}>
                                        <CloseIcon style={{ transform: 'rotate(45deg)' }}/>
                                    </div>
                                </div>
                                <form onSubmit={this.createSection}>

                                    <label>
                                        {/*<p className="label">{this.props.userStore.languageList["Название папки"] || 'Название папки'}</p>*/}
                                        <div className="wrapper">

                                            <div className="toggle-lang">
                                                <div className="lang ru" style={{ background: this.state.lang == 'ru' ? '#00AEEF': '', color: this.state.lang == 'ru' ? '#ffffff' : '' }} onClick={() => this.setState({ lang: 'ru' }) }>{this.props.userStore.languageList['Информация на русском языке'] || 'Информация на русском языке'}</div>
                                                <div className="lang kz" style={{ background: this.state.lang == 'kk' ? '#00AEEF': '', color: this.state.lang == 'kk' ? '#ffffff' : '' }} onClick={() => this.setState({ lang: 'kk' })}>{this.props.userStore.languageList['Информация на казахском языке'] || 'Информация на казахском языке'}</div>
                                            </div>

                                            {
                                                this.state.lang == 'ru' &&
                                                <input name='sectionName'
                                                       ref={this.sectionName}
                                                       style={{ margin: 0 }}
                                                       defaultValue={this.state.createTitleRu}
                                                       onChange={() => this.setState({ createTitleRu: this.sectionName.current.value })}
                                                       type={'text'}
                                                       placeholder={this.props.userStore.languageList["Введите название папки"] || 'Введите название папки'}
                                                       className="section-name"
                                                />
                                            }

                                            {
                                                this.state.lang == 'kk' &&
                                                <input name='sectionName'
                                                       ref={this.sectionNameKk}
                                                       style={{ margin: 0 }}
                                                       defaultValue={this.state.createTitleKk}
                                                       onChange={() => this.setState({ createTitleKk: this.sectionNameKk.current.value })}
                                                       type={'text'}
                                                       placeholder={this.props.userStore.languageList["Введите название папки"] || 'Введите название папки'}
                                                       className="section-name"
                                                />
                                            }


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
                                    {this.props.userStore.languageList["Изменить папку"] || 'Изменить папку'}
                                    <div className={"icon is-active"} onClick={() => { this.setState({ modalEdit: false }) }}>
                                        <CloseIcon style={{ transform: 'rotate(45deg)' }}/>
                                    </div>
                                </div>
                                <form onSubmit={this.editSection}>

                                    <label>
                                        <p className="label">{this.props.userStore.languageList["Название папки"] || 'Название папки'}</p>
                                        <div className="wrapper">

                                            <div className="toggle-lang">
                                                <div className="lang ru" style={{ background: this.state.lang == 'ru' ? '#00AEEF': '', color: this.state.lang == 'ru' ? '#ffffff' : '' }} onClick={() => this.setState({ lang: 'ru' })}>{this.props.userStore.languageList['Информация на русском языке'] || 'Информация на русском языке'}</div>
                                                <div className="lang kz" style={{ background: this.state.lang == 'kk' ? '#00AEEF': '', color: this.state.lang == 'kk' ? '#ffffff' : '' }} onClick={() => this.setState({ lang: 'kk' })}>{this.props.userStore.languageList['Информация на казахском языке'] || 'Информация на казахском языке'}</div>
                                            </div>
                                            {
                                                this.state.lang == 'ru' &&
                                                <input name='sectionName'
                                                       ref={this.sectionName}
                                                       value={this.state.createTitleRu}
                                                       style={{ margin: 0 }}
                                                       onChange={(e) => this.setState({ createTitleRu: e.target.value }) }
                                                       type='text'
                                                       placeholder={this.props.userStore.languageList["Введите название папки"] || 'Введите название папки'}
                                                       className="section-name"
                                                />
                                            }

                                            {
                                                this.state.lang == 'kk' &&
                                                <input name='sectionName'
                                                       ref={this.sectionName}
                                                       value={this.state.createTitleKk}
                                                       style={{ margin: 0 }}
                                                       onChange={(e) => this.setState({ createTitleKk: e.target.value }) }
                                                       type='text'
                                                       placeholder={this.props.userStore.languageList["Введите название папки"] || 'Введите название папки'}
                                                       className="section-name"
                                                />
                                            }

                                        </div>
                                    </label>

                                    <button type='submit' className='btn btn-save'>{this.props.userStore.languageList["Сохранить"] || 'Сохранить'}</button>
                                </form>
                            </div>
                        </Modal>
                    }
                </div>
            </div>
        );
    }
}

export default inject('legalStore', 'userStore', 'permissionsStore')(observer(SectionsList));
