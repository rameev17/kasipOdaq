import React, {Component} from "react";
import Layout from "../Containers/Layout";
import {Route, Switch} from "react-router";
import Preloader from "../../fragments/preloader/Preloader";
import {NotificationContainer, NotificationManager} from "react-notifications";
import Search from "../../fragments/search";
import {Link} from "react-router-dom";
import {ReactComponent as TribuneInfoIcon} from "../../assets/icons/tribune-info.svg";
import {ReactComponent as EditIcon} from "../../assets/icons/edit.svg";
import {ReactComponent as RemoveIcon} from "../../assets/icons/remove.svg";
import TabsLayout from "../Containers/TabsLayout";
import {inject, observer} from "mobx-react";
import {ReactComponent as FolderIcon} from "../../assets/icons/folder.svg";
import dateFormat from "date-fns/format";

class PollList extends Component {

    constructor(props){
        super(props)

        this.state = {
            tabs: [
                {name: this.props.userStore.languageList["Тест"] || 'Тест'},
                {name: this.props.userStore.languageList["Опрос"] || 'Опрос'}
            ],
            archivePoll: false,
            currentPoll: true,
            preloader: false,
        }

        this.changeTabCallback = this.changeTabCallback.bind(this)
        this.loadArchivePoll = this.loadArchivePoll.bind(this)

        this.prevPage = this.prevPage.bind(this)
        this.nextPage = this.nextPage.bind(this)
        this.searchPoll = this.searchPoll.bind(this)

        this.prevPageUnion = this.prevPageUnion.bind(this)
        this.nextPageUnion = this.nextPageUnion.bind(this)
        this.searchUnion = this.searchUnion.bind(this)

        this.deletePoll = this.deletePoll.bind(this)
        this.deleteArchivePoll = this.deleteArchivePoll.bind(this)
        this.loadUnions = this.loadUnions.bind(this)
    }


