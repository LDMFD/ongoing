import React from 'react';
import { useLocation, useRouteMatch, Switch, Route } from "react-router-dom";

import ConclusionTabs from './ConclusionTabs';

import AdviceGiven        from './ConclusionModules/AdviceGiven';
import DueDiligence       from './ConclusionModules/DueDiligence';
import Forecast           from './ConclusionModules/Forecast';
import OngoingSuitability from './ConclusionModules/OngoingSuitability';
import ActionPoints       from './ConclusionModules/ActionPoints';
import Goals              from './ConclusionModules/Goals';

const ConclusionRoutesBase = ({ basePath, baseTarget }) => {
    let { path } = useRouteMatch();

    let location = useLocation();

    let background = location.state && location.state.background;

    return (
        <div style={{ position: "relative"}}>
            <Switch location={background || location}>
                <Route path={`${path}`}>
                    <ConclusionTabs basePath={basePath} baseTarget={baseTarget}>
                        <Switch>
                            <Route path={`${basePath}/goals`}               component={Goals} />
                            <Route path={`${basePath}/ongoing-suitability`} component={OngoingSuitability} />
                            <Route path={`${basePath}/due-diligence`}       component={DueDiligence} />
                            <Route path={`${basePath}/forecast`}            component={Forecast} />
                            <Route path={`${basePath}/advice-given`}        component={AdviceGiven} />
                            <Route path={`${basePath}/action-points`}       component={ActionPoints} />
                        </Switch>
                    </ConclusionTabs>
                </Route>

            </Switch>
        </div>
    );
};

export default ConclusionRoutesBase;
