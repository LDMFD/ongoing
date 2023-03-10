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
        `${basePath}/totals`,
        `${basePath}/details`,
        `${basePath}/impact`,
    ]);
    let currentTab = routeMatch?.path;

    return (
        <>
            <Tabs value={currentTab}>
                <Tab label="Fees intro" value={`${basePath}/intro`}   to={`${baseTarget}/intro`}          component={Link} />
                <Tab label="Totals"     value={`${basePath}/totals`}  to={`${baseTarget}/totals`}         component={Link} />
                <Tab label="Details"    value={`${basePath}/details`} to={`${baseTarget}/details/advice`} component={Link} />
                <Tab label="Impact"     value={`${basePath}/impact`}  to={`${baseTarget}/impact`}         component={Link} />
            </Tabs>

            {children}
        </>
    );
};

export default FeeTabs;