    loadPage(){
        this.setState({ preloader: true })

        if (this.props.match.params.id != undefined && this.props.match.params.id != 'undefined'){
            this.props.pollStore.loadPollList(this.props.match.params.id,null,() => {
                this.setState({ preloader: false })
            })

            this.props.unionStore.loadUnion(this.props.match.params.id)

            this.props.unionStore.loadUnionsPpo(this.props.match.params.id, null,() => {
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
        }else{
            this.props.userStore.profileInfo(() => {
                this.props.pollStore.loadPollList(this.props.userStore.profile.union.resource_id,null, () => {
                    this.setState({ preloader: false })
                })

                this.props.unionStore.loadUnion(this.props.userStore.profile.union.resource_id)

                this.props.unionStore.loadUnionsPpo(this.props.userStore.profile.union.resource_id, null,() => {
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
    }

    componentDidMount() {
        this.loadPage()
    }

    changeTabCallback = (tab) => {
        switch (tab) {
            case '1':
                this.props.history.push({
                    // todo: при переключении с "Опрос" на "Тест"
                    //  this.props.match.params.id = undefined
                    pathname: `/tribune/list/` + this.props.match.params.id,
                    state: { tabId: 1 }
                })
                break;
            case '2':
                this.props.history.push({
                    pathname: `/tribune/poll`,
                    state: { tabId: 2,
                        title: this.state.title}
                })
                break;
            default:
                this.props.history.push({
                    pathname: `/tribune/poll/`,
                    state: { tabId: 2 }
                })
        }
    }

    prevPage(){
        this.setState({ preloader: true })
        if (this.props.pollStore.pollPageNumber > 1){
            this.props.pollStore.pollPageNumber = this.props.pollStore.pollPageNumber - 1

            let unionId = null;

            if (this.props.match.params.id !== undefined && this.props.match.params.id !== 'undefined'){
                unionId = this.props.match.params.id
            }else{
                unionId = this.props.userStore.profile.union.resource_id
            }
            this.props.pollStore.loadPollList(unionId,() => {
                this.setState({ preloader: false })
            })
        }else{
            this.setState({ preloader: false })
        }
    }

    nextPage(){
        this.setState({ preloader: true })
        if (this.props.pollStore.pollPageNumber < this.props.pollStore.pollPageCount){
            this.props.pollStore.pollPageNumber = this.props.pollStore.pollPageNumber + 1

            let unionId = null;

            if (this.props.match.params.id !== undefined && this.props.match.params.id !== 'undefined'){
                unionId = this.props.match.params.id
            }else{
                unionId = this.props.userStore.profile.union.resource_id
            }
            this.props.pollStore.loadPollList(unionId,null,() => {
                this.setState({ preloader: false })
            })
        }else{
            this.setState({ preloader: false })
        }
    }

    deletePoll(event){
        this.setState({ preloader: true })
        this.props.pollStore.deletePoll(
            event.target.dataset.id,
            () => {
                this.setState({ preloader: false })
                if (this.props.match.params.id !== undefined && this.props.match.params.id !== 'undefined'){
                    this.props.pollStore.loadPollList(this.props.match.params.id,null, () => {

                    })
                }else{
                    this.props.pollStore.loadPollList(this.props.userStore.profile.union.resource_id,null, () => {

                    })
                }
            }, response => {

                if (Array.isArray(response.data)) {
                    response.data.forEach(error => {
                        NotificationManager.error(error.message)
                        this.setState({ preloader: false })
                    })
                } else {
                    NotificationManager.error(response.data.message)
                    this.setState({ preloader: false })
                }
                if (response.status == 401){
                    this.setState({ preloader: false })
                    this.props.history.push('/')
                }
            }
        )
    }

    deleteArchivePoll(event){
        this.setState({ preloader: true })

        let ev = event.target.dataset.id

        if (ev == undefined) {
            let id = event.target.parentNode.dataset.id
            this.props.pollStore.deletePoll(
                id,
                () => {
                    this.setState({ preloader: false })
                    if (this.props.match.params.id !== undefined && this.props.match.params.id !== 'undefined'){
                        this.props.pollStore.loadPollArchiveList(this.props.match.params.id, () => {

                        })

                    }else{
                        this.props.pollStore.loadPollArchiveList(this.props.userStore.profile.union.resource_id, () => {

                        })
                    }
                }, response => {

                    if (Array.isArray(response.data)) {
                        response.data.forEach(error => {
                            NotificationManager.error(error.message)
                            this.setState({ preloader: false })
                        })
                    } else {
                        NotificationManager.error(response.data.message)
                        this.setState({ preloader: false })
                    }
                    if (response.status == 401){
                        this.setState({ preloader: false })
                        this.props.history.push('/')
                    }
                }
            )
        }else{
            let id = event.target.dataset.id

            this.props.pollStore.deletePoll(
                id,
                () => {
                    this.setState({ preloader: false })
                    if (this.props.match.params.id !== undefined && this.props.match.params.id !== 'undefined'){
                        this.props.pollStore.loadPollArchiveList(this.props.match.params.id, () => {

                        })

                    }else{
                        this.props.pollStore.loadPollArchiveList(this.props.userStore.profile.union.resource_id, () => {

                        })
                    }
                }, response => {

                    if (Array.isArray(response.data)) {
                        response.data.forEach(error => {
                            NotificationManager.error(error.message)
                            this.setState({ preloader: false })
                        })
                    } else {
                        NotificationManager.error(response.data.message)
                        this.setState({ preloader: false })
                    }
                    if (response.status == 401){
                        this.setState({ preloader: false })
                        this.props.history.push('/')
                    }
                }
            )
        }
    }

    loadArchivePoll(){
        this.setState({
            archivePoll: true,
            currentPoll: false,
            preloader: true,
        },() => {
            this.props.userStore.profileInfo(() => {
                if (this.props.match.params.id !== undefined && this.props.match.params.id !== 'undefined'){
                    this.props.pollStore.loadPollArchiveList(this.props.match.params.id, () => {
                        this.setState({ preloader: false })
                    })
                }else{
                    console.log(this.props.userStore.profile.union.resource_id)
                    this.props.pollStore.loadPollArchiveList(this.props.userStore.profile.union.resource_id, () => {
                        this.setState({ preloader: false })
                    })
                }
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

    loadUnions(union){

        this.setState({ preloader: true })
        this.props.unionStore.loadUnionsPpo(union.resource_id, null,() => {
            this.setState({
                preloader: false,
            })

            if (union.has_child){
                this.props.history.push(`/tribune/poll/list/${union.resource_id}`)
                this.props.pollStore.loadPollList(this.props.match.params.id,null, () => {
                    this.setState({ preloader: false })
                })
            }else{
                this.props.history.push(`/tribune/ppo/poll/${union.resource_id}`)
            }

            this.props.unionStore.loadUnion(union.resource_id,
                () => {
                    this.setState({
                        unionName: this.props.unionStore.union.name
                    }, () => console.log(this.state.unionName))
                })

        }, response => {
            if (Array.isArray(response.data)) {
                response.data.forEach(error => {
                    this.setState({ preloader: false })
                    // NotificationManager.error(error.message)
                })
            } else {
                this.setState({ preloader: false })
                // NotificationManager.error(response.data.message)
            }
            if (response.status == 401){
                this.setState({ preloader: false })
                this.props.history.push('/')
            }
        })
    }

    prevPageUnion(){
        this.setState({ preloader: true })
        if (this.props.unionStore.pageNumberUnionsPpo > 1){
            this.props.unionStore.pageNumberUnionsPpo = this.props.unionStore.pageNumberUnionsPpo - 1
            this.loadPage()
        }else{
            this.setState({ preloader: false })
        }
    }

    nextPageUnion(){
        this.setState({ preloader: true })
        if (this.props.unionStore.pageNumberUnionsPpo < this.props.unionStore.pageCountUnionsPpo){
            this.props.unionStore.pageNumberUnionsPpo = this.props.unionStore.pageNumberUnionsPpo + 1
            this.loadPage()
        }else{
            this.setState({ preloader: false })
        }
    }

    searchUnion(search){
        if (search.length > 2){
            this.setState({ preloader: true })
            if (this.props.match.params.id !== 'undefined' && this.props.match.params.id !== undefined){
                this.props.unionStore.loadUnionsPpo(this.props.match.params.id, search,() => {
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
            }else{
                this.props.unionStore.loadUnionsPpo(this.props.userStore.profile.union.resource_id, search, () => {
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
            }
        }else{
            this.loadPage()
        }
    }

    searchPoll(search){
        if (search.length > 2){
            this.setState({ preloader: true })
            if (this.props.match.params.id !== 'undefined' && this.props.match.params.id !== undefined){
                this.props.pollStore.loadPollList(this.props.match.params.id, search,() => {
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
            }else{
                this.props.pollStore.loadPollList(this.props.userStore.profile.union.resource_id, search, () => {
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
            }
        }else{
            this.loadPage()
        }
    }

    render() {
        return (
            <div className='discussion-direction content'>

                {
                    this.state.preloader &&
                    <Preloader/>
                }

                <NotificationContainer/>

                <div className="title-wrapper">
                    <h1 className="title">{this.props.userStore.languageList["Трибуна"] || 'Трибуна'}</h1>
                </div>

                <div className="panel">

                    <div style={{ marginBottom: 16 }}>
                        {
                            this.props.userStore.role !== 'company' &&
                            this.props.unionStore.breadCrumbs?.map((breadcrumb, index) => {
                                switch (breadcrumb.level) {
                                    case 'main_union':
                                        return (
                                            <> <Link style={{color: '#0052A4'}} to={`/tribune`}>{breadcrumb.name}</Link>
                                                {
                                                    index !== this.props.unionStore.breadCrumbs.length - 1 &&
                                                    <span> -> </span>
                                                }
                                            </>
                                        )
                                        break;
                                    case 'association':
                                        return (
                                            <> <a style={{color: '#0052A4'}}
                                                     href={`/tribune/ppo/poll/${breadcrumb.resource_id}`}>{breadcrumb.name}</a>
                                                {
                                                    index !== this.props.unionStore.breadCrumbs.length - 1 &&
                                                    <span> -> </span>
                                                }
                                            </>
                                        )
                                        break;
                                    case 'industry':
                                        return (
                                            <> <a style={{color: '#0052A4'}}
                                                     href={`/tribune/poll/list/${breadcrumb.resource_id}`}>{breadcrumb.name}</a>
                                                {
                                                    index !== this.props.unionStore.breadCrumbs.length - 1 &&
                                                    <span> -> </span>
                                                }
                                            </>
                                        )
                                        break;
                                    case 'branch':
                                        return (
                                            <> <a style={{color: '#0052A4'}}
                                                     href={`/tribune/poll/list/${breadcrumb.resource_id}`}>{breadcrumb.name}</a>
                                                {
                                                    index !== this.props.unionStore.breadCrumbs.length - 1 &&
                                                    <span> -> </span>
                                                }
                                            </>
                                        )
                                        break;
                                    case 'union':
                                        return (
                                            <> <a style={{color: '#0052A4'}}
                                                     href={`/tribune/ppo/poll/${breadcrumb.resource_id}`}>{breadcrumb.name}</a>
                                                {
                                                    index !== this.props.unionStore.breadCrumbs.length - 1 &&
                                                    <span> -> </span>
                                                }
                                            </>
                                        )
                                        break;
                                }
                            })
                        }
                    </div>

                    <TabsLayout tabs={this.state.tabs}
                                changeTabCallback={this.changeTabCallback}>

                        <div className="title-wrapper create-buttons">
                            {
                                this.props.match.params.id !== undefined && this.props.match.params.id !== 'undefined' ?
                                    <Link to={'/tribune/add-poll/' + this.props.match.params.id }>{this.props.userStore.languageList["Добавить опрос"] || 'Добавить опрос'}</Link>
                                    :
                                    <Link to={'/tribune/add-poll/' + this.props.userStore.profile.union.resource_id }>{this.props.userStore.languageList["Добавить опрос"] || 'Добавить опрос'}</Link>
                            }
                        </div>

                        <div className='legal-block'>
                            <div className="toggle-lang">
                                <div className={('lang ru ') + (this.state.currentPoll ? 'active-tab' : '') } onClick={() => { this.setState({ archivePoll: false, currentPoll: true }) }}>{this.props.userStore.languageList["Текущие опросы"] || 'Текущие опросы'}</div>
                                <div className={('lang kz ') + (this.state.archivePoll ? 'active-tab' : '') } onClick={ this.loadArchivePoll }>{this.props.userStore.languageList["Архив"] || 'Архив'}</div>
                            </div>

                            {
                                this.state.currentPoll &&
                                <div className='legal-wrapper'>
                                    <Search currentPage={this.props.pollStore.pollCurrentPage}
                                            pageCount={this.props.pollStore.pollPageCount}
                                            prevPage={this.prevPage}
                                            nextPage={this.nextPage}
                                            search={this.searchPoll}
                                    />
                                    <table>
                                        <thead className="heading">
                                        <tr>
                                            <td className="subject">{this.props.userStore.languageList["Название"] || 'Название'}</td>
                                            <td className="subject">{this.props.userStore.languageList["Дата публикации"] || 'Дата публикации'}</td>
                                            <td className="subject">{this.props.userStore.languageList["Статус"] || 'Статус'}</td>

                                            <td className="edit"/>
                                            <td className="remove"/>

                                        </tr>
                                        </thead>
                                        <tbody className="list">
                                        {
                                            this.props.pollStore.pollList.map((poll, index) => {
                                                return poll.type.resource_id == 83 && poll.status !== 2 &&
                                                <tr className={'shown'} key={index}>
                                                    <td className="subject">
                                                        <div className={'legal-subject'}>
                                                            <Link to={'#'} className={'legal-link'}>
                                                                { poll.name }
                                                            </Link>
                                                        </div>
                                                    </td>

                                                    <td className="subject">
                                                        <div className={'legal-subject'}>
                                                            <Link to={'#'} className={'legal-link'}>
                                                                { dateFormat(poll.start_date, "dd-MM-yyyy") }
                                                            </Link>
                                                        </div>
                                                    </td>

                                                    <td className="subject">
                                                        <div className={'legal-subject'}>
                                                            <Link to={'#'} className={'legal-link'}>
                                                                { poll.status ? 'опубликовано' : 'не опубликован' }
                                                            </Link>
                                                        </div>
                                                    </td>

                                                    <td className="edit">
                                                        {
                                                            poll.status == 1 ?
                                                                <Link to={'/tribune/poll/' + poll.resource_id }>
                                                                    <div className="btn-action" >
                                                                        <div className="icon">
                                                                            <TribuneInfoIcon />
                                                                        </div>
                                                                    </div>
                                                                </Link>
                                                                :
                                                                <Link to={'/tribune/poll/edit/' + poll.resource_id }>
                                                                    <div className="btn-action" >
                                                                        <div className="icon">
                                                                            <EditIcon />
                                                                        </div>
                                                                    </div>
                                                                </Link>
                                                        }
                                                    </td>

                                                    <td className="remove">
                                                        <button className={'reject'}>
                                                            <div className="btn-action" style={{
                                                                display: "flex",
                                                                alignItems: "center",
                                                                borderRadius: 4
                                                            }} data-id={poll.resource_id} onClick={this.deletePoll}>
                                                                <div className='icon'>
                                                                    <RemoveIcon data-id={poll.resource_id}/>
                                                                </div>
                                                            </div>
                                                        </button>
                                                    </td>

                                                </tr>
                                            })
                                        }

                                        </tbody>
                                    </table>
                                </div>
                            }

                            {
                                this.state.archivePoll &&
                                <div className='legal-wrapper'>
                                    <Search currentPage={this.props.pollStore.pollArchiveCurrentPage}
                                            pageCount={this.props.pollStore.pollArchivePageCount}
                                            prevPage={this.prevPage}
                                            nextPage={this.nextPage}
                                            search={this.searchPoll}
                                    />
                                    <table>
                                        <thead className="heading">
                                        <tr>
                                            <td className="subject">{this.props.userStore.languageList["Название"] || 'Название'}</td>
                                            <td className="subject">{this.props.userStore.languageList["Дата публикации"] || 'Дата публикации'}</td>

                                            <td className="edit"/>
                                            <td className="remove"/>

                                        </tr>
                                        </thead>
                                        <tbody className="list">
                                        {
                                            this.props.pollStore.pollArchiveList.map(poll => {
                                                return  poll.is_archive &&
                                                    <tr className={'shown'}>
                                                    <td className="subject">
                                                        <div className={'legal-subject'}>
                                                            <Link to={'#'} className={'legal-link'}>
                                                                { poll.name }
                                                            </Link>
                                                        </div>
                                                    </td>

                                                    <td className="subject">
                                                        <div className={'legal-subject'}>
                                                            <Link to={'#'} className={'legal-link'}>
                                                                { dateFormat(poll.start_date, "dd-MM-yyyy") }
                                                            </Link>
                                                        </div>
                                                    </td>

                                                    <td className="edit">
                                                        {
                                                            poll.status == 1 ?
                                                                <Link to={'/tribune/poll/edit/' + poll.resource_id }>
                                                                    <div className="btn-action" >
                                                                        <div className="icon">
                                                                            <TribuneInfoIcon />
                                                                        </div>
                                                                    </div>
                                                                </Link>
                                                                :
                                                                <Link to={'/tribune/poll/edit/' + poll.resource_id }>
                                                                    <div className="btn-action" >
                                                                        <div className="icon">
                                                                            <EditIcon />
                                                                        </div>
                                                                    </div>
                                                                </Link>
                                                        }
                                                    </td>

                                                        <td className="remove">
                                                            <button className={'reject'}>
                                                                <div className="btn-action" style={{
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    borderRadius: 4
                                                                }} data-id={poll.resource_id} onClick={this.deleteArchivePoll}>
                                                                    <div className='icon'>
                                                                        <RemoveIcon data-id={poll.resource_id}/>
                                                                    </div>
                                                                </div>
                                                            </button>
                                                        </td>

                                                </tr>
                                            })
                                        }

                                        </tbody>
                                    </table>
                                </div>
                            }

                        </div>

                        {
                            this.props.unionStore.union.association_union &&
                            this.props.unionStore.union.kind !== 'union' &&
                            <>
                                <br/>

                                <h2 className='from'>
                                    {/*{ this.props.unionStore.union.association_union?.name }*/}
                                    {this.props.userStore.languageList["Территориальное объединение профсоюзов"]
                                    || 'Территориальное объединение профсоюзов'}
                                </h2>
                                <ul className="list__wrapper">
                                    <li>
                                        <Link to={`/tribune/ppo/poll/${this.props.unionStore.union.association_union?.resource_id}`}>
                                            <div className="icon">
                                                <FolderIcon/>
                                            </div>
                                            { this.props.unionStore.union.association_union?.name }
                                        </Link>
                                    </li>
                                </ul>
                            </>
                        }

                        <br/>

                        <h2 className='from'>
                            { this.props.unionStore.union.name }
                        </h2>
                        <Search
                            currentPage={this.props.unionStore.currentPageUnionsPpo}
                            pageCount={this.props.unionStore.pageCountUnionsPpo}
                            prevPage={this.prevPage}
                            nextPage={this.nextPage}
                            search={this.searchUnion}
                        />
                        <ul className="list__wrapper">
                            {
                                this.props.unionStore.unionsPpoList.map(union => {
                                    return  <li>
                                        <Link onClick={() => this.loadUnions(union)}>
                                            <div className="icon">
                                                <FolderIcon/>
                                            </div>
                                            { union.name }
                                        </Link>
                                    </li>
                                })
                            }
                        </ul>

                    </TabsLayout>
                </div>
            </div>
        );
    }
}

export default inject('pollStore', 'permissionsStore', 'unionStore', 'userStore')(observer(PollList));
