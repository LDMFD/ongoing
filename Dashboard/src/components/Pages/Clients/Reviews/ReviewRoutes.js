import React from 'react';
import { Switch, Route, useLocation, useRouteMatch } from "react-router-dom";

import EditModule from './Modules/EditModule';
import PreviewModule from './Modules/PreviewModule';
import ReviewOverview from './Modules/ReviewOverview';

const ReviewRoutes = () => {
    let { path } = useRouteMatch();

    let location = useLocation();

    let background = location.state && location.state.background;

    return (
        <div style={{ position: "relative"}}>
            <Switch location={background || location}>
                <Route path={`${path}`}>
                    <ReviewOverview />
                </Route>
            </Switch>

            <Route path={`${path}/edit`} component={EditModule} />
            <Route path={`${path}/preview`} component={PreviewModule} />
        </div>
    );
}

export default ReviewRoutes;
