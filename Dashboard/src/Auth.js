// import { useContext } from "react";

import firebase from 'firebase/compat/app';
import 'firebaseui/dist/firebaseui.css'

import { OFFLINE_AUTH } from 'App';

export function ShowLogin(callback) {
    if (OFFLINE_AUTH) {
        let email = localStorage.getItem('email');
        if (!email) {
            email = prompt('Enter email for auth bypass');
            localStorage.setItem('email', email);
        }
        callback(email, email, 'Darren', null);
        return;
    }

    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            user.getIdToken(/* forceRefresh */ true).then((idToken) => {
                console.log('getIdToken:',idToken)
                // Call loginFn in AuthControl.js
                callback(idToken, user.email, user.displayName, user.photoURL);
            }).catch(function (error) {
                console.log('error', error);
            });
        }
    });
}

export function Logout() {
    if (OFFLINE_AUTH) {
        localStorage.clear();
        return;
    }
    firebase.auth().signOut();
}

// css in App.css
export const ForceRefresh = () => (
    <div id='auth-refresh'>
        <div className='auth-refresh-background' />
        <div className='auth-refresh-content'>
            <p>
                Your session has expired - please reload the page
            </p>
            <button onClick={() => {
                window.location.reload();
            }}>
                Reload
            </button>
        </div>
    </div>
);
