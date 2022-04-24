import React, {  } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import {
    Tab,
    Tabs,
} from '@mui/material';

import { RouteMatch } from 'Utils/Routing';

const ReviewTabs = ({ children }) => {

    let { reviewId } = useParams();

    const { pathname } = useLocation();

    function ReviewTabs() {
        let routeMatch = RouteMatch(pathname, [
            '/client-space/reviews/:reviewId/modules/introduction',
            '/client-space/reviews/:reviewId/modules/profile',
            '/client-space/reviews/:reviewId/modules/policy-valuations',
            '/client-space/reviews/:reviewId/modules/fees',
            '/client-space/reviews/:reviewId/modules/conclusions',
            '/client-space/reviews/:reviewId',
        ]);
        let currentTab = routeMatch?.path;
        
        let basePath = '/client-space/reviews/:reviewId/modules';
        let baseTarget = `/client-space/reviews/${reviewId}/modules`;

        return (
            <Tabs value={currentTab}>
                <Tab label="Introduction"           value={`${basePath}/introduction`}      to={`${baseTarget}/introduction`}               component={Link} />
                <Tab label="Your Profile"           value={`${basePath}/profile`}           to={`${baseTarget}/profile/risk-questionnaire`} component={Link} />
                <Tab label="Your Policy Valuations" value={`${basePath}/policy-valuations`} to={`${baseTarget}/policy-valuations`}          component={Link} />
                <Tab label="Fee breakdown"          value={`${basePath}/fees`}              to={`${baseTarget}/fees/intro`}                 component={Link} />
                <Tab label="Conclusions"            value={`${basePath}/conclusions`}       to={`${baseTarget}/conclusions/advice-given`}   component={Link} />
            </Tabs>
        );
    }

    return (
        <div className='review'>
            <ReviewTabs />

            {children}
        </div>
    );
}

export default ReviewTabs;
