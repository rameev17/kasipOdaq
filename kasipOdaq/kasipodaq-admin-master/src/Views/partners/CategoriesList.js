import React, {Component} from 'react';
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import Search from "../../fragments/search";
import {inject, observer} from "mobx-react";
import Preloader from "../../fragments/preloader/Preloader";
import {NotificationContainer, NotificationManager} from "react-notifications";

const CategoriesList = inject('partnersStore')(observer(class CategoriesList extends Component {

    constructor(props){
        super(props)

        this.state = {
            preloader: false,
        }

        this.categoryNameRef = React.createRef()

        this.addCategory = this.addCategory.bind(this)
        this.nextPage = this.nextPage.bind(this)
        this.prevPage = this.prevPage.bind(this)
        this.searchCategory = this.searchCategory.bind(this)

    }

    componentDidMount() {
        this.loadPage()
    }

    loadPage() {
        this.props.partnersStore.loadPartnerCategoryList(null,() => {
            this.setState({
                preloader: false
            })
        },response => {
            if (response.status == 401){
                this.setState({ preloader: false })
                this.props.history.push('/')
            }
        })
    }

    addCategory(){
        if (this.categoryNameRef.current.value == ''){
            NotificationManager.error('Заполните пожалуйста поле "Название категории"')
        }else{
            this.setState({ preloader: true })

            this.props.partnersStore.createPartnerCategory(
                this.categoryNameRef.current.value,
                () => {
                    this.setState({ preloader: false })
                    this.props.partnersStore.loadPartnerCategoryList(null,() => {

                    }, response => {
                        if (Array.isArray(response.data)) {
                            response.data.forEach(error => {
                                this.setState({preloader: false})
                                NotificationManager.error(error.message)
                            })
                        } else {
                            this.setState({preloader: false})
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
                            this.setState({preloader: false})
                            NotificationManager.error(error.message)
                        })
                    } else {
                        this.setState({preloader: false})
                        NotificationManager.error(response.data.message)
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
        if (this.props.partnersStore.partnerPageNumber > 1){
            this.props.partnersStore.partnerPageNumber = this.props.partnersStore.partnerPageNumber - 1
            this.loadPage()
        }else{
            this.setState({ preloader: false })
        }
    }

    nextPage(){
        this.setState({ preloader: true })
        if (this.props.partnersStore.partnerPageNumber < this.props.partnersStore.partnerPageCount){
            this.props.partnersStore.partnerPageNumber = this.props.partnersStore.partnerPageNumber + 1
            this.loadPage()
        }else{
            this.setState({ preloader: false })
        }
    }

    searchCategory(search){
        if (search.length > 2){
            this.setState({ preloader: true })
            this.props.partnersStore.loadPartnerCategoryList(search,() => {
                this.setState({
                    preloader: false
                })
            },response => {
                if (response.status == 401){
                    this.setState({ preloader: false })
                    this.props.history.push('/')
                }
            })
        }else{
            this.loadPage()
        }
    }

    render() {
        return (
            <div className='partners-categories'>

                {
                    this.state.preloader &&
                    <Preloader/>
                }

                <NotificationContainer/>

                <h1 className="title">{this.props.userStore.languageList["Партнеры"] || 'Партнеры'}</h1>
                <div className="panel">
                    {
                        this.props.permissionsStore.hasPermission('partner', 'create') &&
                        <div className="add-category">
                            <div className="plate-wrapper">
                                <label>
                                    <span>{this.props.userStore.languageList["Название"] || 'Название'}</span>
                                    <input type="text"
                                           name="title"
                                           ref={this.categoryNameRef}
                                           placeholder={this.props.userStore.languageList["Название категории"] || 'Название категории'}
                                    />
                                </label>
                                <button onClick={this.addCategory}>{this.props.userStore.languageList["Добавить категорию"] || 'Добавить категорию'}</button>
                            </div>
                        </div>
                    }

                    <div className="plate-wrapper categories">
                        <h3 className="subtitle">{this.props.userStore.languageList["Все категории"] || 'Все категории'}</h3>
                        <Search currentPage={this.props.partnersStore.partnerCurrentPage}
                                pageCount={this.props.partnersStore.partnerPageCount}
                                search={this.searchCategory}
                                prevPage={this.prevPage}
                                nextPage={this.nextPage}
                        />

                        <ul className="categories-list">
                            {
                                this.props.partnersStore.partnerCategoryList.map((category, index) => {
                                    return <Category category={category} key={index} categoryName={category.name}/>
                                })
                            }
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}));

const Category = inject('partnersStore', 'userStore')(observer(class Category extends Component {

    constructor(props){
        super(props)

        this.state = {
            preloader: false,
            editButtons: false
        }

        this.categoryName = React.createRef()

        this.buttonsChange = this.buttonsChange.bind(this)
        this.saveCategory = this.saveCategory.bind(this)
        this.deleteCategory = this.deleteCategory.bind(this)
    }

    buttonsChange(){
        this.setState({
            editButtons: true
        })
    }

    saveCategory(){
        let id = this.props.category.resource_id

        if (this.categoryName.current.value == ''){
            NotificationManager.error('Заполните пожалуйста поле "Название категории"')
        }else{
            this.setState({ preloader: true })

            this.props.partnersStore.editPartnerCategory(
                id,
                this.categoryName.current.value,
                () => {
                    this.props.partnersStore.loadPartnerCategoryList(null,() => {

                    })
                    this.setState({
                        editButtons: false,
                        preloader: false
                    })
                }, response => {
                    if (Array.isArray(response.data)) {
                        response.data.forEach(error => {
                            this.setState({preloader: false})
                            NotificationManager.error(error.message)
                        })
                    } else {
                        this.setState({preloader: false})
                        NotificationManager.error(response.data.message)
                    }
                }
            )
        }

    }

    deleteCategory(e){
        this.setState({ preloader: true })
        let id = e.target.dataset.id
        this.props.partnersStore.deletePartnerCategory(
            id,
            () => {
                this.setState({ preloader: false })
                this.props.partnersStore.loadPartnerCategoryList(null,() => {

                })

            }, response => {
                if (Array.isArray(response.data)) {
                    response.data.forEach(error => {
                        this.setState({preloader: false})
                        NotificationManager.error(error.message)
                    })
                } else {
                    this.setState({preloader: false})
                    NotificationManager.error(response.data.message)
                }
            }
        )
    }

    render() {

        return (
            <React.Fragment>

                <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>

                    {
                        this.state.editButtons ?
                            <div className="category-title-change">
                                <form className="edit" style={{display: 'block', width: '100%' }}>
                                    <input type="text"
                                           name="title"
                                           ref={this.categoryName}
                                           style={{ width: '100%', fontSize: 15 }}
                                           value={this.props.category.name}
                                           onChange={ (e) => { this.props.category.name = e.target.value }}
                                           placeholder={this.props.userStore.languageList["Название категории"] || 'Название категории'}
                                    />
                                </form>
                            </div>
                            :
                            <Link to={`/partners/category/` + this.props.category.resource_id } params={{ categoryName: this.props.category.name }}>
                                <div className="category-title">
                                    <div className="text">
                                        { this.props.category.name }
                                    </div>
                                </div>
                            </Link>

                    }

                    <div className="links">
                        {
                            !this.state.editButtons ?
                                <React.Fragment>
                                    <span className="edit" onClick={this.buttonsChange}>{this.props.userStore.languageList["Переименовать"] || 'Переименовать'}</span>
                                    <span className="delete" onClick={this.deleteCategory} data-id={this.props.category.resource_id}>{this.props.userStore.languageList["Удалить"] || 'Удалить'}</span>
                                </React.Fragment>
                                :
                                <React.Fragment>
                                    <span className="cancel" onClick={() => { this.setState({ editButtons: false }) } }>{this.props.userStore.languageList["Отменить"] || 'Отменить'}</span>
                                    <span className="save" onClick={this.saveCategory} >{this.props.userStore.languageList["Сохранить"] || 'Сохранить'}</span>
                                </React.Fragment>
                        }
                    </div>
                </li>
            </React.Fragment>
        )
    }
}))

export default inject('partnersStore', 'userStore', 'permissionsStore')(observer(CategoriesList));