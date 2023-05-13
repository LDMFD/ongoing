import React from 'react';
import { useLocation, useRouteMatch, Switch, Route } from "react-router-dom";

import ProfileTabs from './ProfileTabs';

import FactFind          from './ProfileModules/FactFind';
import RiskQuestionnaire from './ProfileModules/RiskQuestionnaire';
import Goals             from './ProfileModules/Goals';

const ProfileRoutesBase = ({ basePath, baseTarget }) => {
    let { path } = useRouteMatch();

    let location = useLocation();

    let background = location.state && location.state.background;

    return (
        <div style={{ position: "relative"}}>
            <Switch location={background || location}>
                <Route path={`${path}`}>
                    <ProfileTabs basePath={basePath} baseTarget={baseTarget}>
                        <Switch>
                            <Route path={`${basePath}/fact-find`}          component={FactFind} />
                            <Route path={`${basePath}/risk-questionnaire`} component={RiskQuestionnaire} />
                            <Route path={`${basePath}/goals`}              component={Goals} />
                        </Switch>
                    </ProfileTabs>
                </Route>

            </Switch>
        </div>
    );
};

export default ProfileRoutesBase;
