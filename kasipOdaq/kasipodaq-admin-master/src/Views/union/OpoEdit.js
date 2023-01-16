import React, {Component} from 'react';
import ReactQuill from 'react-quill'
import {connect} from 'react-redux'
import 'react-quill/dist/quill.snow.css';
import {ReactComponent as RemoveIcon} from "../../assets/icons/delete.svg";
import {ReactComponent as CameraIcon} from "../../assets/icons/camera.svg";
import {inject, observer} from "mobx-react";
import {NotificationContainer, NotificationManager} from "react-notifications";
import CookieService from "../../services/CookieService";
import Preloader from "../../fragments/preloader/Preloader";
import {ReactComponent as LeftArrowIcon} from "../../assets/icons/arrow.svg";

class OpoEdit extends Component {

    constructor(props) {
        super(props);

        this.state = {
            preloader: false,
            lang: CookieService.get('language-admin')
        };

        this.titleRef = React.createRef();
        this.fileUploadRef = React.createRef();

        this.fileChange = this.fileChange.bind(this);
        this.saveOpo = this.saveOpo.bind(this);
        this.deletePicture = this.deletePicture.bind(this)
    }

    loadPage(){
        this.props.unionStore.loadUnionPpoEdit(this.props.match.params.id,'kk', () => {

            this.setState({
                titleKk: this.props.unionStore.union?.name,
                aboutCompanyKk: this.props.unionStore.union?.about_company,
                aboutUnionKk: this.props.unionStore.union?.about_union
            });

            this.props.unionStore.pictureFile = null

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

        this.props.unionStore.loadUnionPpoEdit(this.props.match.params.id,'ru', () => {

            this.setState({
                titleRu: this.props.unionStore.union?.name,
                aboutCompanyRu: this.props.unionStore.union?.about_company,
                aboutUnionRu: this.props.unionStore.union?.about_union
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

    componentDidMount() {
        this.loadPage()
    }

    fileChange(){
        this.setState({ preloader: true });
        let file = this.fileUploadRef.current.files[0];

        this.props.unionStore.pictureFile = file;

        this.setState({ preloader: false })
    }

    deletePicture(){
        this.props.unionStore.deleteFile(
            this.props.match.params.id,
            () => {
                this.props.unionStore.pictureFile = null;
                this.loadPage()
            }, response => {
                if (Array.isArray(response.data)) {
                    response.data.forEach(error => {
                        this.setState({ preloader: false });
                        NotificationManager.error(error.message)
                    })
                } else {
                    this.setState({ preloader: false });
                    NotificationManager.error(response.message)
                }
                if (response.status == 401){
                    this.setState({ preloader: false });
                    this.props.history.push('/')
                }
            }
        )
    }

    saveOpo(){
        this.setState({ preloader: true });

        if (this.props.unionStore.pictureFile){
            this.props.unionStore.uploadPictureFile( () => {
                this.props.unionStore.editUnion(
                    this.props.match.params.id,
                    this.state.titleRu,
                    this.state.aboutCompanyRu,
                    '',
                    this.state.titleKk,
                    this.state.aboutCompanyKk,
                    '',
                    () => {
                        this.setState({ preloader: false });
                        this.props.history.goBack()
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
                            CookieService.remove('token-admin');
                            this.setState({ preloader: false });
                            this.props.history.push('/')
                        }
                    }
                )
            })
        }else{
            this.props.unionStore.editUnion(
                this.props.match.params.id,
                this.state.titleRu,
                this.state.aboutCompanyRu,
                '',
                this.state.titleKk,
                this.state.aboutCompanyKk,
                '',
                () => {
                    this.setState({ preloader: false });
                    this.props.history.goBack()
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
                        CookieService.remove('token-admin');
                        this.setState({ preloader: false });
                        this.props.history.push('/')
                    }
                }
            )
        }
    }

    render() {

        return (
            <div className="opo-edit">

                {
                    this.state.preloader &&
                    <Preloader/>
                }

                <NotificationContainer/>

                <div className="toggle-lang">
                    <div className="lang ru" style={{ background: this.state.lang == 'ru' ? '#00AEEF': '', color: this.state.lang == 'ru' ? '#ffffff' : '' }} onClick={() => this.setState({ lang: 'ru' }) }>{this.props.userStore.languageList['Информация на русском языке'] || 'Информация на русском языке'}</div>
                    <div className="lang kz" style={{ background: this.state.lang == 'kk' ? '#00AEEF': '', color: this.state.lang == 'kk' ? '#ffffff' : '' }} onClick={() => this.setState({ lang: 'kk' })}>{this.props.userStore.languageList['Информация на казахском языке'] || 'Информация на казахском языке'}</div>
                </div>
                <div className="person">
                    {
                        this.state.lang == 'ru' &&
                        <div className="container top">
                            <div className="data">
                                <p className='subtitle'>
                                    {this.props.userStore.languageList["Об отрасли"] || 'Об отрасли'}
                                </p>

                                <div className="img__wrapper">
                                    <label className='logo'>
                                        {
                                            this.props.unionStore.pictureFile ?
                                                <div className={`img ${(this.props.unionStore.union.picture ? 'with-image' : 'default')}`}
                                                     style={{background: (this.props.unionStore.pictureFile ? `url(${URL.createObjectURL(this.props.unionStore.pictureFile)}) no-repeat center center/ cover` : '' )}}
                                                     onClick={this.handleSetImage}>
                                                    {
                                                        this.props.unionStore.union.picture &&
                                                        <div className="remove-icon" onClick={this.deletePicture}>
                                                            <RemoveIcon/>
                                                        </div>
                                                    }

                                                </div>
                                                :
                                                <div className={`img ${(this.props.unionStore.union.picture ? 'with-image' : 'default')}`}
                                                     style={{background: (this.props.unionStore.union.picture ? `url(${this.props.unionStore.union.picture.uri}) no-repeat center center/ cover` : '' )}}
                                                     onClick={this.handleSetImage}>
                                                    {
                                                        this.props.unionStore.union.picture &&
                                                        <div className="remove-icon" onClick={this.deletePicture}>
                                                            <RemoveIcon/>
                                                        </div>
                                                    }
                                                </div>
                                        }
                                        <div className='button'>
                                            <div className="icon">
                                                <CameraIcon/>
                                            </div>
                                            {this.props.userStore.languageList["Загрузить логотип"] || 'Загрузить логотип'}
                                        </div>
                                        <input type="file"
                                               onChange={this.fileChange}
                                               style={{display: 'none'}}
                                               ref={this.fileUploadRef}
                                               name="logo"/>
                                    </label>
                                </div>

                                <label>
                                    <span>{this.props.userStore.languageList["Наименование"] || 'Наименование'}</span>
                                    <input type="text"
                                           onChange={(e) => this.setState({ titleRu: e.target.value })}
                                           name='name'
                                           value={this.state.titleRu}
                                           placeholder={this.props.userStore.languageList["Наименование"] || 'Наименование'}
                                    />
                                </label>
                                <label>
                                    <span>{this.props.userStore.languageList["Описание"] || 'Описание'}</span>
                                    <ReactQuill
                                        value={this.state.aboutCompanyRu ?? ''}
                                        onChange={(text) => this.setState({ aboutCompanyRu: text })}
                                    />
                                </label>

                                <label className="document">
                                    <a href={`/union/opo/${this.props.unionStore.union.resource_id}/sample_application`} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                        <span style={{ width: "100%", borderRight: "1px solid #E4E8F0" }}>{this.props.userStore.languageList["Образцы заявлений"] || 'Образцы заявлений'}</span>
                                        <div className="icons__wrapper" style={{ padding: 5 }}>
                                            <LeftArrowIcon />
                                        </div>
                                    </a>
                                </label>

                            </div>
                        </div>
                    }

                    {
                        this.state.lang == 'kk' &&
                        <div className="container top">
                            <div className="data">
                                <p className='subtitle'>
                                    {this.props.userStore.languageList["Об отрасли"] || 'Об отрасли'}
                                </p>

                                <div className="img__wrapper">
                                    <label className='logo'>
                                        {
                                            this.props.unionStore.pictureFile ?
                                                <div className={`img ${(this.props.unionStore.union.picture ? 'with-image' : 'default')}`}
                                                     style={{background: (this.props.unionStore.pictureFile ? `url(${URL.createObjectURL(this.props.unionStore.pictureFile)}) no-repeat center center/ cover` : '' )}}
                                                     onClick={this.handleSetImage}>
                                                    {
                                                        this.props.unionStore.union.picture &&
                                                        <div className="remove-icon" onClick={this.deletePicture}>
                                                            <RemoveIcon/>
                                                        </div>
                                                    }

                                                </div>
                                                :
                                                <div className={`img ${(this.props.unionStore.union.picture ? 'with-image' : 'default')}`}
                                                     style={{background: (this.props.unionStore.union.picture ? `url(${this.props.unionStore.union.picture.uri}) no-repeat center center/ cover` : '' )}}
                                                     onClick={this.handleSetImage}>
                                                    {
                                                        this.props.unionStore.union.picture &&
                                                        <div className="remove-icon" onClick={this.deletePicture}>
                                                            <RemoveIcon/>
                                                        </div>
                                                    }
                                                </div>
                                        }
                                        <div className='button'>
                                            <div className="icon">
                                                <CameraIcon/>
                                            </div>
                                            {this.props.userStore.languageList["Загрузить логотип"] || 'Загрузить логотип'}
                                        </div>
                                        <input type="file"
                                               onChange={this.fileChange}
                                               style={{display: 'none'}}
                                               ref={this.fileUploadRef}
                                               name="logo"/>
                                    </label>
                                </div>

                                <label>
                                    <span>{this.props.userStore.languageList["Наименование"] || 'Наименование'}</span>
                                    <input type="text"
                                           onChange={(e) => this.setState({ titleKk: e.target.value })}
                                           name='name'
                                           value={this.state.titleKk}
                                           placeholder={this.props.userStore.languageList["Наименование"] || 'Наименование'}
                                    />
                                </label>
                                <label>
                                    <span>{this.props.userStore.languageList["Описание"] || 'Описание'}</span>
                                    <ReactQuill
                                        value={this.state.aboutCompanyKk ?? ''}
                                        onChange={(text) => this.setState({ aboutCompanyKk: text })}
                                    />
                                </label>

                                <label className="document">
                                    <a href={`/union/opo/${this.props.unionStore.union.resource_id}/sample_application`} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                        <span style={{ width: "100%", borderRight: "1px solid #E4E8F0" }}>{this.props.userStore.languageList["Образцы заявлений"] || 'Образцы заявлений'}</span>
                                        <div className="icons__wrapper" style={{ padding: 5 }}>
                                            <LeftArrowIcon />
                                        </div>
                                    </a>
                                </label>

                            </div>
                        </div>
                    }
                    <div className="btns">
                        <button className="cancel" onClick={() => { this.props.history.goBack() }}>{this.props.userStore.languageList["Отменить"] || 'Отменить'}</button>
                        <button className="save" onClick={this.saveOpo}>{this.props.userStore.languageList["Сохранить"] || 'Сохранить'}</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default inject('unionStore', 'userStore', 'permissionsStore')(observer(OpoEdit));