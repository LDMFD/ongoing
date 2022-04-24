import React from 'react';
import { Switch, Route, useLocation, useRouteMatch } from "react-router-dom";
import DocumentsTabs from './DocumentsTabs';
import AddFactFind from './FactFinds/AddFactFind';
import EditFactFind from './FactFinds/EditFactFind';
import FactFindList from './FactFinds/FactFindList';

import AddRiskAssessment from './RiskAssessments/AddRiskAssessment';
import EditRiskAssessment from './RiskAssessments/EditRiskAssessment';
import RiskAssessmentList from './RiskAssessments/RiskAssessmentList';

const ReportRoutes = () => {
    let { path } = useRouteMatch();

    let location = useLocation();

    let background = location.state && location.state.background;

    let basePath = '/clients/id/:clientId/documents';

    return (
        <div style={{ position: "relative"}}>
            <Switch location={background || location}>
                <Route path={`${path}`}>
                    <DocumentsTabs>
                        <Switch>
                            <Route path={`${basePath}/fact-finds`}       component={FactFindList} />
                            <Route path={`${basePath}/risk-assessments`} component={RiskAssessmentList} />
                        </Switch>
                    </DocumentsTabs>

                    <Route path={`${basePath}/risk-assessments/add`}                       component={AddRiskAssessment} />
                    <Route path={`${basePath}/risk-assessments/id/:riskAssessmentId/edit`} component={EditRiskAssessment} />

                    <Route path={`${basePath}/fact-finds/add`}                 component={AddFactFind} />
                    <Route path={`${basePath}/fact-finds/id/:factFindId/edit`} component={EditFactFind} />
                </Route>
            </Switch>
        </div>
    );
}

export default ReportRoutes;
