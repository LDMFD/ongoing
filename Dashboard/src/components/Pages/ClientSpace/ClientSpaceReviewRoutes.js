import React from 'react';
import { Switch, Route, useLocation, useRouteMatch } from "react-router-dom";

import ClientSpaceReviewTabs from './ClientSpaceReviewTabs';

import FeeRoutes from './ClientSpaceFeeRoutes';
import Introduction from 'Components/ReviewComponents/Introduction';
import PolicyValuations from 'Components/ReviewComponents/PolicyValuations';
import Profile from 'Components/ReviewComponents/Profile';
import Conclusions from 'Components/ReviewComponents/Conclusions';

const ClientSpaceReviewRoutes = () => {
    let { path } = useRouteMatch();

    let location = useLocation();

    let background = location.state && location.state.background;

    let basePath = '/client-space/reviews/:reviewId/modules';

    return (
        <div style={{ position: "relative"}}>
            <Switch location={background || location}>
                <Route path={`${path}`}>
                    <ClientSpaceReviewTabs>
                        <Switch>
                            <Route path={`${basePath}/introduction`}      component={Introduction} />
                            <Route path={`${basePath}/profile`}           component={Profile} />
                            <Route path={`${basePath}/policy-valuations`} component={PolicyValuations} />
                            <Route path={`${basePath}/fees`}              component={FeeRoutes} />
                            <Route path={`${basePath}/conclusions`}       component={Conclusions} />
                        </Switch>
                    </ClientSpaceReviewTabs>
                </Route>
            </Switch>
        </div>
    );
}

export default ClientSpaceReviewRoutes;
