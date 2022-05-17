import React, {  } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    Tab,
    Tabs,
} from '@mui/material';
import { RouteMatch } from 'Utils/Routing';
import { GetReport } from '../GetReport';

const ConclusionTabs = ({ basePath, baseTarget, children }) => {
    const { pathname } = useLocation();

    let routeMatch = RouteMatch(pathname, [
        `${basePath}/goals`,
        `${basePath}/ongoing-suitability`,
        `${basePath}/due-diligence`,
        `${basePath}/forecast`,
        `${basePath}/advice-given`,
        `${basePath}/action-points`,
    ]);
    let currentTab = routeMatch?.path;

    let report = GetReport();

    return (
        <>
            <Tabs value={currentTab}>
                <Tab label="Goals"               value={`${basePath}/goals`        }       to={`${baseTarget}/goals`}               component={Link} />
                <Tab label="Ongoing suitability" value={`${basePath}/ongoing-suitability`} to={`${baseTarget}/ongoing-suitability`} component={Link} />
                <Tab label="Due diligence"       value={`${basePath}/due-diligence`}       to={`${baseTarget}/due-diligence`}       component={Link} />
                {report.Forecasts.length &&
                    <Tab label="Forecast"            value={`${basePath}/forecast`}            to={`${baseTarget}/forecast`}            component={Link} />
                }
                <Tab label="Advice given"        value={`${basePath}/advice-given`}        to={`${baseTarget}/advice-given`}        component={Link} />
                <Tab label="Action points"       value={`${basePath}/action-points`}       to={`${baseTarget}/action-points`}       component={Link} />
            </Tabs>

            {children}
        </>
    );
};

export default ConclusionTabs;
