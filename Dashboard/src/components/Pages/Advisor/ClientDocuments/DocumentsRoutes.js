import React from 'react';
import { Route, Switch, useLocation, useRouteMatch } from "react-router-dom";

import DocumentsTabs from './DocumentsTabs';
import AddFactFind from './FactFinds/AddFactFind';
import DeleteFactFind from './FactFinds/DeleteFactFind';
import EditFactFind from './FactFinds/EditFactFind';
import FactFindList from './FactFinds/FactFindList';
import AddFeesReport from './FeesReport/AddFeesReport';
import DeleteFeesReport from './FeesReport/DeleteFeesReport';
import EditFeesReport from './FeesReport/EditFeesReport';
import FeesReportList from './FeesReport/FeesReportList';
import AddForecast from './Forecasts/AddForecast';
import DeleteForecast from './Forecasts/DeleteForecast';
import EditForecast from './Forecasts/EditForecast';
import ForecastList from './Forecasts/ForecastList';
import AddRiskAssessment from './RiskAssessments/AddRiskAssessment';
import DeleteRiskAssessment from './RiskAssessments/DeleteRiskAssessment';
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
                            <Route path={`${basePath}/fees-reports`}     component={FeesReportList} />
                            <Route path={`${basePath}/forecasts`}        component={ForecastList} />
                        </Switch>
                    </DocumentsTabs>

                    <Route path={`${basePath}/risk-assessments/add`}                         component={AddRiskAssessment} />
                    <Route path={`${basePath}/risk-assessments/id/:riskAssessmentId/edit`}   component={EditRiskAssessment} />
                    <Route path={`${basePath}/risk-assessments/id/:riskAssessmentId/delete`} component={DeleteRiskAssessment} />

                    <Route path={`${basePath}/fact-finds/add`}                   component={AddFactFind} />
                    <Route path={`${basePath}/fact-finds/id/:factFindId/edit`}   component={EditFactFind} />
                    <Route path={`${basePath}/fact-finds/id/:factFindId/delete`} component={DeleteFactFind} />

                    <Route path={`${basePath}/forecasts/add`}                   component={AddForecast} />
                    <Route path={`${basePath}/forecasts/id/:forecastId/edit`}   component={EditForecast} />
                    <Route path={`${basePath}/forecasts/id/:forecastId/delete`} component={DeleteForecast} />

                    <Route path={`${basePath}/fees-reports/add`}                     component={AddFeesReport} />
                    <Route path={`${basePath}/fees-reports/id/:feesReportId/edit`}   component={EditFeesReport} />
                    <Route path={`${basePath}/fees-reports/id/:feesReportId/delete`} component={DeleteFeesReport} />
                </Route>
            </Switch>
        </div>
    );
}

export default ReportRoutes;
