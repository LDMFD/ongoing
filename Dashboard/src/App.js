import React from "react";
import axios from 'axios';

import {
    BrowserRouter as Router,
} from "react-router-dom";

import AppDrawer from 'Components/AppDrawer'
import StateProvider from 'State/StateProvider'
// import { Logout } from './Auth';

import './App.css';

// API server
export const ONGOING_API_URL = process.env.NODE_ENV !== 'production'
    ? 'http://localhost:8000'
    : 'https://ong-api.tp1.org';

// Link to embed in email links
export const ONGOING_DASHBOARD_URL = process.env.NODE_ENV !== 'production'
    ? 'http://localhost.ongoing.tp1.org:3000'
    : 'http://ongoing.tp1.org';

console.log(`ONGOING_API_URL: ${ONGOING_API_URL}`);

window.ApiClient = axios.create({
    baseURL: `${ONGOING_API_URL}`,
    // withCredentials: true,
});

// TODO check https://stackoverflow.com/a/59693754
window.ApiClient.interceptors.response.use((response) => response, (err) => {
    console.log(`error: ${err}`);

    const str = err.toString();

    if (err?.response?.status === 403) {
        console.log(403);
        throw err;  // prevent goBack() on error
    }
    //     // alert("Your have been logged out");
    //     Logout();
    //     if (window.ApiClient.headers) {
    //         delete window.ApiClient.headers['Authentication'];
    //     }
    //     // window.location.reload();
    //     window.location = '/';
    //     return;
    // }

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
        </StateProvider>
    );
}

export default App;
