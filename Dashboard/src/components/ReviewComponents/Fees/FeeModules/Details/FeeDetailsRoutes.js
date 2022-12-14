import React from 'react';
import { useLocation, useRouteMatch, Switch, Route } from "react-router-dom";

import FeeDetailsTabs from './FeeDetailsTabs';

import AdviceFees         from './DetailModules/AdviceFees';
import PlatformFees       from './DetailModules/PlatformFees';
import FundLevelFees      from './DetailModules/FundLevelFees';
import PortfolioLevelFees from './DetailModules/PortfolioLevelFees';
import DimFees            from './DetailModules/DimFees';

const FeeDetailsRoutes = ({ baseTarget }) => {
    let { path } = useRouteMatch();

    let location = useLocation();

    let background = location.state && location.state.background;

    let basePath = '/clients/id/:clientId/modules/fees/details';
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

export default FeeDetailsRoutes;
