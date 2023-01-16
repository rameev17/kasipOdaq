import React, {Component} from 'react'
import './index.scss'

import {ReactComponent as CloseIcon} from '../../assets/icons/delete.svg';
import {ReactComponent as CameraIcon} from '../../assets/icons/camera.svg'

class UserProfile extends Component {

    constructor(props) {
        super(props);

        this.state = {

        }

        this.fileUpload = React.createRef()




    }

    handleInputChange = (e) => {
        this.setState({
            buffer: '',
            [e.target.name]: e.target.value
        })
    }

    handleChangePhone = value => {
        this.setState({
            phone: value
        })
    }

    handleInputFocus = (e) => {
        this.setState({
            buffer: e.target.value,
            [e.target.name]: ''
        })
    }

    handleInputBlur = (e) => {

        if (this.state.buffer.length > 0) {
            this.setState({
                buffer: '',
                [e.target.name]: this.state.buffer
            })
        }
    }

    handleSetImage = () => {
        this.fileInput.click()
    }

    render() {
        return (
            <div className={'profile__wrapper is-visible'}>
                <div className="profile-sidebar-top">
                    <span>
                        Ваш профиль
                    </span>
                    <div className="close-profile-sidebar" onClick={this.props.toggleProfile}>
                        <CloseIcon/>
                    </div>
                </div>
                <div className="profile__image">
                    <div className="ps-avatar-image"
                         style={{background: (this.props.userStore.profile.picture_uri ? `url(${this.props.userStore.profile.picture_uri}) no-repeat center center/ cover` : '')}}
                    >
                        {
                            !this.props.userStore.profile.picture_uri &&
                            `${this.props.userStore.profile.first_name[0]} ${this.props.userStore.profile.family_name[0]}`
                        }
                    </div>
                    <div className="upload-image-btn" onClick={this.handleSetImage}>
                        <CameraIcon/>
                    </div>
                </div>
                <form>
                    <input type="file"  ref={this.fileUpload} accept=".jpg, .jpeg, .png"
                    />
                    <div className="profile__form">
                        <label>
                            <span className="label">
                                Имя
                            </span>
                            <input type="text"
                                   placeholder="Заполните поле"
                                   name='first_name'
                                   value={this.props.userStore.profile.first_name}
                            />
                        </label>
                        <label>
                            <span className="label">
                                Фамилия
                            </span>
                            <input type="text"
                                   placeholder="Заполните поле"
                                   name='last_name'
                                   value={this.props.userStore.profile.family_name}
                            />
                        </label>
                        <label>
                            <span className="label">
                                Отчество
                            </span>
                            <input type="text"
                                   placeholder="Заполните поле"
                                   name='middle_name'
                                   value={this.props.userStore.profile.patronymic}
                            />
                        </label>
                        <label>
                            <span className="label">
                                Дата рождения
                            </span>
                            <input type="text"
                                   placeholder="Заполните поле"
                                   name='middle_name'
                                   disabled
                                   value={this.props.userStore.profile.birthday}
                            />
                        </label>
                        <label>
                            <span className="label">
                                Email
                            </span>
                            <input type="text"
                                   placeholder="Ваш E-mail"
                                   name="email"
                                   value={this.props.userStore.profile.email}
                                   disabled
                            />
                        </label>
                        <label>
                            <span className="label">
                                Телефон
                            </span>
                            <input type="text"
                                   placeholder="Ваш E-mail"
                                   name="email"
                                   value={this.props.userStore.profile.phone}
                                   disabled
                            />
                        </label>
                    </div>
                    <div className="profile-edit-buttons">
                        <button onClick={this.props.toggleProfile}>Отмена</button>
                        <button type="submit">Сохранить</button>
                    </div>
                </form>
            </div>
        )
    }
}

export default UserProfile;