import React, { Component } from 'react'
import './WelcomeBoard.css'

export default class WelcomeBoard extends Component {
    render() {
        return (
            <div className="viewWelcomeBoard">
                <span
                    className="textTitleWelcome"
                >
                    {`Добро пожаловать, ${this.props.currentUserNickname}`}
                </span>
                <img
                    className="avatarWelcome"
                    src={this.props.currentUserAvatar}
                    alt="icon avatar"
                />
                <span className="textDescriptionWelcome">Давайте уже быстрее начнём беседу!</span>
            </div>
        )
    }
}
