import React, {  } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import {
    Tab,
    Tabs,
} from '@mui/material';

import { RouteMatch } from 'Utils/Routing';

const FeesWrapper = ({ children }) => {

    let { clientId, reviewId } = useParams();
    clientId = parseInt(clientId);
    reviewId = parseInt(reviewId);

    const { pathname } = useLocation();

    function ReviewTabs() {
        let routeMatch = RouteMatch(pathname, [
            '/clients/id/:clientId/reviews/id/:reviewId/modules/fees/intro',
            '/clients/id/:clientId/reviews/id/:reviewId/modules/fees/advice',
            '/clients/id/:clientId/reviews/id/:reviewId/modules/fees/platform',
            '/clients/id/:clientId/reviews/id/:reviewId/modules/fees/fund-level',
            '/clients/id/:clientId/reviews/id/:reviewId/modules/fees/portfolio-level',
            '/clients/id/:clientId/reviews/id/:reviewId/modules/fees/dim',
        ]);
        let currentTab = routeMatch?.path;
        
        let basePath = '/clients/id/:clientId/reviews/id/:reviewId/modules/fees';
        let baseTarget = `/clients/id/${clientId}/reviews/id/${reviewId}/modules/fees`;

        return (
            <Tabs value={currentTab}>
                <Tab label="Fees intro"      value={`${basePath}/intro`}           to={`${baseTarget}/intro`}           component={Link} />
                <Tab label="Advice"          value={`${basePath}/advice`}          to={`${baseTarget}/advice`}          component={Link} />
                <Tab label="Platform"        value={`${basePath}/platform`}        to={`${baseTarget}/platform`}        component={Link} />
                <Tab label="Fund-Level"      value={`${basePath}/fund-level`}      to={`${baseTarget}/fund-level`}      component={Link} />
                <Tab label="Portfolio-Level" value={`${basePath}/portfolio-level`} to={`${baseTarget}/portfolio-level`} component={Link} />
                <Tab label="DIM"             value={`${basePath}/dim`}             to={`${baseTarget}/dim`}             component={Link} />
            </Tabs>
        );
    }

    return (
        <>
            <ReviewTabs />
            {children}
        </>
    );
}

export default FeesWrapper;
