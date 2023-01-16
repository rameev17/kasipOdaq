import React, {Component} from 'react';
import Layout from "../../fragments/layout/Layout";
import StepsLayout from '../../fragments/stepsLayout/StepsLayout';
import {Switch, BrowserRouter, Route, Redirect, Link} from 'react-router-dom';
import {IMaskInput} from 'react-imask';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import {ModalEnterToUnion} from '../../fragments/modals/Modal';

import {ReactComponent as LogoIcon} from '../../assets/icons/logo.svg';
import {ReactComponent as MarkIcon} from '../../assets/icons/exclamation-mark.svg';
import {ReactComponent as DeleteIcon} from '../../assets/icons/close.svg';
import {ReactComponent as ShowPassIcon} from "../../assets/icons/show-pass.svg";
import {ReactComponent as HidePassIcon} from "../../assets/icons/hide-pass.svg";

import './style.scss';

import { observer, inject } from "mobx-react";
import Preloader from "../../fragments/preloader/Preloader";
import InputMask from "react-input-mask";
import CookieService from "../../services/CookieService";
import {ReactComponent as DownloadIcon} from "../../assets/icons/download.svg";
import ReactAutocomplete from "react-autocomplete";
import {ReactComponent as RightIcon} from "../../assets/icons/arrow.svg";

class UnionJoin extends Component {
    constructor(props){
        super(props)

        this.state = {
            modalIsOpen: false,
            preloader: false,
            industryName: this.props.userStore.languageList["Отраслевое объединение"] || 'Отраслевое объединение',
            unionName: this.props.userStore.languageList["Профсоюзное объединение"] || 'Профсоюзное объединение',
            isOpen: false,
            value: "",
            unionId: null
        }

        this.unionIdRef = React.createRef()
        this.unionRef = React.createRef()
        this.industryRef = React.createRef()

        this.joinFile = React.createRef()
        this.retentionFile = React.createRef()

        this.handleSubmit = this.handleSubmit.bind(this);
        this.unionChange = this.unionChange.bind(this);

        this.joinFileUpload = this.joinFileUpload.bind(this)
        this.retentionFileUpload = this.retentionFileUpload.bind(this)
        this.changeAutoComplete = this.changeAutoComplete.bind(this)
    }

    componentDidMount() {
        this.props.userStore.joinFile = { name: this.props.userStore.languageList["Заявление на вступление"] || 'Заявление на вступление' };
        this.props.userStore.retentionFile = { name: this.props.userStore.languageList["Заявление на удержание"] || 'Заявление на удержание' };
        this.props.unionStore.industry = {};
        this.props.unionStore.unionAssociation = {};

        this.props.userStore.loadUnionsList(null,() => {},
            response => {
                if (Array.isArray(response.data)) {
                    response.data.forEach(error => {
                        this.setState({preloader: false})
                        NotificationManager.error(error.message)
                    })
                } else {
                    NotificationManager.error(response.data.message)
                    this.setState({preloader: false})
                }
                if (response.status == 401){
                    CookieService.remove('token')
                    this.setState({ preloader: false })
                    this.props.history.push('/auth')
                }
            })
    }

    unionChange(){
        this.props.unionStore.loadUnions(
            this.state.unionId
        )
    }

    joinFileUpload(){
        this.props.userStore.joinFile = this.joinFile.current.files[0]
    }

    retentionFileUpload(){
        this.props.userStore.retentionFile = this.retentionFile.current.files[0]
    }

    async joinUnion() {
      await this.props.userStore.uploadFileForJoin(this.props.userStore.joinFile);
      await this.props.userStore.uploadFileForJoin(this.props.userStore.retentionFile);
    }

