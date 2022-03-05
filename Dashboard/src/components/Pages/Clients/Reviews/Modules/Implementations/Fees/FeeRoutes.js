import React from 'react';
import { Switch, Route, useLocation, useRouteMatch } from "react-router-dom";

import FeeTabs from './FeeTabs';

import FundLevelFees from './FeeModules/FundLevel';
import PortfolioLevelFees from './FeeModules/PortfolioLevel';
import Introduction from './FeeModules/Introduction';
import AdviceFees from './FeeModules/Advice';
import PlatformFees from './FeeModules/Platform';
import DimFees from './FeeModules/DimFees';
import { EditModuleText } from '../../EditModule';

const FeeRoutes = () => {
    let { path } = useRouteMatch();

    let location = useLocation();

    let background = location.state && location.state.background;

    let basePath = '/clients/id/:clientId/reviews/id/:reviewId/modules/:module';

    return (
        <div style={{ position: "relative"}}>
            <Switch location={background || location}>
                <Route path={`${path}`}>
                    <FeeTabs>
                        <Switch>
                            <Route path={`${basePath}/advice`}          component={AdviceFees} />
                            <Route path={`${basePath}/platform`}        component={PlatformFees} />
                            <Route path={`${basePath}/fund-level`}      component={FundLevelFees} />
                            <Route path={`${basePath}/portfolio-level`} component={PortfolioLevelFees} />
                            <Route path={`${basePath}/dim`}             component={DimFees} />
                            <Route path={`${basePath}/intro`}           component={Introduction} />
                        </Switch>
                    </FeeTabs>
                    <Route path={`${basePath}/:page/edit/:rmod/:field`} component={EditModuleText} />
                </Route>

            </Switch>
        </div>
    );
}

export default FeeRoutes;
