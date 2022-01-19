import React, { useContext, useEffect, useCallback } from "react";
import {
    Avatar,
    Button,
} from '@mui/material';

import { Context } from '../Store';
import { Logout, ShowLogin } from '../Auth';
import { LOGOUT } from '../Reducer';

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

    const loginFn = useCallback((token, name, photoURL) => {
        window.ApiClient.defaults.headers.common['Authentication'] = token;

        window.ApiClient.get(`/user`)
            .then(() => {
                dispatch({
                    type: 'LOGIN',
                    payload: {
                        loggedIn: true,
                        auth: {
                            token,
                            name,
                            photoURL,
                        }
                    },
                });
            })
            .catch(e => {
                _logout();
            });
    }, [ dispatch, _logout ]);

    useEffect(() => {
        ShowLogin(loginFn);
    }, [ loginFn ]);

    return (
        <div>
            <div id    = "firebaseui-container"
                 style = {{ display: state.auth ? 'none' : 'block' }} />

            {state.auth &&
                <>
                    <Button onClick={_logout} variant="h6">
                        Log out
                    </Button>

                    <Avatar src     = {state.auth.photoURL}
                            alt     = {state.auth.name}
                            style   = {{ display: 'inline-block', verticalAlign: 'bottom' }} />
                </>
            }
        </div>
    )
}

export default AuthControl;
