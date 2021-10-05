import React from 'react';
import './App.css';
import {toast, ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {Switch, Route} from 'react-router-dom'
import Login from './components/Login/Login'
import Main from './components/Main/Main'
import Profile from "./components/Profile/Profile";

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
            <ToastContainer
                autoClose={2000}
                hideProgressBar={true}
                position={toast.POSITION.BOTTOM_CENTER}
            />
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
                <Route
                    exact
                    path="/profile"
                    render={props => <Profile showToast={showToast} {...props} />}
                />
            </Switch>
        </div>
    );
}

export default App;
