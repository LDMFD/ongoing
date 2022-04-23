import React, {  } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    Tab,
    Tabs,
} from '@mui/material';
import { RouteMatch } from 'Utils/Routing';

const ConclusionTabs = ({ basePath, baseTarget, children }) => {
    const { pathname } = useLocation();

    let routeMatch = RouteMatch(pathname, [
        `${basePath}/advice-given`,
        `${basePath}/due-diligence`,
        `${basePath}/ongoing-suitability`,
        `${basePath}/action-points`,
    ]);
    let currentTab = routeMatch?.path;

    return (
        <>
            <Tabs value={currentTab}>
                <Tab label="Advice given"        value={`${basePath}/advice-given`}        to={`${baseTarget}/advice-given`}        component={Link} />
                <Tab label="Due diligence"       value={`${basePath}/due-diligence`}       to={`${baseTarget}/due-diligence`}       component={Link} />
                <Tab label="Ongoing suitability" value={`${basePath}/ongoing-suitability`} to={`${baseTarget}/ongoing-suitability`} component={Link} />
                <Tab label="Action points"       value={`${basePath}/action-points`}       to={`${baseTarget}/action-points`}       component={Link} />
            </Tabs>

            {children}
        </>
    );
};

export default ConclusionTabs;
