import React from 'react';
import { Switch, Route, useLocation, useRouteMatch } from "react-router-dom";

import Export from './Export';
import Integrations from './Integrations/Integrations';
import SettingsTabs from './SettingsTabs';
import PlannrAccountChooser from './Integrations/Plannr/PlannrAccountChooser';
import PlannrClientList from './Integrations/Plannr/PlannrClientList';

const SettingsRoutes = () => {
    let { path } = useRouteMatch();

    let location = useLocation();

    let background = location.state && location.state.background;

    return (
        <div style={{ position: "relative"}}>
            <Switch location={background || location}>
                <Route path={`${path}`}>
                    <SettingsTabs>
                        <Switch>
                            <Route path={`${path}/integrations`} component={Integrations} />
                            <Route path={`${path}/export`} component={Export} />
                        </Switch>
                    </SettingsTabs>
                    <Route path={`${path}/integrations/plannr/choose-account`} component={PlannrAccountChooser} />
                    <Route path={`${path}/integrations/plannr/clients`} component={PlannrClientList} />
                </Route>
            </Switch>
        </div>
    );
}
    
export default SettingsRoutes;
