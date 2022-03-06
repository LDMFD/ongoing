// import { useContext } from "react";

import firebase from 'firebase/compat/app';
import * as firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'

export const DEV = true;

const FirebaseUiConfig = {
    signInFlow: 'redirect',
    signInOptions: [
        {
            provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            clientId: "861652755190-ofdm15tpmlq7p0bdjh58v1pqjjdu33iu.apps.googleusercontent.com"
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

const firebaseConfig = {
    apiKey: "AIzaSyDTz8U1NAdF3GDEPgM1OQ1QFuL73M21xm8",
    authDomain: "ongoing-test.firebaseapp.com",
    projectId: "ongoing-test",
    storageBucket: "ongoing-test.appspot.com",
    messagingSenderId: "861652755190",
    appId: "1:861652755190:web:788547632bfc35f88602d7",
    measurementId: "G-NXWP2MYJ02"
};

if (!DEV) {
    firebase.initializeApp(firebaseConfig);
    const authUI = new firebaseui.auth.AuthUI(firebase.auth());
    authUI.disableAutoSignIn();

    authUI.start('#firebaseui-container', FirebaseUiConfig);
}

export function ShowLogin(callback) {
    if (DEV) {
        let email = localStorage.getItem('email');
        if (!email) {
            email = prompt('email');
            localStorage.setItem('email', email);
        }
        callback(email, email, 'Darren', null);
        return;
    }

    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            user.getIdToken(/* forceRefresh */ true).then((idToken) => {
                callback(idToken, user.email, user.displayName, user.photoURL);
            }).catch(function (error) {
                console.log('error', error);
            });
        }
    });
}

export function Logout() {
    if (DEV) {
        localStorage.clear();
        return;
    }
    firebase.auth().signOut();
}
