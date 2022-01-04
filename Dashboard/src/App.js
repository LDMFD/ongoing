import React from "react";
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
    // withCredentials: true,
});

// TODO check https://stackoverflow.com/a/59693754
window.ApiClient.interceptors.response.use((response) => response, (err) => {
    if (err.response && err.response.data) {
        console.log(err.response.data.error);
        alert(err.response.data.error);
    }
    throw err;  // get "VM4912:2 Uncaught ReferenceError: process is not defined" without this
});

function App() {
    return (
        <Store>
            <div className="app">
                <Router>
                    <AppDrawer />
                </Router>
            </div>
        </Store>
    );
}

export default App;
