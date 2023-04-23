import React from 'react';
import { Switch, Route, useLocation, useRouteMatch } from "react-router-dom";

import ProviderChargeList from './ProviderChargeList';
import AddProviderCharge from './AddProviderCharge';
import EditProviderCharge from './EditProviderCharge';
import DeletePlatformCharge from './DeletePlatformCharge';

const ProviderChargeRoutes = () => {
    let { path } = useRouteMatch();

    let location = useLocation();

    let background = location.state && location.state.background;

    return (
        <div style={{ position: "relative"}}>
            <Switch location={background || location}>
                <Route path={path}>
                    <ProviderChargeList />
                </Route>
            </Switch>

            <Route path={`${path}/add`}>
                <AddProviderCharge />
            </Route>
            <Route path={`${path}/id/:chargeId/edit`}>
                <EditProviderCharge />
            </Route>
            <Route path={`${path}/id/:chargeId/delete`}>
                <DeletePlatformCharge />
            </Route>
        </div>
    );
}

export default ProviderChargeRoutes;
