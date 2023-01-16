import React, {Component} from 'react';
import ReactQuill from "react-quill";
import {ReactComponent as EditIcon} from "../../assets/icons/edit.svg";
import {inject, observer} from "mobx-react";
import {NotificationContainer, NotificationManager} from "react-notifications";
import Preloader from "../../fragments/preloader/Preloader";
import CookieService from "../../services/CookieService";

class AboutInfo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            preloader: false,
            isEditing: false,
            lang: CookieService.get('language-admin'),
            infoRu: '',
            infoKk: ''
        };

        this.saveEditInfo = this.saveEditInfo.bind(this)

    }

    loadPage(){
        this.setState({ preloader: true });
        this.props.infoStore.loadInfo(
            null,
            null,
            this.props.infoStore.INFO_KEY_ABOUT_YNTYMAQ,
            'ru',
            data => {
                this.setState({ preloader: false });
                this.props.infoStore.aboutYntymaqInfo = data[0].content;
                this.props.infoStore.aboutYntymaqInfoId = data[0].resource_id;

                this.setState({
                    infoRu: data[0].content
                })

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
            });

        this.props.infoStore.loadInfo(
            null,
            null,
            this.props.infoStore.INFO_KEY_ABOUT_YNTYMAQ,
            'kk',
            data => {
                this.setState({ preloader: false });

                this.setState({
                    infoKk: data[0].content
                })

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

    componentDidMount() {
       this.loadPage()
    }

   saveEditInfo(){
        this.setState({ preloader: true });

       if (this.props.infoStore.aboutYntymaqInfoId !== null) {
           this.props.infoStore.updateInfo(
               this.props.infoStore.aboutYntymaqInfoId,
               this.props.infoStore.aboutYntymaqInfoId,
               this.state.infoRu,
               this.state.infoKk,
               () => {
               this.loadPage();
               this.setState({ preloader: false });
               NotificationManager.success('Вы успешно обновили информацию!')
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
       } else {
           this.props.infoStore.createInfo(
               null,
               this.state.infoRu,
               this.props.infoStore.INFO_KEY_ABOUT_YNTYMAQ,
               null,
               this.state.infoKk,
               () => {
               this.loadPage();
               this.setState({ preloader: false });
               NotificationManager.success('Вы успешно создали информацию!')
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
   }

    render() {
         const modules = {
            toolbar: [
                [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
                [{size: []}],
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                [{'list': 'ordered'}, {'list': 'bullet'},
                    {'indent': '-1'}, {'indent': '+1'}],
                ['link', 'image', 'video'],
                ['clean']
            ],
            clipboard: {
                // toggle to add extra line breaks when pasting HTML:
                matchVisual: false,
            }
        };

        return (
            <div className='about__wrapper plate-wrapper'>
                {
                    this.state.preloader &&
                        <Preloader/>
                }

                <NotificationContainer/>

                <div className="info">
                    <div className="title-wrapper">
                        <h2 className="subtitle">{this.props.userStore.languageList["О Федерации"] || 'О Федерации'}</h2>
                        <div className="line"/>
                        {/*<button onClick={this.editInfo}>*/}
                        {/*    <div className="btn-action">*/}
                        {/*        <div className="icon">*/}
                        {/*            <EditIcon/>*/}
                        {/*        </div>*/}
                        {/*        <span>Редактировать</span>*/}
                        {/*    </div>*/}
                        {/*</button>*/}
                    </div>
                    <div className="content">

                    </div>
                </div>

                <div className='info-edit'>
                    <div className="toggle-lang">
                        <div className="lang ru" style={{ background: this.state.lang == 'ru' ? '#00AEEF': '', color: this.state.lang == 'ru' ? '#ffffff' : '' }} onClick={() => this.setState({ lang: 'ru' }) }>{this.props.userStore.languageList['Информация на русском языке'] || 'Информация на русском языке'}</div>
                        <div className="lang kz" style={{ background: this.state.lang == 'kk' ? '#00AEEF': '', color: this.state.lang == 'kk' ? '#ffffff' : '' }} onClick={() => this.setState({ lang: 'kk' })}>{this.props.userStore.languageList['Информация на казахском языке'] || 'Информация на казахском языке'}</div>
                    </div>
                    {
                        this.state.lang == 'ru' &&
                        <div className="data">
                            <label>
                                <span>{this.props.userStore.languageList["Описание"] || 'Описание'}</span>
                                <ReactQuill
                                    modules={modules}
                                    value={this.state.infoRu}
                                    onChange={(text) => { this.setState({ infoRu: text }) }}
                                />
                            </label>
                        </div>
                    }

                    {
                        this.state.lang == 'kk' &&
                        <div className="data">
                            <label>
                                <span>{this.props.userStore.languageList["Описание"] || 'Описание'}</span>
                                <ReactQuill
                                    modules={modules}
                                    value={this.state.infoKk}
                                    onChange={(text) => { this.setState({ infoKk: text })}}
                                />
                            </label>
                        </div>
                    }

                    <div className="btns">
                        {/*<button className="cancel" onClick={this.cancelEditInfo}>Отменить</button>*/}
                        <button className="save" onClick={this.saveEditInfo}>{this.props.userStore.languageList["Сохранить"] || 'Сохранить'}</button>
                    </div>
                </div>


            </div>
        );
    }
}

export default inject('infoStore', 'permissionsStore', 'userStore')(observer(AboutInfo));