    handleSubmit = (e) => {
        e.preventDefault()

        if (this.joinFile.current.files.length <= 0 ){
            NotificationManager.error('Прикрепите пожалуйста заявление на вступление')
        }else if (this.retentionFile.current.files.length <= 0) {
            NotificationManager.error('Прикрепите пожалуйста заявление на удержание')
        } else{
            this.setState({ preloader: true })

            Promise.resolve(this.joinUnion()).then(() => {
              this.props.userStore.setUnionId(this.state.unionId);

              this.props.userStore.joinUnion(
                  this.props.userStore.joinFiles.join(','),
                  this.props.unionStore.industry.resource_id,
                  () => {

                  this.setState({
                      preloader: false,
                      modalIsOpen: true
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
                      CookieService.remove('token')
                      this.setState({ preloader: false })
                      this.props.history.push('/auth')
                  }
              })
            })
        }

    }

    closeModal = () => {
        this.setState({
            modalIsOpen: false,
        })
    }

    changeAutoComplete(e){
        this.setState({
            value: e.target.value
        })

        if (this.state.value.length > 2) {
            this.setState({
                isOpen: true
            }, () => {
                this.props.userStore.loadUnionsList(
                    this.state.value,
                    () => {})
            })
        }else {
            this.setState({
                isOpen: false
            })
        }
    }

    render() {

        return (
            <Layout title={'Вступить в профсоюз'}>
                <div className='step step-organization'>
                    {
                        this.state.preloader &&
                        <Preloader/>
                    }
                    <NotificationContainer/>
                    <form className="form" onSubmit={ this.handleSubmit } style={{ marginBottom: '120px' }}>
                        <div className="logo-wrapper">
                            <LogoIcon/>
                        </div>

                        <label>
                            <Link to={"/enter-to-union/places"}>
                                <div className="doc" style={{ display: 'flex', justifyContent: 'space-between', alignItems: "center" }}>
                                    <span className="title" style={{ color: "#9A9B9C" }}>
                                        { this.props.unionStore.place.name ?
                                            this.props.unionStore.place?.name
                                            : this.props.userStore.languageList["Город/область"] || 'Город/область'
                                        }
                                    </span>
                                    <div className="icon" style={{ display: 'block' }} >
                                        <RightIcon />
                                    </div>
                                </div>
                            </Link>
                        </label>

                        <label>
                            <p className="label" style={{ marginTop: 50 }}>{this.props.userStore.languageList["Первичная организация"] || 'Первичная организация'} <span>*</span></p>
                            <ReactAutocomplete
                                items={this.props.userStore.unionsList}
                                getItemValue={item => item.name}
                                shouldItemRender={(item, value) => item.name.toLowerCase().indexOf(value.toLowerCase()) > -1}
                                wrapperStyle={{ width: "100%", position: "relative" }}
                                menuStyle={{
                                    height: 350,
                                    border: "1px solid #eee",
                                    zIndex: 1,
                                    position: "absolute",
                                    overflowY: "scroll",
                                    backgroundColor: "#ffffff",
                                    top: 40,
                                    left: 0
                                }}
                                renderItem={(item, highlighted) =>
                                    <div
                                        key={item.resource_id}
                                        style={{ backgroundColor: highlighted ? '#eee' : 'transparent' }}
                                    >
                                        {item.name}
                                    </div>
                                }
                                value={this.state.value}
                                onChange={ this.changeAutoComplete }
                                open={this.state.isOpen}
                                onSelect={(value, item) => this.setState({value: value, unionId: item.resource_id, industryName: item.industry?.name, unionName: item.root_union?.name, isOpen: false}, () => { this.unionChange() } ) }
                            />
                        </label>
                        <a ref={ this.industryRef } className='industry-association'>{ this.state.industryName }</a>

                        <br/>

                        <a ref={ this.unionRef } className='industry-association'>{ this.state.unionName }</a>

                        <br/>

                        <label>
                            <a href={this.props.unionStore.unions.entry_sample ? this.props.unionStore.unions.entry_sample.uri : "#"} >
                                <div className="doc" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span className="title">
                                    {
                                        this.props.unionStore.unions.entry_sample ?
                                        this.props.unionStore.unions.entry_sample?.name
                                            : this.props.userStore.languageList["Образец на вступление"] || 'Образец на вступление'
                                    }
                                </span>
                                    <div className="icon" style={{ display: 'block' }} >
                                        <DownloadIcon />
                                    </div>
                                </div>
                            </a>
                        </label>
                        <br/>
                        <label>
                            <a href={this.props.unionStore.unions.hold_sample ? this.props.unionStore.unions.hold_sample.uri : "#"} >
                                <div className="doc" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span className="title">
                                    {
                                        this.props.unionStore.unions.hold_sample ?
                                            this.props.unionStore.unions.hold_sample?.name
                                            : this.props.userStore.languageList["Образец на удержание"] || 'Образец на удержание'
                                    }
                                </span>
                                    <div className="icon" style={{ display: 'block' }} >
                                        <DownloadIcon />
                                    </div>
                                </div>
                            </a>
                        </label>

                        <label className={'statement__margin'}>
                            <div className="doc">
                            <span className="title">
                                {
                                    this.props.userStore.joinFile.name
                                }
                            </span>
                                <input type="file" name="doc_one"
                                       ref={this.joinFile}
                                       onChange={this.joinFileUpload}
                                />
                                <div className="icon">
                                    <DeleteIcon/>
                                </div>
                            </div>
                        </label>
                        <label className={'statement__margin'}>
                            <div className="doc">
                            <span className="title">
                                {
                                    this.props.userStore.retentionFile.name
                                }
                            </span>
                                <input type="file" name="doc_two"
                                       ref={this.retentionFile}
                                       onChange={this.retentionFileUpload}
                                />
                                <div className="icon">
                                    <DeleteIcon/>
                                </div>
                            </div>
                        </label>
                        <button type='submit'>{this.props.userStore.languageList["Вступить"] || 'Вступить'}</button>
                    </form>
                    {
                        this.state.modalIsOpen &&
                        <ModalEnterToUnion
                            closeModal={this.closeModal}
                            number={this.props.requestId}
                        />
                    }
                </div>
            </Layout>
        )
    }
}


export default inject('userStore', 'unionStore', 'permissionsStore')(observer(UnionJoin));
