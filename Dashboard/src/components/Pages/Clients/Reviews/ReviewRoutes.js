import React from 'react';
import { Switch, Route, useLocation, useRouteMatch } from "react-router-dom";

// import EditModule from './Modules/EditModule';
// import PreviewModule from './Modules/PreviewModule';
import ReviewWrapper from './Modules/ReviewWrapper';

import Introduction     from './Modules/Implementations/Introduction';
import Profile          from './Modules/Implementations/Profile';
import PolicyValuations from './Modules/Implementations/PolicyValuations/PolicyValuations';
import Fees             from './Modules/Implementations/Fees';
import Conclusions      from './Modules/Implementations/Conclusions';

const ReviewRoutes = () => {
    let { path } = useRouteMatch();

    let location = useLocation();

    let background = location.state && location.state.background;

    let basePath = '/clients/id/:clientId/reviews/id/:reviewId/modules';

    return (
        <div style={{ position: "relative"}}>
            <Switch location={background || location}>
                <Route path={`${path}`}>
                    <ReviewWrapper>
                        <Switch>
                            <Route path={`${basePath}/introduction`}      component={Introduction} />
                            <Route path={`${basePath}/profile`}           component={Profile} />
                            <Route path={`${basePath}/policy-valuations`} component={PolicyValuations} />
                            <Route path={`${basePath}/fees`}              component={Fees} />
                            <Route path={`${basePath}/conclusions`}       component={Conclusions} />
                        </Switch>
                    </ReviewWrapper>
                </Route>
            </Switch>

            {/* <Route path={`${path}/edit`} component={EditModule} />
            <Route path={`${path}/preview`} component={PreviewModule} /> */}
        </div>
    );
}

export default ReviewRoutes;
