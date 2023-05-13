import React, { useContext, useEffect, useCallback, useState } from "react";
import {
    Avatar,
    Menu,
    MenuItem,
    Tooltip,
    IconButton,
    // Divider,
} from '@mui/material';
import Logout from '@mui/icons-material/Logout';
import ListItemIcon from '@mui/material/ListItemIcon';
import TheaterComedyIcon from '@mui/icons-material/TheaterComedy';
import * as Sentry from "@sentry/react";

import { Context } from 'State/StateProvider';
import { Logout as InternalLogout, ShowLogin } from 'Auth';
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
        InternalLogout();

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

            let superuser = res.data.Context.Superuser;
            if (superuser) {
                Sentry.setTag("ongoing.superuser", superuser);
            }

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

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
  
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
                    <Tooltip title="Account settings">
                        <IconButton
                            onClick={handleClick}
                            size="small"
                            sx={{ ml: 2 }}
                            aria-controls={open ? 'account-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                        >
                            {!sessionViewAsId ?
                                <Avatar src = {state.Session.PhotoURL}
                                        alt = {state.Session.Name} 
                                        sx  = {{ width: 38, height: 38 }} />
                            :
                            <Avatar sx = {{
                                width: 38,
                                height: 38,
                                bgcolor: '#882D60',
                            }}>
                                <TheaterComedyIcon />
                            </Avatar>
                            }
                        </IconButton>
                    </Tooltip>

                    <Menu
                        anchorEl={anchorEl}
                        id="account-menu"
                        open={open}
                        onClose={handleClose}
                        onClick={handleClose}
                        PaperProps={{
                            elevation: 0,
                            sx: {
                                overflow: 'visible',
                                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                mt: 1.5,
                                '& .MuiAvatar-root': {
                                    width: 32,
                                    height: 32,
                                    ml: -0.5,
                                    mr: 1,
                                },
                                '&:before': {
                                    content: '""',
                                    display: 'block',
                                    position: 'absolute',
                                    top: 0,
                                    right: 14,
                                    width: 10,
                                    height: 10,
                                    bgcolor: 'background.paper',
                                    transform: 'translateY(-50%) rotate(45deg)',
                                    zIndex: 0,
                                },
                            },
                        }}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                        <MenuItem onClick={_logout}>
                            <ListItemIcon>
                                <Logout fontSize="small" />
                            </ListItemIcon>
                            {sessionViewAsId ? 'Stop viewing as ' : 'Log out'} {state.Session.Email}
                        </MenuItem>
                    </Menu>

                </>
            }
        </div>
    )
}

export default AuthControl;
