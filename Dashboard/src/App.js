import React from "react";
import axios from 'axios';

import {
    BrowserRouter as Router,
} from "react-router-dom";

import AppDrawer from 'components/AppDrawer'
import StateProvider from 'State/StateProvider'
// import { Logout } from './Auth';

import './App.css';

export const ONGOING_DASHBOARD_URL = 'http://ongoing.tp1.org:3000';
const ONGOING_API_URL = 'http://api.ongoing.localhost:8000';

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
