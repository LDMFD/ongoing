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
import AuthControl, { UserType } from './AuthControl';
import { Context } from 'State/StateProvider';
import InitialState from "State/InitialState";
import { FromCanonical } from 'Utils/DateTime';

const EnvironmentWarning = () => {
    let style = {
        color: '#882D60',
        float: 'right'
    };
    return (
        <>
            {window.location.href.includes('staging') && (
                <span style={style}>
                    <b> [ STAGING ] </b>
                </span>
            )}
            {window.location.href.includes('localhost') && (
                <span style={style}>
                    <b> [ LOCAL ]</b>
                </span>
            )}
        </>
    )
}

const tier1Items = [
    {
        label: 'Module Presets',
        link: '/review-config/module-presets',
    },
    {
        label: 'Policy Types',
        link: '/policy-types',
    },
    {
        label: 'Platforms',
        link: '/platforms',
    },
    {
        label: 'Risk Providers',
        link: '/risk-providers',
    },
];

const tier2Items = [
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

];

const clientsItem = [
    {
        label: 'Clients',
        link: '/clients',
    },
];

const staffItem = [
    {
        label: 'Staff users',
        link: '/staff',
    },
];

const superuserItems = [
    {
        label: 'Organisations',
        link: '/admin/organisations',
    },
    {
        label: 'Data Transfer',
        link: '/admin/transfer',
    },
];

const clientSpaceItem = [
    {
        label: 'All reviews',
        link: '/client-space/reviews',
    },
]

const Sidebars = {
    [ UserType.Superuser ]: superuserItems,
    [ UserType.OrgOwner ]:  [].concat( clientsItem, tier1Items, tier2Items, staffItem ),  // Can manage admins
    [ UserType.OrgAdmin ]:  [].concat( clientsItem, tier1Items, tier2Items, staffItem ),  // Can manage advisors
    [ UserType.Advisor ]:   [].concat( clientsItem, tier2Items ),
    [ UserType.Client ]:    clientSpaceItem,
};

export default function PermanentDrawerLeft() {
    const [state] = useContext(Context);

    let location = useLocation();

    if (!state.Session) {
        return (
            <>
                <br /><br /><br /><br /><br /><br />
                <AuthControl />
            </>
        );
    }
    
    let regex = /reviews\/(?<reviewId>[0-9a-f]{32})\/(?<tail>.*)/;
    let res = location.pathname.match(regex);

    let items = [];
    items.push(...Sidebars[state.Session.Role]);

    if (state.Session.Role === 'client') {
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

    const drawerWidth = state.Session.Role === 'client' ? 360 : 240;

    const drawerStyles = {
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
        },
    };

    let titleRole = state.Session.Role[0].toUpperCase() + state.Session.Role.substring(1);
    
    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />

            <AppBar position = "fixed"
                    sx       = {{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}>
                <Toolbar>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        Amplifa {titleRole} Portal
                        <EnvironmentWarning />
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
                 sx        = {{
                    flexGrow: 1,
                    bgcolor: 'background.default',
                    p: 3,
                    maxWidth: 1000
                }}
            >
                <Toolbar />

                {/* The app... */}
                <InitialState>
                    <Routes />
                </InitialState>
            </Box>

            <div className='request-spinner'>
                <CircularProgress />
            </div>

            <div className='version'>
                version: {window.Config.Release.substring(0, 5)}
            </div>
        </Box>
    );
}
