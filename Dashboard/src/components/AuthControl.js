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

    const loginFn = useCallback((token, email, name, photoURL) => {
        window.ApiClient.defaults.headers.common['Authentication'] = token;

        window.ApiClient.get(`/common/user`, {
            baseURL: 'http://api.ongoing.localhost:8000',
        }).then(res => {
            dispatch({
                type: 'LOGIN',
                payload: {
                    Auth: {
                        token,
                        email,
                        name,
                        photoURL,
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
        ShowLogin(loginFn);
    }, [ loginFn ]);

    return (
        <div>
            <div id    = "firebaseui-container"
                 style = {{ display: state.Auth ? 'none' : 'block' }} />

            {state.Auth &&
                <>
                    <Button onClick={_logout} variant="h6">
                        Log out {state.Auth.email}
                    </Button>

                    <Avatar src     = {state.Auth.photoURL}
                            alt     = {state.Auth.name}
                            style   = {{ display: 'inline-block', verticalAlign: 'bottom' }} />
                </>
            }
        </div>
    )
}

export default AuthControl;
