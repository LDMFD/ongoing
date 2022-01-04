import React, { useContext } from "react";

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import SearchIcon from '@mui/icons-material/Search';

import {
    Link
} from "react-router-dom";

import { Context } from '../Store';
import Routes from './Routes';
import AuthControl from './AuthControl';

import './AppDrawer.css';

const drawerWidth = 240;

const DrawerItems = [
    {
        label: 'Clients',
        icon: <SearchIcon />,
        link: '/clients',
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

    return state.auth ? (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />

            <AppBar position = "fixed"
                    sx       = {{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}>
                <Toolbar>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        Ongoing Suitability
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
                        <ListItem button>
                            <ListItemIcon>
                                {iconSpec.icon}
                            </ListItemIcon>

                            <ListItemText primary={
                                iconSpec.label
                            } />
                        </ListItem>
                    </Link>
                ))}
            </List>
            
            </Drawer>

            <Box component = "main"
                 sx        = {{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>

                <Toolbar />

                {Routes}
            </Box>
        </Box>
    ) : (
        <>
            <br /><br /><br /><br /><br /><br />
            <AuthControl />
        </>
    );
}
