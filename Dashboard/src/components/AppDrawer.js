import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    Box,
    Drawer,
    CssBaseline,
    AppBar,
    Toolbar,
    List,
    Typography,
    Divider,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

import './AppDrawer.css';

import Routes from './Routes';
import AuthControl from './AuthControl';
import { Context } from 'State/StateProvider';
import InitialState from "State/InitialState";
import { FromCanonical } from 'Utils/DateTime';

const advisorItems = [
    {
        label: 'Clients',
        link: '/clients',
    },
    {
        label: 'Funds',
        link: '/funds',
    },
    {
        label: 'Models',
        link: '/models',
    },
    {
        label: 'Model Operators',
        link: '/operators',
    },
    {
        label: 'Policy Types',
        link: '/policy-types',
    },
    {
        label: 'Policy Providers',
        link: '/policy-providers',
    },
    {
        label: 'Risk Providers',
        link: '/risk-providers',
    },
];

const Items = {
    'anonymous': [],
    'advisor': advisorItems,
    'admin': advisorItems.concat([
        {
            label: 'Module Presets',
            link: '/review-config/module-presets',
        },
        // {
        //     label: 'Users',
        //  
        //     link: '/users',
        // },
    ]),
    'client': [
        {
            label: 'All reviews',
            link: '/client-space/reviews',
        },
    ],
};

export default function PermanentDrawerLeft() {
    const [state] = useContext(Context);

    let location = useLocation();

    if (!state.Auth) {
        return (
            <>
                <br /><br /><br /><br /><br /><br />
                <AuthControl />
            </>
        );
    }
    
    let regex = /reviews\/(?<reviewId>[0-9a-f]{32})\/(?<tail>.*)/;
    let res = location.pathname.match(regex);

    let items = Items[state.Auth.UserType];

    if (state.Auth.UserType === 'client') {
        items = items.concat(state.Reviews?.map(review => {
            let to = FromCanonical(review.Meta.EndDate)?.toLocaleDateString('en-GB');
            let tail = res?.groups?.tail || 'modules/introduction';
            return {
                label: `Review period ending ${to}`,
                link: `/client-space/reviews/${review.Id}/${tail}`,
                date: review.Meta.EndDate,
            };
        }).sort((p,q) => (p.date < q.date) ? 1 : ((p.date > q.date) ? -1 : 0)));
    }

    const drawerWidth = state.Auth.UserType === 'client' ? 360 : 240;

    const drawerStyles = {
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
        },
    };
    
    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />

            <AppBar position = "fixed"
                    sx       = {{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}>
                <Toolbar>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        {state.Auth.UserType === 'client'
                            ? 'Amplifa Client Portal'
                            : 'Amplifa Advisor Portal'}
                    </Typography>
                    
                    <AuthControl />
                </Toolbar>
            </AppBar>

            <Drawer sx      = {drawerStyles}
                    variant = "permanent"
                    anchor  = "left">
                <Toolbar />
                <Divider />
                
                <List>
                    {items.map(item => item && (
                        <Link to={item.link} key={item.label}>
                            <ListItemButton selected={location.pathname.startsWith(item.link)}>
                                <ListItemIcon>
                                    {item.icon}
                                </ListItemIcon>

                                <ListItemText primary={
                                    item.label
                                } />
                            </ListItemButton>
                        </Link>
                    ))}
                </List>
            </Drawer>

            <Box component = "main"
                 sx        = {{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>

                <Toolbar />

                <InitialState>
                    <Routes />
                </InitialState>
            </Box>

            <div className='request-spinner'>
                <CircularProgress />
            </div>
        </Box>
    );
}
