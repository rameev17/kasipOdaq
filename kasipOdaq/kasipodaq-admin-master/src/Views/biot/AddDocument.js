import React, {Component} from 'react';
import {ReactComponent as RemoveIcon} from '../../assets/icons/delete.svg'
import {ReactComponent as AppendIcon} from '../../assets/icons/clip.svg'
import {inject, observer} from "mobx-react";
import {NotificationContainer, NotificationManager} from "react-notifications";
import { withRouter } from "react-router";
import Preloader from "../../fragments/preloader/Preloader";

class AddDocument extends Component {

    constructor(props) {
        super(props);

        this.state = {
            preloader: false
        }

        this.nameOrderRef = React.createRef()
        this.fileUploadRef = React.createRef()

        this.createOrder = this.createOrder.bind(this)
        this.fileChange = this.fileChange.bind(this)
    }

    fileChange(){
        let file = this.fileUploadRef.current.files[0]

        this.props.biotStore.orderFile = file
    }

    createOrder(){
        if (this.nameOrderRef.current.value == ''){
            NotificationManager.error('Заполните пожалуйста поле "Название приказа"')
        }else if (this.fileUploadRef.current.files.length <= 0){
            NotificationManager.error('Прикрепите пожалуйста документ')
        }else{
            this.setState({ preloader: true })
            this.props.biotStore.uploadFile(this.props.biotStore.orderFile, () => {
                this.props.biotStore.createOrder(
                    this.nameOrderRef.current.value,
                    this.props.biotStore.files.join(','),
                    () => {
                      NotificationManager.success('Вы успешно добавили приказ')
                        this.setState({
                            preloader: false
                        })
                        this.props.biotStore.orderFile = null
                        this.nameOrderRef.current.value = null
                        this.props.biotStore.loadOrderList(
                            this.props.userStore.profile.union.resource_id,
                            () => {

                            }
                        )
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
                    }
                )
            })
        }

    }

    render() {

        return (
            <div className='add-document plate-wrapper'>

                {
                    this.state.preloader &&
                        <Preloader/>
                }

                <NotificationContainer/>

               <div className="name">
                   <span>{this.props.userStore.languageList["Название"] || 'Название'}</span>
                   <input type="text" name="name"
                          ref={this.nameOrderRef}
                          placeholder={this.props.userStore.languageList["Заполните поле"] || 'Заполните поле'}
                   />
               </div>
               <div className="document-container">
                   <span>{this.props.userStore.languageList["Прикрепите документ"] || 'Прикрепите документ'}</span>
                   <label className="document">
                       {!this.props.biotStore.orderFile &&
                       <div className="placeholder">
                           {this.props.userStore.languageList["Прикрепить файл"] || 'Прикрепить файл'}
                       </div>
                       }
                       {this.props.biotStore.orderFile &&
                       <div className="placeholder">
                           {this.props.biotStore.orderFile.name}
                       </div>
                       }
                       <div className="icons__wrapper">
                           {this.state.file &&
                           <div className="icon remove" onClick={this.handleRemoveFile}>
                               <RemoveIcon/>
                           </div>
                           }
                           <div className="icon append" onClick={this.handleSetFile}>
                               <AppendIcon/>
                           </div>
                       </div>
                       <input type="file"
                              name="document"
                              ref={this.fileUploadRef}
                              onChange={this.fileChange}
                              style={{display: 'none'}}
                       />
                   </label>

               </div>
               <button className='add-file' onClick={this.createOrder}>{this.props.userStore.languageList["Добавить приказ"] || 'Добавить приказ'}</button>
            </div>
        );
    }
}

export default withRouter(inject('biotStore', 'userStore')(observer(AddDocument)));
