import React from 'react';
import { Switch, Route, useLocation, useRouteMatch } from "react-router-dom";

import ClientSpaceWrapper from './ClientSpaceWrapper';
import ReviewRoutes       from './ClientSpaceReviewRoutes';
import ReviewList         from './ReviewList';

const ClientSpaceRoutes = () => {
    let { path } = useRouteMatch();

    let location = useLocation();

    let background = location.state && location.state.background;

    return (
        <div style={{ position: "relative"}}>
            <Switch location={background || location}>
                <Route path={`${path}`}>
                    <ClientSpaceWrapper>
                        <Switch>
                            <Route path={`${path}/reviews/:reviewId/modules/:module`} component={ReviewRoutes} />
                            <Route path={`${path}/reviews/:reviewId`} component={ReviewRoutes} />

                            <Route path={`${path}`} component={ReviewList} />
                        </Switch>
                    </ClientSpaceWrapper>
                </Route>
            </Switch>
        </div>
    );
}
    
export default ClientSpaceRoutes;
