import React from 'react';
import { Switch, Route, useLocation, useRouteMatch } from "react-router-dom";

import ReviewTabs from './ReviewTabs';

import { EditModuleText } from './Modules/ModuleEditor';
import Conclusions from 'components/ReviewComponents/Conclusions';
import FeeRoutes from './AdvisorFeeRoutes';
import Introduction from 'components/ReviewComponents/Introduction';
import Profile from 'components/ReviewComponents/Profile';
import PolicyValuations from 'components/ReviewComponents/PolicyValuations';

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
                    <Route path={`${basePath}/:page/edit/:rmod/:field`} component={EditModuleText} />
                </Route>
            </Switch>
        </div>
    );
}

export default ReviewRoutes;
