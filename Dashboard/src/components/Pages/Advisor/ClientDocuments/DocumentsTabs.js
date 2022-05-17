import React, {  } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import {
    Tab,
    Tabs,
} from '@mui/material';

import { RouteMatch } from 'Utils/Routing';

const DocumentsTabs = ({ children }) => {

    let { clientId } = useParams();

    const { pathname } = useLocation();

    function DocumentsTabsComponent() {
        let basePath = '/clients/id/:clientId/documents';
        let baseTarget = `/clients/id/${clientId}/documents`;

        let routeMatch = RouteMatch(pathname, [
            `${basePath}/fact-finds`,
            `${basePath}/risk-assessments`,
            `${basePath}/fees-reports`,
            `${basePath}/forecasts`,
        ]);
        let currentTab = routeMatch?.path;
        
        return (
            <Tabs value={currentTab}>
                <Tab label="Risk Assessments" value={`${basePath}/risk-assessments`} to={`${baseTarget}/risk-assessments`} component={Link} />
                <Tab label="Fact Finds"       value={`${basePath}/fact-finds`}       to={`${baseTarget}/fact-finds`}       component={Link} />
                <Tab label="Fees Reports"     value={`${basePath}/fees-reports`}     to={`${baseTarget}/fees-reports`}     component={Link} />
                <Tab label="Forecasts"        value={`${basePath}/forecasts`}        to={`${baseTarget}/forecasts`}        component={Link} />
            </Tabs>
        );
    }

    return (
        <div className='review'>
            <DocumentsTabsComponent />
            {children}
        </div>
    );
}

export default DocumentsTabs;
