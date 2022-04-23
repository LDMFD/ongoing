import React from 'react';
import { Switch, Route, useLocation, useRouteMatch } from "react-router-dom";

import ReportTabs from './ReportTabs';

import Conclusions from 'Components/ReviewComponents/Conclusions';
import Introduction from 'Components/ReviewComponents/Introduction';
import PolicyValuations from 'Components/ReviewComponents/PolicyValuations';
import { EditModuleText } from '../Reviews/Modules/ModuleEditor';
import ReportFeeRoutes from './ReportFeeRoutes';
import ReportProfileRoutes from './ReportProfileRoutes';

const ReportRoutes = () => {
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
                            <Route path={`${basePath}/introduction`}      component={Introduction} />
                            <Route path={`${basePath}/profile`}           component={ReportProfileRoutes} />
                            <Route path={`${basePath}/policy-valuations`} component={PolicyValuations} />
                            <Route path={`${basePath}/fees`}              component={ReportFeeRoutes} />
                            <Route path={`${basePath}/conclusions`}       component={Conclusions} />
                        </Switch>
                    </ReportTabs>
                    <Route path={`${basePath}/:page/edit/:rmod/:field`}   component={EditModuleText} />
                    <Route path={`${basePath}/:page/:subpage/edit/:rmod/:field`}   component={EditModuleText} />
                </Route>
            </Switch>
        </div>
    );
}

export default ReportRoutes;
