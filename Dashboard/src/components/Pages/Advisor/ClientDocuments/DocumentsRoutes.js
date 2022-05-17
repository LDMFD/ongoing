import React from 'react';
import { Switch, Route, useLocation, useRouteMatch } from "react-router-dom";

import AddFactFind from './FactFinds/AddFactFind';
import AddFeesReport from './FeesReport/AddFeesReport';
import AddForecast from './Forecasts/AddForecast';
import AddRiskAssessment from './RiskAssessments/AddRiskAssessment';
import DocumentsTabs from './DocumentsTabs';
import EditFactFind from './FactFinds/EditFactFind';
import EditFeesReport from './FeesReport/EditFeesReport';
import EditForecast from './Forecasts/EditForecast';
import EditRiskAssessment from './RiskAssessments/EditRiskAssessment';
import FactFindList from './FactFinds/FactFindList';
import FeesReportList from './FeesReport/FeesReportList';
import ForecastList from './Forecasts/ForecastList';
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
                            <Route path={`${basePath}/fees-reports`}     component={FeesReportList} />
                            <Route path={`${basePath}/forecasts`}        component={ForecastList} />
                        </Switch>
                    </DocumentsTabs>

                    <Route path={`${basePath}/risk-assessments/add`}                       component={AddRiskAssessment} />
                    <Route path={`${basePath}/risk-assessments/id/:riskAssessmentId/edit`} component={EditRiskAssessment} />

                    <Route path={`${basePath}/fact-finds/add`}                 component={AddFactFind} />
                    <Route path={`${basePath}/fact-finds/id/:factFindId/edit`} component={EditFactFind} />

                    <Route path={`${basePath}/forecasts/add`}                 component={AddForecast} />
                    <Route path={`${basePath}/forecasts/id/:forecastId/edit`} component={EditForecast} />

                    <Route path={`${basePath}/fees-reports/add`}                   component={AddFeesReport} />
                    <Route path={`${basePath}/fees-reports/id/:feesReportId/edit`} component={EditFeesReport} />
                </Route>
            </Switch>
        </div>
    );
}

export default ReportRoutes;
