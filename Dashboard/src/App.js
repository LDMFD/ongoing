import React from "react";
import axios from 'axios';

import {
    BrowserRouter as Router,
} from "react-router-dom";

import * as firebaseui from 'firebaseui'
import firebase from 'firebase/compat/app';
import json5 from 'json5';

import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

import AppDrawer from 'Components/AppDrawer'
import StateProvider from 'State/StateProvider'

import { createTheme, ThemeProvider } from '@mui/material/styles';

import './App.css';

import { ForceRefresh } from "Auth";
import { AccessViolation, IntegrityViolation, InternalError, InvalidInput, NotFound, UniqueViolation } from "Errors";

// Dev mode - see DashboardServer/server.js for live/cloud version
if (window.Config === '__CONFIG_EMBED__') {
    let firebaseConfigB64 = atob(process.env.REACT_APP_ONGOING_REACT_FIREBASE_CONFIG);
    window.Config = {
        ApiHost: process.env.REACT_APP_ONGOING_API_HOST,
        SentryDsn: process.env.REACT_APP_ONGOING_SENTRY_DSN,
        DashboardHost: process.env.REACT_APP_ONGOING_DASHBOARD_HOST,
        FirebaseClientId: process.env.REACT_APP_ONGOING_REACT_FIREBASE_CLIENT_ID,
        FirebaseConfig: json5.parse(firebaseConfigB64),
        Release: 'dev',
        Env: 'dev',
    };
}

Sentry.init({
    dsn: window.Config.SentryDsn,
    release: window.Config.Release,
    integrations: [new BrowserTracing()],
    tracesSampleRate: 1.0,
});
  
// Bypass Firebase
export const OFFLINE_AUTH = process.env.REACT_APP_ONGOING_AUTH_BYPASS === 'true';

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
    // authUI.disableAutoSignIn();

    authUI.start('#firebaseui-container', FirebaseUiConfig);
}

window.ApiClient = axios.create({
    baseURL: window.Config.ApiHost,
    // withCredentials: true,
});

// <a> -> query param -> localStorage -> http client header
if (window.location.search) {
    const vid = (new URLSearchParams(window.location.search)).get('view-as');
    if (vid) {
        window.ApiClient.defaults.headers.common['X-ViewAs'] = vid;
        localStorage.setItem('ongoing-viewas', vid);
    }
} else {
    const vid = localStorage.getItem('ongoing-viewas');
    if (vid) {
        window.ApiClient.defaults.headers.common['X-ViewAs'] = vid;
    }
}

let ConcurrentRequestCount = 0;

// TODO Refactor to Spinner.js and .css (see AppDrawer.js & .css)
function ShowSpinner() {
    if (++ConcurrentRequestCount > 0) {
        document.querySelectorAll('.request-spinner')?.forEach(element => {
            element.style.display = 'block';
        });
    }
}

function HideSpinner() {
    if (--ConcurrentRequestCount <= 0) {
        document.querySelectorAll('.request-spinner')?.forEach(element => {
            element.style.display = 'none';
        });
    }
}

window.ApiClient.interceptors.request.use((config) => {
    ShowSpinner();

    window.user?.getIdToken(false).then((idToken) => {
        window.ApiClient.defaults.headers.common['Authentication'] = idToken;
    }).catch(function (error) {
        console.log('error', error);
    });

    return config;
}, (err) => {
    HideSpinner();
    return Promise.reject(err);
});

// TODO check https://stackoverflow.com/a/59693754
window.ApiClient.interceptors.response.use((response) => {
    HideSpinner();
    return response;
}, (err) => {
    HideSpinner();
    console.log(`error: ${err}`);
    const str = err.toString();

    if (err?.response?.status === 403) {
        console.log(403);

        document.getElementById('auth-refresh').style.display = 'block';

        throw err;  // prevent goBack() on error
    }

    const responseError = err?.response?.data;

    if (typeof responseError == 'object') {  // explicit error returned from command handler
        switch (responseError.error) {
            case NotFound:
                alert("The resource was not found.");
                break;
            case AccessViolation:
                alert("You do not have permission to access this resource.");
                break;
            case InternalError:
                console.log("Internal error: " + responseError.trace);
                Sentry.setTag('ongoing.trace', responseError.trace);
                alert("An internal error has occurred (this has been reported - trace ID: " + responseError.trace + ").");
                break;
            case UniqueViolation:
            case IntegrityViolation:
            case InvalidInput:
                return responseError;
            default:
                alert(`Error: ${responseError.error}`);
        }
    } else {
        alert(str);
        console.log(`response error: ${str}`);
    }

    throw err;  // prevent goBack() on error
});

function FallbackComponent() {
    return (
        <div style={{
            textAlign: 'center',
            paddingTop: '40vh',
        }}>
            An error has occurred - please <a href="/">start again</a>.
        </div>
    );
}
  
const myFallback = <FallbackComponent />;

const theme = createTheme({
    palette: {
        primary: {
            main: '#004400',
        },
    },
});

function App() {
    return (
        <Sentry.ErrorBoundary fallback={myFallback} showDialog>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <StateProvider>
                    <Router>
                        <ThemeProvider theme={theme}>
                            <AppDrawer />
                        </ThemeProvider>
                    </Router>

                    <ForceRefresh />
                </StateProvider>
            </LocalizationProvider>
        </Sentry.ErrorBoundary>
    );
}

export default App;
