import React, {  } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import {
    Tab,
    Tabs,
} from '@mui/material';

import { RouteMatch } from 'Utils/Routing';

const ReportTabs = ({ children }) => {

    let { clientId } = useParams();

    const { pathname } = useLocation();

    function ReportTabsComponent() {
        let routeMatch = RouteMatch(pathname, [
            '/clients/id/:clientId/modules/introduction',
            '/clients/id/:clientId/modules/profile',
            '/clients/id/:clientId/modules/policy-valuations',
            '/clients/id/:clientId/modules/fees',
            '/clients/id/:clientId/modules/assessments',
            '/clients/id/:clientId/modules/dates',
            '/clients/id/:clientId/modules/publish',
            '/clients/id/:clientId',
        ]);
        let currentTab = routeMatch?.path;
        
        let basePath = '/clients/id/:clientId/modules';
        let baseTarget = `/clients/id/${clientId}/modules`;

        return (
            <Tabs value={currentTab}>
                <Tab label="Dates"             value={`${basePath}/dates`}                to={`${baseTarget}/dates`}                      component={Link} />
                <Tab label="Introduction"      value={`${basePath}/introduction`}         to={`${baseTarget}/introduction`}               component={Link} />
                <Tab label="Profile"           value={`${basePath}/profile`}              to={`${baseTarget}/profile/risk-questionnaire`} component={Link} />
                <Tab label="Policy Valuations" value={`${basePath}/policy-valuations`}    to={`${baseTarget}/policy-valuations`}          component={Link} />
                <Tab label="Fees"              value={`${basePath}/fees`}                 to={`${baseTarget}/fees/totals`}                component={Link} />
                <Tab label="Assessment"        value={`${basePath}/assessments`}          to={`${baseTarget}/assessments/objectives`}     component={Link} />
            </Tabs>
        );
    }

    return (
        <div className='review'>
            <ReportTabsComponent />
            {children}
        </div>
    );
}

export default ReportTabs;
