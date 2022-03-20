import React from 'react';
import { useLocation, useRouteMatch, Switch, Route } from "react-router-dom";

import FeeTabs from './FeeTabs';

import FundLevelFees from './FeeModules/FundLevelFees';
import PortfolioLevelFees from './FeeModules/PortfolioLevelFees';
import FeesIntroduction from './FeeModules/FeesIntroduction';
import AdviceFees from './FeeModules/AdviceFees';
import PlatformFees from './FeeModules/PlatformFees';
import DimFees from './FeeModules/DimFees';

const FeeRoutesBase = ({ basePath, baseTarget }) => {
    let { path } = useRouteMatch();

    let location = useLocation();

    let background = location.state && location.state.background;

    return (
        <div style={{ position: "relative"}}>
            <Switch location={background || location}>
                <Route path={`${path}`}>
                    <FeeTabs basePath={basePath} baseTarget={baseTarget}>
                        <Switch>
                            <Route path={`${basePath}/intro`}           component={FeesIntroduction} />
                            <Route path={`${basePath}/advice`}          component={AdviceFees} />
                            <Route path={`${basePath}/platform`}        component={PlatformFees} />
                            <Route path={`${basePath}/fund-level`}      component={FundLevelFees} />
                            <Route path={`${basePath}/portfolio-level`} component={PortfolioLevelFees} />
                            <Route path={`${basePath}/dim`}             component={DimFees} />
                        </Switch>
                    </FeeTabs>
                    {/* <Route path={`${basePath}/:page/edit/:rmod/:field`} component={EditModuleText} /> */}
                </Route>

            </Switch>
        </div>
    );
};

export default FeeRoutesBase;
