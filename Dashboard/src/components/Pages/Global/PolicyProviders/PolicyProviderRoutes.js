import React from 'react';
import { Switch, Route, useLocation, useRouteMatch } from "react-router-dom";

import PolicyProviderList from './PolicyProviderList';
import AddPolicyProvider from './AddPolicyProvider';
import EditPolicyProvider from './EditPolicyProvider';

const PolicyProviderRoutes = () => {
    let { path } = useRouteMatch();

    let location = useLocation();

    let background = location.state && location.state.background;

    return (
        <div style={{ position: "relative"}}>
            <Switch location={background || location}>
                <Route path={path}>
                    <PolicyProviderList />
                </Route>
            </Switch>

            <Route path={`${path}/add`}>
                <AddPolicyProvider />
            </Route>
            <Route path={`${path}/id/:policyProviderId/edit`}>
                <EditPolicyProvider />
            </Route>
        </div>
    );
}

export default PolicyProviderRoutes;
