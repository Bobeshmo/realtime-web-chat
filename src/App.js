import React from 'react';
import './App.css';
import {toast} from 'react-toastify'
import {Switch, Route} from 'react-router-dom'
import Login from './components/Login/Login'
import Main from './components/Main/Main'

function App () {

    const showToast = (type, message) => {
        // 0 = warning, 1 = success
        switch (type) {
            case 0:
                toast.warning(message)
                break
            case 1:
                toast.success(message)
                break
            default:
                break
        }
    }


    return (
        <div className="App">
            <Switch>
                <Route
                    exact
                    path="/"
                    render={props => <Login showToast={showToast} {...props} />}
                />
                <Route
                    exact
                    path="/main"
                    render={props => <Main showToast={showToast} {...props} />}
                />
            </Switch>
        </div>
    );
}

export default App;
