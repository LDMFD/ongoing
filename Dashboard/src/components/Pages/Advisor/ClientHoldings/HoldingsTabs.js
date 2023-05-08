import React, {  } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import {
    Tab,
    Tabs,
} from '@mui/material';

import { RouteMatch } from 'Utils/Routing';

const HoldingsTabs = ({ children }) => {

    let { clientId } = useParams();

    const { pathname } = useLocation();

    function HoldingsTabsComponent() {
        let basePath = '/clients/id/:clientId/holdings';
        let baseTarget = `/clients/id/${clientId}/holdings`;

        let routeMatch = RouteMatch(pathname, [
            `${basePath}/platform-discounts`,
            `${basePath}/policies`,
            `${basePath}/policy-funds`,
            `${basePath}/portfolios`,
        ]);
        let currentTab = routeMatch?.path;
        
        return (
            <Tabs value={currentTab}>
                <Tab label="Policies"           value={`${basePath}/policies`}           to={`${baseTarget}/policies`}           component={Link} />
                <Tab label="Policy funds"       value={`${basePath}/policy-funds`}       to={`${baseTarget}/policy-funds`}       component={Link} />
                <Tab label="Portfolios"         value={`${basePath}/portfolios`}         to={`${baseTarget}/portfolios`}         component={Link} />
                <Tab label="Platform discounts" value={`${basePath}/platform-discounts`} to={`${baseTarget}/platform-discounts`} component={Link} />
            </Tabs>
        );
    }

    return (
        <div className='review'>
            <HoldingsTabsComponent />
            <br />
            {children}
        </div>
    );
}

export default HoldingsTabs;
