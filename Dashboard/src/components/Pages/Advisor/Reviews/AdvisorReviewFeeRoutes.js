import React, { useContext } from 'react';
import { Switch, Route, useLocation, useRouteMatch } from "react-router-dom";

import { Context } from 'State';
import { GetReport } from 'Components/ReviewComponents/GetReport';
import FeesIntroduction from 'Components/ReviewComponents/Fees/FeeModules/FeesIntroduction';
import FeeTotals from 'Components/ReviewComponents/Fees/FeeModules/FeeTotals';
import FeeTabs from 'Components/ReviewComponents/Fees/FeeTabs';
import AdvisorReviewFeeDetailsRoutes from './AdvisorReviewFeeDetailsRoutes';

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
                            <Route path={`${basePath}/intro`}            component={FeesIntroduction} />
                            <Route path={`${basePath}/totals`}           component={FeeTotals} />
                            <Route path={`${basePath}/details/:feepage`} component={AdvisorReviewFeeDetailsRoutes} />
                        </Switch>
                    </FeeTabs>
                </Route>

            </Switch>
        </div>
    );
}

export default AdvisorReviewFeeRoutes;
