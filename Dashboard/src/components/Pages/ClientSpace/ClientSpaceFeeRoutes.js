import React from 'react';
import { Switch, Route, useLocation, useRouteMatch } from "react-router-dom";

import { GetReport } from 'Components/ReviewComponents/GetReport';
import FeesIntroduction from 'Components/ReviewComponents/Fees/FeeModules/FeesIntroduction';
import FeeTotals from 'Components/ReviewComponents/Fees/FeeModules/FeeTotals';
import ClientSpaceFeeDetailsRoutes from './ClientSpaceFeeDetailsRoutes';
import FeeTabs from 'Components/ReviewComponents/Fees/FeeTabs';

const ClientSpaceFeeRoutes = () => {
    let report = GetReport();

    let basePath = '/client-space/reviews/:reviewId/modules/:module';
    let baseTarget = `/client-space/reviews/${report.Id}/modules/fees`;

    let { path } = useRouteMatch();

    let location = useLocation();

    let background = location.state && location.state.background;

    return (
        <div style={{ position: "relative"}}>
            <Switch location={background || location}>
                <Route path={`${path}`}>
                    <FeeTabs basePath={basePath} baseTarget={baseTarget}>
                        <Switch>
                            <Route path={`${basePath}/intro`}            component={FeesIntroduction} />
                            <Route path={`${basePath}/totals`}           component={FeeTotals} />
                            <Route path={`${basePath}/details/:feepage`} component={ClientSpaceFeeDetailsRoutes} />
                        </Switch>
                    </FeeTabs>
                </Route>

            </Switch>
        </div>
    );
}

export default ClientSpaceFeeRoutes;
