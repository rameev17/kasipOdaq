import React, {Component} from "react";
import Layout from "../Containers/Layout";
import {Route, Switch} from "react-router";
import Preloader from "../../fragments/preloader/Preloader";
import Search from "../../fragments/search";
import {Link} from "react-router-dom";
import {ReactComponent as FolderIcon, ReactComponent as Folder} from "../../assets/icons/folder.svg";
import {ReactComponent as EditIcon} from "../../assets/icons/edit.svg";
import {ReactComponent as RemoveIcon} from "../../assets/icons/remove.svg";
import {ReactComponent as TribuneInfoIcon} from "../../assets/icons/tribune-info.svg";
import Modal from "react-modal";
import {ReactComponent as CloseIcon} from "../../assets/icons/cross.svg";
import TabsLayout from "../Containers/TabsLayout";
import {inject, observer} from "mobx-react";
import {NotificationContainer, NotificationManager} from "react-notifications";
import dateFormat from "date-fns/format";

class TestList extends Component {

    constructor(props){
        super(props)

        this.state = {
            tabs: [
                {name: this.props.userStore.languageList["Тест"] || 'Тест'},
                {name: this.props.userStore.languageList["Опрос"] || 'Опрос'}
            ],
            archiveTest: false,
            currentTest: true,
            preloader: false,
            unionName: 'Филиалы ОПО'
        }

        this.changeTabCallback = this.changeTabCallback.bind(this)
        this.deleteTest = this.deleteTest.bind(this)
        this.deleteArchiveTest = this.deleteArchiveTest.bind(this)
        this.loadArchiveTest = this.loadArchiveTest.bind(this)
        this.loadUnions = this.loadUnions.bind(this)

        this.prevPage = this.prevPage.bind(this)
        this.nextPage = this.nextPage.bind(this)
        this.searchTest = this.searchTest.bind(this)

        this.prevPageUnion = this.prevPageUnion.bind(this)
        this.nextPageUnion = this.nextPageUnion.bind(this)
        this.searchUnion = this.searchUnion.bind(this)

    }

