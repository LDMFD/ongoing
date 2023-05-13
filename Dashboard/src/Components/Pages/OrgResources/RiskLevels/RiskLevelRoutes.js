import React from 'react';
import { Switch, Route, useLocation, useRouteMatch } from "react-router-dom";

import RiskLevelList from './RiskLevelList';
import AddRiskLevel from './AddRiskLevel';
import EditRiskLevel from './EditRiskLevel';
import DeleteRiskLevel from './DeleteRiskLevel';

const RiskLevelRoutes = () => {
    let { path } = useRouteMatch();

    let location = useLocation();

    let background = location.state && location.state.background;

    return (
        <div style={{ position: "relative"}}>
            <Switch location={background || location}>
                <Route path={path}>
                    <RiskLevelList />
                </Route>
            </Switch>

            <Route path={`${path}/add`}>
                <AddRiskLevel />
            </Route>
            <Route path={`${path}/id/:levelId/edit`}>
                <EditRiskLevel />
            </Route>
            <Route path={`${path}/id/:levelId/delete`}>
                <DeleteRiskLevel />
            </Route>
        </div>
    );
}

export default RiskLevelRoutes;
