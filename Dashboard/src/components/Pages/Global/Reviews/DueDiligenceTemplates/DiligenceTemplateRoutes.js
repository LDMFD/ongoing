import React from 'react';
import { Switch, Route, useLocation, useRouteMatch } from "react-router-dom";

import DiligenceTemplateList from './DiligenceTemplateList';
import AddDiligenceTemplate from './AddDiligenceTemplate';
import EditDiligenceTemplate from './EditDiligenceTemplate';

const DiligenceTemplateRoutes = () => {
    let { path } = useRouteMatch();

    let location = useLocation();

    let background = location.state && location.state.background;

    return (
        <div style={{ position: "relative"}}>
            <Switch location={background || location}>
                <Route path={path}>
                    <DiligenceTemplateList />
                </Route>
            </Switch>

            <Route path={`${path}/add`}>
                <AddDiligenceTemplate />
            </Route>
            <Route path={`${path}/id/:diligenceTemplateId/edit`}>
                <EditDiligenceTemplate />
            </Route>
        </div>
    );
}

export default DiligenceTemplateRoutes;
