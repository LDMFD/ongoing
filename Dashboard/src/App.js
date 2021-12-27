import React, { useContext, useCallback } from "react";
import { Context } from './Store';
import axios from 'axios';

import {
    BrowserRouter as Router,
} from "react-router-dom";

import AppDrawer from './components/AppDrawer'
import Store from './Store'

import './App.css';

const ONGOING_API_URL = 'http://api.ongoing.localhost:8000/';

window.ApiClient = axios.create({
    baseURL: ONGOING_API_URL,
    withCredentials: true,
});

// TODO check https://stackoverflow.com/a/59693754
window.ApiClient.interceptors.response.use((response) => response, (err) => {
    if (err.response && err.response.data) {
        console.log(err.response.data.error);
        alert(err.response.data.error);
    }
    throw err;  // get "VM4912:2 Uncaught ReferenceError: process is not defined" without this
});

export function IdentityListener() {
    const [, dispatch] = useContext(Context);

    window.IdentityHandler = useCallback((token) => {
        console.log(token.credential);
        window.ApiClient = axios.create({
            baseURL: ONGOING_API_URL,
            withCredentials: true,
            headers: {
                'Authentication': token.credential,
            },
        });
        dispatch({
            type: 'USER_LOGGED_IN',
            payload: {
                loggedIn: true,
            },
        });
    }, [dispatch]);

    return null;
}

function Login() {
    return (
        <div className="g_id_signin"
            data-type="standard"
            data-size="large"
            data-theme="outline"
            data-text="sign_in_with"
            data-shape="rectangular"
            data-logo_alignment="left">
        </div>
    );
}
  
function AuthScreen() {
    const [state] = useContext(Context);
    return state.loggedIn    || true
        ? <AppDrawer />
        : <Login />
}

function App() {
    return (
        <Store>
            <IdentityListener />
            <div className="app">
                <Router>
                    <AuthScreen />
                </Router>
            </div>
        </Store>
    );
}

export default App;
