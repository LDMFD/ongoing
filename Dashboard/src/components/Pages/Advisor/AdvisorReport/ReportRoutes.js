import React from 'react';
import { Switch, Route, useLocation, useRouteMatch } from "react-router-dom";

import { ModuleEditor }       from '../Reviews/Modules/ModuleEditor';
import Dates                  from 'Components/ReviewComponents/Dates/ReviewDates';
import EditDatesDialog        from 'Components/ReviewComponents/Dates/EditDatesDialog';
import Introduction           from 'Components/ReviewComponents/Introduction';
import PolicyValuations       from 'Components/ReviewComponents/PolicyValuations';
import ReportConclusionRoutes from './ReportConclusionRoutes';
import ReportFeeRoutes        from './ReportFeeRoutes';
import ReportProfileRoutes    from './ReportProfileRoutes';
import ReportTabs             from './ReportTabs';

const AdvisorReportRoutes = () => {
    let { path } = useRouteMatch();

    let location = useLocation();

    let background = location.state && location.state.background;

    let basePath = '/clients/id/:clientId/modules';

    return (
        <div style={{ position: "relative"}}>
            <Switch location={background || location}>
                <Route path={`${path}`}>
                    <ReportTabs>
                        <Switch>
                            <Route path={`${basePath}/introduction`}             component={Introduction} />
                            <Route path={`${basePath}/profile`}                  component={ReportProfileRoutes} />
                            <Route path={`${basePath}/policy-valuations`}        component={PolicyValuations} />
                            <Route path={`${basePath}/fees`}                     component={ReportFeeRoutes} />
                            <Route path={`${basePath}/assessments`}              component={ReportConclusionRoutes} />
                            <Route path={`${basePath}/dates`}                    component={Dates} />
                        </Switch>
                    </ReportTabs>
                    <Route path={`${basePath}/:page/edit/:rmod/:field`}          component={ModuleEditor} />
                    <Route path={`${basePath}/:page/:subpage/edit/:rmod/:field`} component={ModuleEditor} />
                    <Route path={`${basePath}/dates/edit`}                       component={EditDatesDialog} />
                </Route>
            </Switch>
        </div>
    );
}

export default AdvisorReportRoutes;
