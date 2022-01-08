import React from 'react';
import { Switch, Route, useLocation, useRouteMatch } from "react-router-dom";

import AddClient from './ClientProfiles/Components/AddClient';
import AddPolicy from './Policies/Components/AddPolicy';
import ClientWrapper from './ClientWrapper';
import ClientList from './ClientProfiles/Components/ClientList';
import EditClient from './ClientProfiles/Components/EditClient';
import EditPolicy from './Policies/Components/EditPolicy';
import PolicyWrapper from './Policies/Components/PolicyWrapper';
import PolicyList from './Policies/Components/PolicyList';
import ReviewList from './Reviews/ReviewList';

const ClientRoutes = () => {
    let { path } = useRouteMatch();

    let location = useLocation();

    // See https://v5.reactrouter.com/web/example/modal-gallery
    let background = location.state && location.state.background;

    return (
        <div style={{ position: "relative"}}>
            <Switch location={background || location}>
                <Route path={`${path}/id/:clientId`}>
                    <ClientWrapper>
                        <Switch>
                            <Route path={`${path}/id/:clientId/reviews`} component={ReviewList} />
                            <Route path={`${path}/id/:clientId`} component={PolicyList} />
                        </Switch>
                        <PolicyWrapper>
                            <Route path={`${path}/id/:clientId/policies/add`} component={AddPolicy} />
                            <Route path={`${path}/id/:clientId/policies/id/:policyId/edit`} component={EditPolicy} />
                        </PolicyWrapper>
                    </ClientWrapper>
                </Route>
                <Route path={path} component={ClientList} />
            </Switch>
    
            <Route path={`${path}/add`} component={AddClient} />
            <Route path={`${path}/id/:clientId/edit`} component={EditClient} />
        </div>
    );
}
    
export default ClientRoutes;
