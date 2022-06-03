import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import ReactLoading from 'react-loading'
import images from './../Themes/Images'
import {AppString} from '../Const'
import app from '../../base'
import './Profile.css'

class Profile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            id: localStorage.getItem(AppString.ID),
            nickname: localStorage.getItem(AppString.NICKNAME),
            aboutMe: localStorage.getItem(AppString.ABOUT_ME),
            photoUrl: localStorage.getItem(AppString.PHOTO_URL)
        }
        this.newAvatar = null
        this.newPhotoUrl = ''
    }

    componentDidMount() {
        this.checkLogin()
    }

    checkLogin = () => {
        if (!localStorage.getItem(AppString.ID)) {
            this.props.history.push('/')
        }
    }

    onChangeNickname = event => {
        this.setState({nickname: event.target.value})
    }

    onChangeAboutMe = event => {
        this.setState({aboutMe: event.target.value})
    }

    onChangeAvatar = event => {
        if (event.target.files && event.target.files[0]) {
            // Проверяет если файл картинка
            const prefixFiletype = event.target.files[0].type.toString()
            if (prefixFiletype.indexOf(AppString.PREFIX_IMAGE) !== 0) {
                this.props.showToast(0, 'This file is not an image')
                return
            }
            this.newAvatar = event.target.files[0]
            this.setState({photoUrl: URL.createObjectURL(event.target.files[0])})
        } else {
            this.props.showToast(0, 'Something wrong with input file')
        }
    }

    uploadAvatar = () => {
        this.setState({isLoading: true})
        if (this.newAvatar) {
            const uploadTask = app.storage()
                .ref()
                .child(this.state.id)
                .put(this.newAvatar)
            uploadTask.on(
                AppString.UPLOAD_CHANGED,
                null,
                err => {
                    this.props.showToast(0, err.message)
                },
                () => {
                    uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
                        this.updateUserInfo(true, downloadURL)
                    })
                }
            )
        } else {
            this.updateUserInfo(false, null)
        }
    }

    updateUserInfo = (isUpdatePhotoUrl, downloadURL) => {
        let newInfo
        if (isUpdatePhotoUrl) {
            newInfo = {
                nickname: this.state.nickname,
                aboutMe: this.state.aboutMe,
                photoUrl: downloadURL
            }
        } else {
            newInfo = {
                nickname: this.state.nickname,
                aboutMe: this.state.aboutMe
            }
        }
        app.firestore()
            .collection(AppString.NODE_USERS)
            .doc(this.state.id)
            .update(newInfo)
            .then(() => {
                localStorage.setItem(AppString.NICKNAME, this.state.nickname)
                localStorage.setItem(AppString.ABOUT_ME, this.state.aboutMe)
                if (isUpdatePhotoUrl) {
                    localStorage.setItem(AppString.PHOTO_URL, downloadURL)
                }
                this.setState({isLoading: false})
                this.props.showToast(1, 'Update info success')
            })
    }

    render() {
        return (
            <div className="root">
                <div className="header_profile">
                    <span>Профиль</span>
                </div>
                <div className="profile_content">
                    <div className="user_img">
                        <img className="avatar" alt="Avatar" src={this.state.photoUrl}/>
                        <div className="viewWrapInputFile">
                            <img
                                className="imgInputFile"
                                alt="icon gallery"
                                src={images.ic_input_file}
                                onClick={() => this.refInput.click()}
                            />
                            <input
                                ref={el => {
                                    this.refInput = el
                                }}
                                accept="image/*"
                                className="viewInputFile"
                                type="file"
                                onChange={this.onChangeAvatar}
                            />
                        </div>
                    </div>
                    <div className="user_info">
                        <span className="textLabel">Ваш NICKNAME:</span>
                        <input
                            className="textInput"
                            value={this.state.nickname ? this.state.nickname : ''}
                            placeholder="Тут должен быть Ваш NICKNAME..."
                            onChange={this.onChangeNickname}
                        />
                        <span className="textLabel">Расскажите про себя</span>
                        <input
                            className="textInput"
                            value={this.state.aboutMe ? this.state.aboutMe : ''}
                            placeholder="Расскажите что-то про себя..."
                            onChange={this.onChangeAboutMe}
                        />

                        <button className="btnUpdate" onClick={this.uploadAvatar}>
                            Обновить
                        </button>
                    </div>


                    {this.state.isLoading ? (
                        <div className="viewLoading">
                            <ReactLoading
                                type={'spin'}
                                color={'#203152'}
                                height={'3%'}
                                width={'3%'}
                            />
                        </div>
                    ) : null}
                </div>
            </div>
        )
    }
}

export default withRouter(Profile)
