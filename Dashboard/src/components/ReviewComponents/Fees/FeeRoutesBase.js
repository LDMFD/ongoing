import React from 'react';
import { useLocation, useRouteMatch, Switch, Route } from "react-router-dom";

import FeeTabs from './FeeTabs';

import FeesIntroduction   from './FeeModules/FeesIntroduction';
import FeeDetailsRoutes   from './FeeModules/Details/FeeDetailsRoutes';
import FeeTotals          from './FeeModules/FeeTotals';

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
                            <Route path={`${basePath}/intro`}            component={FeesIntroduction} />
                            <Route path={`${basePath}/totals`}           component={FeeTotals} />
                            <Route path={`${basePath}/details/:feepage`} component={FeeDetailsRoutes} />
                        </Switch>
                    </FeeTabs>
                </Route>

            </Switch>
        </div>
    );
};

export default FeeRoutesBase;
