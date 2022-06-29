import React, { useContext, useEffect, useCallback } from "react";
import {
    Avatar,
    Button,
} from '@mui/material';

import { Context } from 'State/StateProvider';
import { Logout, ShowLogin } from 'Auth';
import { LOGOUT } from 'State/Reducer';

// Keep in sync with ApiServer/src/ApiServer/Auth.go
export const UserType = {
    UserTypeUnauthenticated: 'unauthenticated',
    UserTypeAdmin:           'admin',
    UserTypeAdvisor:         'advisor',
    UserTypeClient:          'client',
};

// <AuthControl /> renders either a login button or a logout button.
function AuthControl() {
    const [ state, dispatch ] = useContext(Context);

    const _logout = useCallback(() => {
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
    }, [ dispatch ]);

    const loginFn = useCallback((token, user) => { //email, name, photoURL) => {
        window.ApiClient.defaults.headers.common['Authentication'] = token;

        window.ApiClient.get(`/common/user`, {
            baseURL: window.Config.ApiHost,
        }).then(res => {
            dispatch({
                type: 'LOGIN',
                payload: {
                    Auth: {
                        user,  // Duplicated by window.user from Auth.js ShowLogin() -> onIdTokenChanged()
                        UserType: res.data.UserType,
                    }
                },
            });
        })
        .catch(e => {
            _logout();
        });
    }, [ dispatch, _logout ]);

    useEffect(() => {
        if (!state.Auth) {
            ShowLogin(loginFn);
        }
    }, [ loginFn, state.Auth ]);

    // Fire a request to see if the session has expired (will trigger the auth-refresh pane)
    window.onfocus = () => {
        if (state.Auth && state.Auth.UserType !== 'anonymous') {
            state.Auth.user.getIdToken(true).then((idToken) => {
                loginFn(idToken, state.Auth.user);
            }).catch(function (error) {
                console.log('error', error);
            });
        }
    };    

    return (
        <div>
            <div id    = "firebaseui-container"
                 style = {{ display: state.Auth ? 'none' : 'block' }} />

            {state.Auth &&
                <>
                    <Button onClick={_logout} variant="h6">
                        Log out {state.Auth.user.email}
                    </Button>

                    <Avatar src     = {state.Auth.user.photoURL}
                            alt     = {state.Auth.user.name}
                            style   = {{ display: 'inline-block', verticalAlign: 'bottom' }} />
                </>
            }
        </div>
    )
}

export default AuthControl;
