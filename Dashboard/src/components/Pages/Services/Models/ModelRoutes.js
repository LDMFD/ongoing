import React from 'react';
import { Switch, Route, useLocation, useRouteMatch } from "react-router-dom";

import ModelList from './ModelList';
import AddModel from './AddModel';
import EditModel from './EditModel';
import ModelWrapper from './ModelWrapper';

const ModelRoutes = () => {
    let { path } = useRouteMatch();

    let location = useLocation();

    let background = location.state && location.state.background;

    return (
        <div style={{ position: "relative"}}>
            <ModelWrapper>
                <Switch location={background || location}>
                    <Route path={path}>
                        <ModelList />
                    </Route>
                </Switch>

                <Route path={`${path}/add`}>
                    <AddModel />
                </Route>
                <Route path={`${path}/id/:modelId/edit`}>
                    <EditModel />
                </Route>
            </ModelWrapper>
        </div>
    );
}

export default ModelRoutes;
