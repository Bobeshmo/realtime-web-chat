import React, {Component} from 'react'
import ReactLoading from 'react-loading'
import {withRouter} from 'react-router-dom'
import WelcomeBoard from '../WelcomeBoard/WelcomeBoard'
import ChatBoard from './../ChatBoard/ChatBoard'
import Images from "../Themes/Images";
import {AppString} from '../Const'
import app from '../../base'
import './Main.css'

class Main extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            isOpenDialogConfirmLogout: false,
            currentPeerUser: null
        }
        this.currentUserId = localStorage.getItem(AppString.ID)
        this.currentUserAvatar = localStorage.getItem(AppString.PHOTO_URL)
        this.currentUserNickname = localStorage.getItem(AppString.NICKNAME)
        this.listUser = []
    }

    componentDidMount() {
        this.checkLogin()
    }

    checkLogin = () => {
        if (!localStorage.getItem(AppString.ID)) {
            this.setState({isLoading: false}, () => {
                this.props.history.push('/')
            })
        } else {
            this.getListUser().then()
        }
    }

    getListUser = async () => {
        const result = await app.firestore().collection(AppString.NODE_USERS).get()
        if (result.docs.length > 0) {
            this.listUser = [...result.docs]
            this.setState({isLoading: false})
        }
    }

    onLogoutClick = () => {
        this.setState({
            isOpenDialogConfirmLogout: true
        })
    }

    doLogout = () => {
        this.setState({isLoading: true})
        app
            .auth()
            .signOut()
            .then(() => {
                this.setState({isLoading: false}, () => {
                    localStorage.clear()
                    this.props.showToast(1, 'Logout success')
                    this.props.history.push('/')
                })
            })
            .catch(function (err) {
                this.setState({isLoading: false})
                this.props.showToast(0, err.message)
            })
    }

    hideDialogConfirmLogout = () => {
        this.setState({
            isOpenDialogConfirmLogout: false
        })
    }

    onProfileClick = () => {
        this.props.history.push('/profile')
    }

    renderListUser = () => {
        if (this.listUser.length > 0) {
            let viewListUser = []
            this.listUser.forEach((item, index) => {
                if (item.data().id !== this.currentUserId) {
                    viewListUser.push(
                        <button
                            key={index}
                            className={
                                this.state.currentPeerUser &&
                                this.state.currentPeerUser.id === item.data().id
                                    ? 'viewWrapItemFocused'
                                    : 'viewWrapItem'
                            }
                            onClick={() => {
                                this.setState({currentPeerUser: item.data()})
                            }}
                        >
                            <img
                                className="viewAvatarItem"
                                src={item.data().photoUrl}
                                alt="icon avatar"
                            />
                            <div className="viewWrapContentItem">
                                <span className="textItem">
                                    {`Пользователь: ${item.data().nickname}`}
                                </span>
                                <span className="textItem">
                                    {
                                        `Информация: ${item.data().aboutMe ?
                                            item.data().aboutMe :
                                            'Нет информации'}`
                                    }
                                </span>
                            </div>
                        </button>
                    )
                }
            })
            return viewListUser
        } else {
            return null
        }
    }

    render() {
        return (
            <div className="root">
                {/* Шапка */}
                <div className="header">
                    <span>Добро пожаловать в WEB CHAT</span>
                    <img
                        className="icProfile"
                        alt="An icon default avatar"
                        src={Images.ic_default_avatar}
                        onClick={this.onProfileClick}
                    />
                    <img
                        className="icLogout"
                        alt="An icon logout"
                        src={Images.ic_logout}
                        onClick={this.onLogoutClick}
                    />
                </div>

                {/* Тело */}
                <div className="body">
                    <div className="viewListUser"> {this.renderListUser()}</div>
                    <div className="viewBoard">
                        {this.state.currentPeerUser ? (
                            <ChatBoard
                                currentPeerUser={this.state.currentPeerUser}
                                showToast={this.props.showToast}
                            />
                        ) : (
                            <WelcomeBoard
                                currentUserNickname={this.currentUserNickname}
                                currentUserAvatar={this.currentUserAvatar}
                            />
                        )}
                    </div>
                </div>

                {/* Диалог подтверждения */}
                {this.state.isOpenDialogConfirmLogout ? (
                    <div className="viewCoverScreen">
                        {this.renderDialogConfirmLogout()}
                    </div>
                ) : null}

                {/* Загрузка */}
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
        )
    }

    renderDialogConfirmLogout = () => {
        return (
            <div>
                <div className="viewWrapTextDialogConfirmLogout">
                    <span className="titleDialogConfirmLogout">Вы уверены?</span>
                </div>
                <div className="viewWrapButtonDialogConfirmLogout">
                    <button className="btnYes" onClick={this.doLogout}>
                        Да
                    </button>
                    <button className="btnNo" onClick={this.hideDialogConfirmLogout}>
                        Нет
                    </button>
                </div>
            </div>
        )
    }
}

export default withRouter(Main)
