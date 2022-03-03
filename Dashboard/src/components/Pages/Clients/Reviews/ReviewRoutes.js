import React from 'react';
import { Switch, Route, useLocation, useRouteMatch } from "react-router-dom";

import ReviewTabs from './ReviewTabs';

import Introduction     from './Modules/Implementations/Introduction';
import Profile          from './Modules/Implementations/Profile';
import PolicyValuations from './Modules/Implementations/PolicyValuations/PolicyValuations';
import Conclusions      from './Modules/Implementations/Conclusions';
import FeeRoutes        from './Modules/Implementations/Fees/FeeRoutes';

const ReviewRoutes = () => {
    let { path } = useRouteMatch();

    let location = useLocation();

    let background = location.state && location.state.background;

    let basePath = '/clients/id/:clientId/reviews/id/:reviewId/modules';

    return (
        <div style={{ position: "relative"}}>
            <Switch location={background || location}>
                <Route path={`${path}`}>
                    <ReviewTabs>
                        <Switch>
                            <Route path={`${basePath}/introduction`}      component={Introduction} />
                            <Route path={`${basePath}/profile`}           component={Profile} />
                            <Route path={`${basePath}/policy-valuations`} component={PolicyValuations} />
                            <Route path={`${basePath}/fees`}              component={FeeRoutes} />
                            <Route path={`${basePath}/conclusions`}       component={Conclusions} />
                        </Switch>
                    </ReviewTabs>
                </Route>
            </Switch>
        </div>
    );
}

export default ReviewRoutes;
