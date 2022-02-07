import React from 'react';
import { Switch, Route, useLocation, useRouteMatch } from "react-router-dom";

import ModulePresetList from './ModulePresetList';
import AddModulePreset from './AddModulePreset';
import EditModulePreset from './EditModulePreset';

const ModulePresetRoutes = () => {
    let { path } = useRouteMatch();

    let location = useLocation();

    let background = location.state && location.state.background;

    return (
        <div style={{ position: "relative"}}>
            <Switch location={background || location}>
                <Route path={path}>
                    <ModulePresetList />
                </Route>
            </Switch>

            <Route path={`${path}/add`}>
                <AddModulePreset />
            </Route>
            <Route path={`${path}/id/:modulePresetId/edit`}>
                <EditModulePreset />
            </Route>
        </div>
    );
}

export default ModulePresetRoutes;
