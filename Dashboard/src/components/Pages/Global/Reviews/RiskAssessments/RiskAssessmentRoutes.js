import React from 'react';
import { Switch, Route, useLocation, useRouteMatch } from "react-router-dom";

import RiskAssessmentList from './RiskAssessmentList';
import AddRiskAssessment from './AddRiskAssessment';
import EditRiskAssessment from './EditRiskAssessment';

const RiskAssessmentRoutes = () => {
    let { path } = useRouteMatch();

    let location = useLocation();

    let background = location.state && location.state.background;

    return (
        <div style={{ position: "relative"}}>
            <Switch location={background || location}>
                <Route path={path}>
                    <RiskAssessmentList />
                </Route>
            </Switch>

            <Route path={`${path}/add`}>
                <AddRiskAssessment />
            </Route>
            <Route path={`${path}/id/:riskAssessmentId/edit`}>
                <EditRiskAssessment />
            </Route>
        </div>
    );
}

export default RiskAssessmentRoutes;
