import React, { useContext } from 'react';
import { Switch, Route, useLocation, useRouteMatch } from "react-router-dom";

import AdviceFees from 'Components/ReviewComponents/Fees/FeeModules/Details/DetailModules/AdviceFees';
import DimFees from 'Components/ReviewComponents/Fees/FeeModules/Details/DetailModules/DimFees';
import FundLevelFees from 'Components/ReviewComponents/Fees/FeeModules/Details/DetailModules/FundLevelFees';
import PlatformFees from 'Components/ReviewComponents/Fees/FeeModules/Details/DetailModules/PlatformFees/PlatformFees';
import PortfolioLevelFees from 'Components/ReviewComponents/Fees/FeeModules/Details/DetailModules/PortfolioLevelFees';

import FeeDetailsTabs from '../../../ReviewComponents/Fees/FeeModules/Details/FeeDetailsTabs';
import { Context } from 'State';
import { GetReport } from 'Components/ReviewComponents/GetReport';

const AdvisorReviewFeeDetailsRoutes = () => {
    const [state,  ] = useContext(Context);
    let client = state.Metadata;

    let report = GetReport();

    let basePath = '/clients/id/:clientId/reviews/id/:reviewId/modules/:module/details';
    let baseTarget = `/clients/id/${client.Id}/reviews/id/${report.Id}/modules/fees/details`;

    let { path } = useRouteMatch();

    let location = useLocation();

    let background = location.state && location.state.background;

    return (
        <div style={{ position: "relative"}}>
            <Switch location={background || location}>
                <Route path={`${path}`}>
                    <FeeDetailsTabs basePath={basePath} baseTarget={baseTarget}>
                        <Switch>
                            <Route path={`${basePath}/advice`}          component={AdviceFees} />
                            <Route path={`${basePath}/platform`}        component={PlatformFees} />
                            <Route path={`${basePath}/fund-level`}      component={FundLevelFees} />
                            <Route path={`${basePath}/portfolio-level`} component={PortfolioLevelFees} />
                            <Route path={`${basePath}/dim`}             component={DimFees} />
                        </Switch>
                    </FeeDetailsTabs>
                </Route>

            </Switch>
        </div>
    );
};

export default AdvisorReviewFeeDetailsRoutes;
