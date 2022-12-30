import React, { useContext } from 'react';
import { useLocation, useRouteMatch, Switch, Route } from "react-router-dom";

import { Context } from 'State';
import ReportFeeDetailsRoutes from 'Components/Pages/Advisor/AdvisorReport/ReportFeeDetailsRoutes';
import FeeTotals from 'Components/ReviewComponents/Fees/FeeModules/FeeTotals';
import FeesIntroduction from 'Components/ReviewComponents/Fees/FeeModules/FeesIntroduction';
import FeeTabs from 'Components/ReviewComponents/Fees/FeeTabs';

const ReportFeeRoutes = () => {
    const [state,  ] = useContext(Context);
    let client = state.Metadata;

    let basePath = '/clients/id/:clientId/modules/:module';
    let baseTarget = `/clients/id/${client.Id}/modules/fees`;

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
                            <Route path={`${basePath}/details/:feepage`} component={ReportFeeDetailsRoutes} />
                        </Switch>
                    </FeeTabs>
                </Route>

            </Switch>
        </div>
    );
}

export default ReportFeeRoutes;
