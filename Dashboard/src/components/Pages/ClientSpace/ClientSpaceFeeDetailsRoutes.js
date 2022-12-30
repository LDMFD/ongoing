import AdviceFees from 'Components/ReviewComponents/Fees/FeeModules/Details/DetailModules/AdviceFees';
import DimFees from 'Components/ReviewComponents/Fees/FeeModules/Details/DetailModules/DimFees';
import FundLevelFees from 'Components/ReviewComponents/Fees/FeeModules/Details/DetailModules/FundLevelFees';
import PlatformFees from 'Components/ReviewComponents/Fees/FeeModules/Details/DetailModules/PlatformFees/PlatformFees';
import PortfolioLevelFees from 'Components/ReviewComponents/Fees/FeeModules/Details/DetailModules/PortfolioLevelFees';
import FeeDetailsTabs from 'Components/ReviewComponents/Fees/FeeModules/Details/FeeDetailsTabs';
import { GetReport } from 'Components/ReviewComponents/GetReport';
import React from 'react';
import { useLocation, useRouteMatch, Switch, Route } from "react-router-dom";

const ClientSpaceFeeDetailsRoutes = () => {
    let report = GetReport();
    
    let basePath = '/client-space/reviews/:reviewId/modules/:module/details';
    let baseTarget = `/client-space/reviews/${report.Id}/modules/fees/details`;

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

export default ClientSpaceFeeDetailsRoutes;
