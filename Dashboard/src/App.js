import React from "react";
import axios from 'axios';

import {
    BrowserRouter as Router,
} from "react-router-dom";

import AppDrawer from 'Components/AppDrawer'
import StateProvider from 'State/StateProvider'

import './App.css';
import { ForceRefresh } from "Auth";

import * as firebaseui from 'firebaseui'
import firebase from 'firebase/compat/app';
import json5 from 'json5';

if (window.Config === '__CONFIG_EMBED__') {
    let firebaseConfigB64 = atob(process.env.REACT_APP_ONGOING_REACT_FIREBASE_CONFIG);
    window.Config = {
        ApiHost: process.env.REACT_APP_ONGOING_API_HOST,
        DashboardHost: process.env.REACT_APP_ONGOING_DASHBOARD_HOST,
        FirebaseClientId: process.env.REACT_APP_ONGOING_REACT_FIREBASE_CLIENT_ID,
        FirebaseConfig: json5.parse(firebaseConfigB64),
    };
}

// Bypass Firebase
export const OFFLINE_AUTH = false;

const FirebaseUiConfig = {
    signInFlow: 'redirect',
    signInOptions: [
        {
            provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            clientId: window.Config.FirebaseClientId,
        },
        {
            provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
            requireDisplayName: true,
            signInMethod: 'emailLink', // or 'password'
        },
    ],
    callbacks: {
        signInSuccessWithAuthResult: () => false,  // don't redirect
    },
    tosUrl: '/terms',
    privacyPolicyUrl: '/privacy',
};

if (!OFFLINE_AUTH) {
    firebase.initializeApp(window.Config.FirebaseConfig);
    const authUI = new firebaseui.auth.AuthUI(firebase.auth());
    authUI.disableAutoSignIn();

    authUI.start('#firebaseui-container', FirebaseUiConfig);
}

window.ApiClient = axios.create({
    baseURL: window.Config.ApiHost,
    // withCredentials: true,
});

// TODO check https://stackoverflow.com/a/59693754
window.ApiClient.interceptors.response.use((response) => response, (err) => {
    console.log(`error: ${err}`);

    const str = err.toString();

    if (err?.response?.status === 403) {
        console.log(403);

        document.getElementById('auth-refresh').style.display = 'block';

        throw err;  // prevent goBack() on error
    }

    const responseError = err?.response?.data;

    if (typeof responseError == 'object') {  // explicit error returned from command handler
        alert(responseError.error);
    } else {
        alert(str);
    }

    throw err;  // prevent goBack() on error
});    

function App() {
    return (
        <StateProvider>
            <Router>
                <AppDrawer />
            </Router>

            <ForceRefresh />
        </StateProvider>
    );
}

export default App;
