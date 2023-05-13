import React from 'react';
import { Switch, Route, useLocation, useRouteMatch } from "react-router-dom";

import AddPolicyProvider from './AddPolicyProvider';
import DeletePolicyProvider from './DeletePolicyProvider';
import EditPolicyProvider from './EditPolicyProvider';
import PolicyProviderList from './PolicyProviderList';
import ProviderChargeRoutes from '../PolicyProviderCharges/ProviderChargeRoutes';

const PolicyProviderRoutes = () => {
    let { path } = useRouteMatch();

    let location = useLocation();

    let background = location.state && location.state.background;

    return (
        <div style={{ position: "relative"}}>
            <Switch location={background || location}>
                <Route path={`${path}`}>
                    <PolicyProviderList />
                </Route>
            </Switch>

            <Route path={`${path}/add`}>
                <AddPolicyProvider />
            </Route>
            <Route path={`${path}/id/:policyProviderId/edit`}>
                <EditPolicyProvider />
            </Route>
            <Route path={`${path}/id/:policyProviderId/delete`}>
                <DeletePolicyProvider />
            </Route>
            <Route path={`${path}/id/:policyProviderId/provider-charges`}>
                <ProviderChargeRoutes/>
            </Route>
        </div>
    );
}

export default PolicyProviderRoutes;
