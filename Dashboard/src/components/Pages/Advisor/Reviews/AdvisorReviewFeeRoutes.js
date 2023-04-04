import React, { useContext } from 'react';
import { Switch, Route, useLocation, useRouteMatch } from "react-router-dom";

import { Context } from 'State';
import { GetReport } from 'Components/ReviewComponents/GetReport';
import AdvisorReviewFeeDetailsRoutes from './AdvisorReviewFeeDetailsRoutes';
import FeeTabs from 'Components/ReviewComponents/Fees/FeeTabs';
import FeeTotals from 'Components/ReviewComponents/Fees/FeeModules/FeeTotals';
import ImpactOfGrowthChart from 'Components/ReviewComponents/Fees/FeeModules/Impact/ImpactOfCharges';

const AdvisorReviewFeeRoutes = () => {
    const [state,  ] = useContext(Context);
    let client = state.Metadata;

    let report = GetReport();

    let basePath = '/clients/id/:clientId/reviews/id/:reviewId/modules/:module';
    let baseTarget = `/clients/id/${client.Id}/reviews/id/${report.Id}/modules/fees`;

    let { path } = useRouteMatch();

    let location = useLocation();

    let background = location.state && location.state.background;

    return (
        <div style={{ position: "relative"}}>
            <Switch location={background || location}>
                <Route path={`${path}`}>
                    <FeeTabs basePath={basePath} baseTarget={baseTarget}>
                        <Switch>
                            <Route path={`${basePath}/totals`}           component={FeeTotals} />
                            <Route path={`${basePath}/details/:feepage`} component={AdvisorReviewFeeDetailsRoutes} />
                            <Route path={`${basePath}/impact`}           component={ImpactOfGrowthChart} />
                        </Switch>
                    </FeeTabs>
                </Route>

            </Switch>
        </div>
    );
}

export default AdvisorReviewFeeRoutes;
