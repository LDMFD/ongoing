import React, { useContext, useEffect, useCallback } from "react";
import {
    Avatar,
    Button,
} from '@mui/material';
import * as Sentry from "@sentry/react";

import { Context } from 'State/StateProvider';
import { Logout, ShowLogin } from 'Auth';
import { LOGIN, LOGOUT } from 'State/Reducer';

// Keep in sync with ApiServer/src/ApiServer/Auth.go
export const UserType = {
    Superuser: 'superuser',
    OrgOwner:  'owner',
    OrgAdmin:  'administrator',
    Advisor:   'advisor',
    Client:    'client',
};

// <AuthControl /> renders either a login button or a logout button.
function AuthControl() {
    const [ state, dispatch ] = useContext(Context);

    const sessionViewAsId = localStorage.getItem('ongoing-viewas');

    const _logout = useCallback(() => {
        if (localStorage.getItem('ongoing-viewas')) {
            localStorage.removeItem('ongoing-viewas');
            window.location = '/admin/organisations/id/' + state.Session.OrgId + '/users';
            return;
        }

        // Log out of Firebase
        Logout();

        // Clear auth state
        if (window.ApiClient.headers) {
            delete window.ApiClient.headers['Authentication'];
        }
        dispatch({
            type: LOGOUT,
        });

        // Reload page
        window.location = '/';
    }, [ dispatch, state.Session ]);

    const loginFn = useCallback((token, user) => { //email, name, photoURL) => {
        window.ApiClient.defaults.headers.common['Authentication'] = token;

        window.ApiClient.get(`/user/info`, {
            baseURL: window.Config.ApiHost,
        }).then(res => {
            Sentry.setUser({ email: res.data.Context.Email });
            Sentry.setTag("ongoing.org", res.data.Context.OrgId);

            dispatch({
                type: LOGIN,
                payload: {
                    Session: {
                        PhotoURL: user.photoURL,
                        Name: user.displayName,

                        ...res.data.Context,
                    }
                },
            });
        })
        .catch(e => {
            _logout();
        });
    }, [ dispatch, _logout ]);

    useEffect(() => {
        if (!state.Session) {
            ShowLogin(loginFn);
        }
    }, [ loginFn, state.Session ]);

    // Fire a request to see if the session has expired (will trigger the auth-refresh pane)
    window.onfocus = () => {
        // if (state.Session && state.Session.UserType !== 'anonymous') {
        //     state.Session.user.getIdToken(true).then((idToken) => {
        //         loginFn(idToken, state.Session.user);
        //     }).catch(function (error) {
        //         console.log('error', error);
        //     });
        // }
    };    

    return (
        <div>
            <div id    = "firebaseui-container"
                 style = {{ display: state.Session ? 'none' : 'block' }} />

            {state.Session &&
                <>
                    <Button onClick={_logout} variant="h6">
                        {sessionViewAsId ? 'Stop viewing as ' : 'Log out'} {state.Session.Email}
                    </Button>

                    <Avatar src     = {state.Session.PhotoURL}
                            alt     = {state.Session.Name}
                            style   = {{ display: 'inline-block', verticalAlign: 'bottom' }} />
                </>
            }
        </div>
    )
}

export default AuthControl;
