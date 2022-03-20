import React, {  } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    Tab,
    Tabs,
} from '@mui/material';
import { RouteMatch } from 'Utils/Routing';

const FeeTabs = ({ basePath, baseTarget, children }) => {
    const { pathname } = useLocation();

    let routeMatch = RouteMatch(pathname, [
        `${basePath}/intro`,
        `${basePath}/advice`,
        `${basePath}/platform`,
        `${basePath}/fund-level`,
        `${basePath}/portfolio-level`,
        `${basePath}/dim`,
    ]);
    let currentTab = routeMatch?.path;

    return (
        <>
            <Tabs value={currentTab}>
                <Tab label="Fees intro"      value={`${basePath}/intro`}           to={`${baseTarget}/intro`}           component={Link} />
                <Tab label="Advice"          value={`${basePath}/advice`}          to={`${baseTarget}/advice`}          component={Link} />
                <Tab label="Platform"        value={`${basePath}/platform`}        to={`${baseTarget}/platform`}        component={Link} />
                <Tab label="Fund-Level"      value={`${basePath}/fund-level`}      to={`${baseTarget}/fund-level`}      component={Link} />
                <Tab label="Portfolio-Level" value={`${basePath}/portfolio-level`} to={`${baseTarget}/portfolio-level`} component={Link} />
                <Tab label="DIM"             value={`${basePath}/dim`}             to={`${baseTarget}/dim`}             component={Link} />
            </Tabs>

            {children}
        </>
    );
};

export default FeeTabs;