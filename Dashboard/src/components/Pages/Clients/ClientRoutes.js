import React from 'react';
import { Switch, Route, useLocation, useRouteMatch } from "react-router-dom";

import ClientWrapper from './ClientWrapper';
import HoldingList   from './Holdings/HoldingList';
import AddHolding    from './Holdings/AddHolding';
import EditHolding   from './Holdings/EditHolding';
import AddClient     from './ClientProfiles/Components/AddClient';
import ClientList    from './ClientProfiles/Components/ClientList';
import EditClient    from './ClientProfiles/Components/EditClient';
import AddPolicy     from './Policies/Components/AddPolicy';
import EditPolicy    from './Policies/Components/EditPolicy';
import PolicyList    from './Policies/Components/PolicyList';
import ReviewList    from './Reviews/ReviewList';

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
                            <Route path={`${path}/id/:clientId/policies`} component={PolicyList} />
                            <Route path={`${path}/id/:clientId`} component={HoldingList} />
                        </Switch>
                        
                        <Route path={`${path}/id/:clientId/holdings/add`} component={AddHolding} />
                        <Route path={`${path}/id/:clientId/holdings/id/:holdingId/edit`} component={EditHolding} />

                        <Route path={`${path}/id/:clientId/policies/add`} component={AddPolicy} />
                        <Route path={`${path}/id/:clientId/policies/id/:policyId/edit`} component={EditPolicy} />
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
