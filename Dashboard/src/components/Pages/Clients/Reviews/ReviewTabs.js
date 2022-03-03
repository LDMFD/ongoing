import React, {  } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import {
    Tab,
    Tabs,
} from '@mui/material';

import { RouteMatch } from 'Utils/Routing';

const ReviewTabs = ({ children }) => {

    let { clientId, reviewId } = useParams();
    clientId = parseInt(clientId);
    reviewId = parseInt(reviewId);

    const { pathname } = useLocation();

    function ReviewTabs() {
        let routeMatch = RouteMatch(pathname, [
            '/clients/id/:clientId/reviews/id/:reviewId/modules/introduction',
            '/clients/id/:clientId/reviews/id/:reviewId/modules/profile',
            '/clients/id/:clientId/reviews/id/:reviewId/modules/policy-valuations',
            '/clients/id/:clientId/reviews/id/:reviewId/modules/fees',
            '/clients/id/:clientId/reviews/id/:reviewId/modules/conclusions',
            '/clients/id/:clientId/reviews/id/:reviewId',
        ]);
        let currentTab = routeMatch?.path;
        
        let basePath = '/clients/id/:clientId/reviews/id/:reviewId/modules';
        let baseTarget = `/clients/id/${clientId}/reviews/id/${reviewId}/modules`;

        return (
            <Tabs value={currentTab}>
                <Tab label="Introduction"      value={`${basePath}/introduction`}      to={`${baseTarget}/introduction`}      component={Link} />
                <Tab label="Profile"           value={`${basePath}/profile`}           to={`${baseTarget}/profile`}           component={Link} />
                <Tab label="Policy Valuations" value={`${basePath}/policy-valuations`} to={`${baseTarget}/policy-valuations`} component={Link} />
                <Tab label="Fees"              value={`${basePath}/fees`}              to={`${baseTarget}/fees/intro`}        component={Link} />
                <Tab label="Conclusions"       value={`${basePath}/conclusions`}       to={`${baseTarget}/conclusions`}       component={Link} />
            </Tabs>
        );
    }

    return (
        <div className='review'>
            {/* <Breadcrumbs aria-label="breadcrumb">
                <Typography color="text.primary">
                    Review #{reviewId}
                </Typography>
            </Breadcrumbs> */}

            <ReviewTabs />

            {children}
        </div>
    );
}

export default ReviewTabs;
