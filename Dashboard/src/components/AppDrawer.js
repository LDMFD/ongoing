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
import SearchIcon from '@mui/icons-material/Search';

import './AppDrawer.css';

import Routes from './Routes';
import AuthControl from './AuthControl';
import { Context } from 'State/StateProvider';
import InitialState from "State/InitialState";

const drawerWidth = 240;

const DrawerItems = [
    {
        label: 'Clients',
        icon: <SearchIcon />,
        link: '/clients',
    },
    {
        label: 'Models',
        icon: <SearchIcon />,
        link: '/models',
    },
    {
        label: 'Funds',
        icon: <SearchIcon />,
        link: '/funds',
    },
    {
        label: 'Operators',
        icon: <SearchIcon />,
        link: '/operators',
    },
    {
        label: 'Policy Types',
        icon: <SearchIcon />,
        link: '/policy-types',
    },
    {
        label: 'Policy Providers',
        icon: <SearchIcon />,
        link: '/policy-providers',
    },
];

const DrawerStyles = {
    width: drawerWidth,
    flexShrink: 0,
    '& .MuiDrawer-paper': {
        width: drawerWidth,
        boxSizing: 'border-box',
    },
};

export default function PermanentDrawerLeft() {
    const [state] = useContext(Context);

    let location = useLocation();

    return state.Auth ? (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />

            <AppBar position = "fixed"
                    sx       = {{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}>
                <Toolbar>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        Ongoing Backend
                    </Typography>
                    
                    <AuthControl />
                </Toolbar>
            </AppBar>
            <Drawer sx      = {DrawerStyles}
                    variant = "permanent"
                    anchor  = "left">

            <Toolbar />
            <Divider />
            
            <List>
                {DrawerItems.map((iconSpec, index) => (
                    <Link to={iconSpec.link} key={iconSpec.label}>
                        <ListItemButton selected={location.pathname.startsWith(iconSpec.link)}>
                            <ListItemIcon>
                                {iconSpec.icon}
                            </ListItemIcon>

                            <ListItemText primary={
                                iconSpec.label
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
        </Box>
    ) : (
        <>
            <br /><br /><br /><br /><br /><br />
            <AuthControl />
        </>
    );
}
