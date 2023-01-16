import React, {Component} from 'react';
import Layout from "../../fragments/layout/Layout";

import './style.scss'

import {ReactComponent as ClipIcon} from '../../assets/icons/clip.svg';
import {ReactComponent as AddIcon} from '../../assets/icons/add.svg';
import {ReactComponent as DeleteIcon} from "../../assets/icons/close.svg";
import {inject, observer} from "mobx-react";
import Preloader from "../../fragments/preloader/Preloader";
import {NotificationContainer, NotificationManager} from 'react-notifications';
import CookieService from "../../services/CookieService";
import {Link} from "react-router-dom";

class CreateTicket extends Component {

    constructor(props) {
        super(props);

        this.state = {
            preloader: false,
            fileUpload: false,
        }

        this.titleRef =React.createRef()
        this.contentRef = React.createRef()
        this.fileRef = React.createRef()
        this.unionTypeRef = React.createRef()

        this.createTicket = this.createTicket.bind(this)
        this.fileUpload = this.fileUpload.bind(this)
    }

    componentDidMount() {

        console.log(this.props.type)
        this.props.unionStore.loadUnionsByPerson(() => {

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
                CookieService.remove('token')
                this.setState({ preloader: false })
                this.props.history.push('/auth')
            }
        })
    }

    createTicket(e){
        e.preventDefault()

        let used = {};
        let arr = this.props.appealStore.applicationFiles
        const files = arr.map(file =>
            file.id).join(",");

        let filtered = arr.filter(function(obj) {
            return obj != null && obj.id in used ? 0:(used[obj.id]=1);
        });

        let array2 = filtered.filter(element => element != "");

        const id = array2.map(file =>
            file.id).filter(function (obj) {
            return obj != undefined
        })

        const newId = id.map(file =>
            file).toString()

        this.setState({ preloader: true })


        this.props.appealStore.createAppeal(
            this.props.type == 0 ? this.unionTypeRef.current.value : null,
            this.titleRef.current.value,
            this.contentRef.current.value,
            this.props.type,
            newId,
            () => {
                this.props.appealStore.files = []
                this.props.appealStore.file = { name: 'Прикрепить файл' }
                this.setState({ preloader: false })
                if(this.props.type == 3){
                    this.props.history.push('/help')
                }else if (this.props.type == 0){
                    this.props.history.push('/request-to-fprk')
                }else{
                    this.props.history.push('/preferences/support')
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
                    CookieService.remove('token')
                    this.setState({ preloader: false })
                    this.props.history.push('/auth')
                }
            }
        )

    }

    fileUpload(event, index){
        this.props.appealStore.appealFiles[index] = event.target.files[0]

        this.props.appealStore.appealFiles.map(file => {
            this.props.appealStore.applicationFiles.push(file)
        })

        this.setState({ preloader: true })
        this.props.appealStore.applicationFiles.map(application => {
            return application.size &&
                this.props.appealStore.uploadFile(
                    application,(data, headers) => {
                        application.id = headers['x-entity-id']
                        this.setState({
                            preloader: false,
                            fileUpload: true
                        })
                    }
                )
        })
    }

    render() {
        return (
            <React.Fragment>

                <Layout title={this.props.title}>

                    {
                        this.state.preloader &&
                            <Preloader/>
                    }

                    <NotificationContainer/>

                    <div className="plate-wrapper plate-wrapper__height">

                        <div style={{ marginBottom: 16 }}>
                            {
                                this.props.type == 0 && <Link style={{ color: '#0052A4' }} to={'/request-to-fprk'}>{this.props.userStore.languageList["Обращения"] || 'Обращения'}</Link>
                                ||
                                this.props.type == 3 && <Link style={{ color: '#0052A4' }} to={'/help'}>{this.props.userStore.languageList["Помощь"] || 'Помощь'}</Link>
                                ||
                                this.props.type == 4 && <Link style={{ color: '#0052A4' }} to={'/preferences/support'}>{this.props.userStore.languageList["Тех. поддержка"] || 'Тех. поддержка'}</Link>
                            }
                            <span> -> </span>
                            <Link style={{ color: '#0052A4', borderBottom: '1px solid #0052A4' }}>{this.props.userStore.languageList["Подать обращение"] || 'Подать обращение'}</Link>
                        </div>

                        <div className="create-ticket">
                            <form className="form-send__request" onSubmit={this.createTicket}>
                                {
                                    this.props.type == 0 &&
                                    <label>
                                        <span className="title">{this.props.userStore.languageList["Кому"] || 'Кому'}:</span>
                                        <select style={{ width: '100%', border: '1px solid #E4E8F0', padding: '10px', borderRadius: '5px', fontSize: '16px', color: '#cfd2dc' }}
                                                name="industry"
                                                ref={this.unionTypeRef}
                                                onChange={(e) => { this.unionTypeRef.current.value = e.target.value }}
                                                required
                                        >
                                            <option value=''>{this.props.userStore.languageList["Выберите адресат"] || 'Выберите адресат'}</option>
                                            {
                                                this.props.unionStore.personUnionsList.map(union => {
                                                    return <option value={union.resource_id}>{ union.name }</option>
                                                })
                                            }
                                        </select>
                                    </label>
                                }
                                <br/>
                                <label>
                                    <span className="title">{this.props.userStore.languageList["Тема:"] || 'Тема:'}</span>
                                    <input type="text"
                                           name="title"
                                           className="theme"
                                           ref={this.titleRef}
                                           required
                                    />
                                </label>
                                <label>
                                    <span className="text">{this.props.userStore.languageList["Содержание"] || 'Содержание'}</span>
                                    <textarea name="content"
                                              className="content"
                                              placeholder={this.props.userStore.languageList["Введите текст"] || 'Введите текст'}
                                              ref={this.contentRef}
                                              required
                                    />
                                </label>

                                {
                                    this.props.appealStore.appealFiles.map((file, index) => {
                                        return <div style={{ display: 'flex', border: '1px solid #00AEEF', marginBottom: 16 }}>
                                                <label className={'append-file'}>
                                            <span className="title">
                                                  { file?.name || this.props.userStore.languageList["Прикрепить файл"] || 'Прикрепить файл' }
                                            </span>
                                                        <input type="file" name="file" ref={this.fileRef} onChange={(event) => this.fileUpload(event, index)}/>
                                                    </label>
                                                    {
                                                        file?.length > 0 ?
                                                            <div className="icon" style={{ zIndex: 1 }} onClick={() =>
                                                                this.fileRef.current.files = null
                                                            }>
                                                                <DeleteIcon/>
                                                            </div>
                                                            :
                                                            <div className="icon" style={{ display: 'flex', alignItems: 'center' }}>
                                                                <ClipIcon/>
                                                            </div>
                                                    }
                                                </div>
                                    })
                                }

                                {/*<label className={'append-file is-attached'}>*/}
                                {/*    <span className="title">*/}
                                {/*          { this.props.appealStore.file?.name || this.props.userStore.languageList["Прикрепить файл"] || 'Прикрепить файл' }*/}
                                {/*    </span>*/}
                                {/*    <input type="file" name="file" ref={this.fileRef} onChange={this.fileUpload}/>*/}

                                {/*    {*/}
                                {/*        this.fileRef.current?.files.length > 0 ?*/}
                                {/*            <div className="icon" style={{ zIndex: 1 }} onClick={() =>*/}
                                {/*                this.fileRef.current.files = null*/}
                                {/*            }>*/}
                                {/*                <DeleteIcon/>*/}
                                {/*            </div>*/}
                                {/*            :*/}
                                {/*            <div className="icon">*/}
                                {/*                <ClipIcon/>*/}
                                {/*            </div>*/}
                                {/*    }*/}

                                {/*</label>*/}

                                <p onClick={() => this.props.appealStore.addFileToAppeal()} style={{ display: "flex", alignItems: "center", cursor: "pointer" }}><AddIcon style={{ marginRight: 10 }}/>{this.props.userStore.languageList["Прикрепить еще файл"] || 'Прикрепить еще файл'}</p>
                                <button type='submit' className="form-send__button">{this.props.userStore.languageList["Отправить"] || 'Отправить'}</button>
                            </form>
                        </div>
                    </div>
                </Layout>

            </React.Fragment>
        )
    }
}

export default inject('appealStore', 'unionStore', 'userStore', 'permissionsStore')(observer(CreateTicket));