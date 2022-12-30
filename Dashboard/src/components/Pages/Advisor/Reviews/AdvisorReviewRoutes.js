import React from 'react';
import { Switch, Route, useLocation, useRouteMatch } from "react-router-dom";

import ReviewTabs from './ReviewTabs';

import Introduction          from 'Components/ReviewComponents/Introduction';
import PolicyValuations      from 'Components/ReviewComponents/PolicyValuations';
import { ModuleEditor }      from './Modules/ModuleEditor';
import FeeRoutes             from './AdvisorReviewFeeRoutes';
import ConclusionRoutes      from './AdvisorReviewConclusionRoutes';
import PublishState          from './PublishState';
import EditReviewStateDialog from './EditReviewStateDialog';
import ProfileRoutes         from './AdvisorReviewProfileRoutes';

const AdvisorReviewRoutes = () => {
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
                            <Route path={`${basePath}/state`}             component={PublishState} />
                            <Route path={`${basePath}/introduction`}      component={Introduction} />
                            <Route path={`${basePath}/profile`}           component={ProfileRoutes} />
                            <Route path={`${basePath}/policy-valuations`} component={PolicyValuations} />
                            <Route path={`${basePath}/fees`}              component={FeeRoutes} />
                            <Route path={`${basePath}/assessments`}       component={ConclusionRoutes} />
                        </Switch>
                    </ReviewTabs>
                    <Route path={`${basePath}/:page/edit/:rmod/:field`} component={ModuleEditor} />
                    <Route path={`${basePath}/state/edit`}              component={EditReviewStateDialog} />
                </Route>
            </Switch>
        </div>
    );
}

export default AdvisorReviewRoutes;
