import React from 'react';
import { Switch, Route, useLocation, useRouteMatch } from "react-router-dom";

import RiskProviderList from './RiskProviderList';
import AddRiskProvider from './AddRiskProvider';
import EditRiskProvider from './EditRiskProvider';
import ProviderChargeRoutes from '../RiskLevels/RiskLevelRoutes';
import DeleteRiskProvider from './DeleteRiskProvider';

const RiskProviderRoutes = () => {
    let { path } = useRouteMatch();

    let location = useLocation();

    let background = location.state && location.state.background;

    return (
        <div style={{ position: "relative"}}>
            <Switch location={background || location}>
                <Route path={`${path}`}>
                    <RiskProviderList />
                </Route>
            </Switch>

            <Route path={`${path}/add`}>
                <AddRiskProvider />
            </Route>

            <Route path={`${path}/id/:riskProviderId/edit`}>
                <EditRiskProvider />
            </Route>

            <Route path={`${path}/id/:riskProviderId/delete`}>
                <DeleteRiskProvider />
            </Route>

            <Route path={`${path}/id/:riskProviderId/risk-levels`}>
                <ProviderChargeRoutes/>
            </Route>
        </div>
    );
}

export default RiskProviderRoutes;