    loadPage(){
        this.setState({ preloader: true })

        if (this.props.match.params.id !== undefined && this.props.match.params.id !== 'undefined'){
            this.props.testStore.loadTestList(this.props.match.params.id,null, () => {
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
            // this.props.unionStore.loadUnion(this.props.match.params.id,
            //     () => {
            //         this.setState({
            //             unionName: this.props.unionStore.union.name
            //         }, () => console.log(this.state.unionName))
            //     })
        }else{
            this.props.userStore.profileInfo(() => {
                // this.props.unionStore.loadUnion(this.props.userStore.profile.union.resource_id,
                //     () => {
                //         this.setState({
                //             unionName: this.props.unionStore.union.name
                //         }, () => console.log(this.state.unionName))
                //     })

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

                this.props.testStore.loadTestList(this.props.userStore.profile.union.resource_id,null, () => {
                    this.setState({ preloader: false })
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

    loadUnions(union){

        this.setState({ preloader: true })
        this.props.unionStore.pageNumberUnionsPpo = 1
        this.props.unionStore.loadUnionsPpo(union.resource_id, null,() => {
            this.setState({
                preloader: false,
            })

            if (union.has_child){
                this.props.history.push(`/tribune/list/${union.resource_id}`)
            }else{
                this.props.history.push(`/tribune/ppo/${union.resource_id}`)
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

    loadArchiveTest(){

        this.setState({
            archiveTest: true,
            currentTest: false,
            preloader: true,
        },() => {
            this.props.userStore.profileInfo(() => {
                if (this.props.match.params.id !== undefined && this.props.match.params.id !== 'undefined'){
                    this.props.testStore.loadTestArchiveList(this.props.match.params.id, () => {
                        this.setState({ preloader: false })
                    })
                }else{
                    console.log(this.props.userStore.profile.union.resource_id)
                    this.props.testStore.loadTestArchiveList(this.props.userStore.profile.union.resource_id, () => {
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

    componentWillMount() {
        this.loadPage()
    }

    componentDidMount() {
        this.loadPage()
    }

    changeTabCallback = (tab) => {
        switch (tab) {
            case '1':
                this.props.history.push({
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
                    pathname: `/tribune/list/` + this.props.match.params.id,
                    state: { tabId: 1 }
                })
        }
    }

    deleteTest(event){
        this.setState({ preloader: true })

        let ev = event.target.dataset.id

        if (ev == undefined) {
            let id = event.target.parentNode.dataset.id

            this.props.testStore.deleteTest(
                id,
                () => {
                    if (this.props.match.params.id !== undefined && this.props.match.params.id !== 'undefined'){
                        this.props.testStore.loadTestList(this.props.match.params.id,null, () => {
                            this.setState({ preloader: false })
                        })
                    }else{
                        this.props.testStore.loadTestList(this.props.userStore.profile.union.resource_id, null,() => {
                            this.setState({ preloader: false })
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
            this.props.testStore.deleteTest(
                id,
                () => {
                    if (this.props.match.params.id !== undefined && this.props.match.params.id !== 'undefined'){
                        this.props.testStore.loadTestList(this.props.match.params.id,null, () => {
                            this.setState({ preloader: false })
                        })
                    }else{
                        this.props.testStore.loadTestList(this.props.userStore.profile.union.resource_id, null,() => {
                            this.setState({ preloader: false })
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

    deleteArchiveTest(event){
        this.setState({ preloader: true })

        let ev = event.target.dataset.id

        if (ev == undefined) {
            let id = event.target.parentNode.dataset.id
            this.props.testStore.deleteTest(
                id,
                () => {
                    if (this.props.match.params.id !== undefined && this.props.match.params.id !== 'undefined'){
                        this.props.testStore.loadTestArchiveList(this.props.match.params.id, () => {
                            this.setState({ preloader: false })
                        })
                    }else{
                        this.props.testStore.loadTestArchiveList(this.props.userStore.profile.union.resource_id, () => {
                            this.setState({ preloader: false })
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
            this.props.testStore.deleteTest(
                id,
                () => {
                    if (this.props.match.params.id !== undefined && this.props.match.params.id !== 'undefined'){
                        this.props.testStore.loadTestArchiveList(this.props.match.params.id, () => {
                            this.setState({ preloader: false })
                        })
                    }else{
                        this.props.testStore.loadTestArchiveList(this.props.userStore.profile.union.resource_id, () => {
                            this.setState({ preloader: false })
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

    prevPage(){
        this.setState({ preloader: true })
        if (this.props.testStore.testPageNumber > 1){
            this.props.testStore.testPageNumber = this.props.testStore.testPageNumber - 1

            let unionId = null;

            if (this.props.match.params.id !== undefined && this.props.match.params.id !== 'undefined'){
                unionId = this.props.match.params.id
            }else{
                unionId = this.props.userStore.profile.union.resource_id
            }
            this.props.testStore.loadTestList(unionId, () => {
                this.setState({ preloader: false })
            })
        }else{
            this.setState({ preloader: false })
        }
    }

    nextPage(){
        this.setState({ preloader: true })
        if (this.props.testStore.testPageNumber < this.props.testStore.testPageCount){
            this.props.testStore.testPageNumber = this.props.testStore.testPageNumber + 1

            let unionId = null;

            if (this.props.match.params.id !== undefined && this.props.match.params.id !== 'undefined'){
                unionId = this.props.match.params.id
            }else{
                unionId = this.props.userStore.profile.union.resource_id
            }

            this.props.testStore.loadTestList(unionId,null,() => {
                this.setState({ preloader: false })
            })
        }else{
            this.setState({ preloader: false })
        }
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

    searchTest(search){
        if (search.length > 2){
            this.setState({ preloader: true })
            if (this.props.match.params.id !== 'undefined' && this.props.match.params.id !== undefined){
                this.props.testStore.loadTestList(this.props.match.params.id, search,() => {
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
                this.props.testStore.loadTestList(this.props.userStore.profile.union.resource_id, search, () => {
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

                    <TabsLayout tabs={this.state.tabs}
                                changeTabCallback={this.changeTabCallback}>

                        <div className="title-wrapper create-buttons">
                            {
                                this.props.match.params.id !== undefined && this.props.match.params.id !== 'undefined' ?
                                    <Link to={'/tribune/add-test/' + this.props.match.params.id }>{this.props.userStore.languageList["Добавить тест"] || 'Добавить тест'}</Link>
                                    :
                                    <Link to={'/tribune/add-test/' + this.props.userStore.profile.union.resource_id }>{this.props.userStore.languageList["Добавить тест"] || 'Добавить тест'}</Link>
                            }
                        </div>

                        <div className='legal-block'>
                            <div className="toggle-lang">
                                <div className={('lang ru ') + (this.state.currentTest ? 'active-tab' : '') } onClick={() => { this.setState({ archiveTest: false, currentTest: true }) }}>{this.props.userStore.languageList["Текущие тесты"] || 'Текущие тесты'}</div>
                                <div className={('lang kz ') + (this.state.archiveTest ? 'active-tab' : '') } onClick={ this.loadArchiveTest }>{this.props.userStore.languageList["Архив"] || 'Архив'}</div>
                            </div>

                            {
                                this.state.currentTest &&
                                <div className='legal-wrapper'>
                                    <Search currentPage={this.props.testStore.testCurrentPage}
                                            pageCount={this.props.testStore.testPageCount}
                                            prevPage={this.prevPage}
                                            nextPage={this.nextPage}
                                            search={this.searchTest}
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
                                            this.props.testStore.testList.map((test, index) => {
                                                return <tr className={'shown'} key={index}>
                                                        <td className="subject">
                                                            <div className={'legal-subject'}>
                                                                <Link to={'#'} className={'legal-link'}>
                                                                    { test.name }
                                                                </Link>
                                                            </div>
                                                        </td>

                                                        <td className="subject">
                                                            <div className={'legal-subject'}>
                                                                <Link to={'#'} className={'legal-link'}>
                                                                    { dateFormat(test.start_date, "dd-MM-yyyy") }
                                                                </Link>
                                                            </div>
                                                        </td>

                                                        <td className="subject">
                                                            <div className={'legal-subject'}>
                                                                { test.status == 1 ? this.props.userStore.languageList["Опубликован"] || 'Опубликован' : '' }
                                                                { test.status == 0 ? this.props.userStore.languageList["Не опубликован"] || 'Не опубликован' : '' }
                                                            </div>
                                                        </td>

                                                        <td className="edit">
                                                            {
                                                                test.status == 1 &&
                                                                    <Link to={'/tribune/' + test.resource_id }>
                                                                        <div className="btn-action" >
                                                                            <div className="icon">
                                                                                <TribuneInfoIcon />
                                                                            </div>
                                                                        </div>
                                                                    </Link>
                                                            }
                                                            {
                                                                test.status == 0 &&
                                                                <Link to={'/tribune/test/edit/' + test.resource_id }>
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
                                                                }} data-id={test.resource_id} onClick={this.deleteTest}>
                                                                    <div className='icon'>
                                                                        <RemoveIcon data-id={test.resource_id}/>
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
                                this.state.archiveTest &&
                                <div className='legal-wrapper'>
                                    <Search
                                        currentPage={this.props.testStore.testCurrentPage}
                                        pageCount={this.props.testStore.testPageCount}
                                        prevPage={this.prevPage}
                                        nextPage={this.nextPage}
                                        search={this.searchTest}
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
                                            this.props.testStore.testArchiveList.map((test, index) => {
                                                return <tr className={'shown'} key={index}>
                                                    <td className="subject">
                                                        <div className={'legal-subject'}>
                                                            <Link to={'#'} className={'legal-link'}>
                                                                { test.name }
                                                            </Link>
                                                        </div>
                                                    </td>

                                                    <td className="subject">
                                                        <div className={'legal-subject'}>
                                                            <Link to={'#'} className={'legal-link'}>
                                                                { dateFormat(test.start_date, "dd-MM-yyyy") }
                                                            </Link>
                                                        </div>
                                                    </td>

                                                    <td className="edit">
                                                        {
                                                            test.status == 1 ?
                                                                <Link to={'/tribune/' + test.resource_id }>
                                                                    <div className="btn-action" >
                                                                        <div className="icon">
                                                                            <TribuneInfoIcon />
                                                                        </div>
                                                                    </div>
                                                                </Link>
                                                                :
                                                                <Link to={'/tribune/test/edit/' + test.resource_id }>
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
                                                            }} data-id={test.resource_id} onClick={this.deleteArchiveTest}>
                                                                <div className='icon'>
                                                                    <RemoveIcon data-id={test.resource_id}/>
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
                                    {this.props.userStore.languageList["Территориальное объединеине профсоюзов"]
                                    || 'Территориальное объединение профсоюзов'}
                                </h2>
                                <ul className="list__wrapper">
                                    <li>
                                        <Link to={`/tribune/ppo/${this.props.unionStore.union.association_union?.resource_id}`}>
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
                            prevPage={this.prevPageUnion}
                            nextPage={this.nextPageUnion}
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

export default inject('testStore', 'permissionsStore', 'unionStore', 'userStore')(observer(TestList));
