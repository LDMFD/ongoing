import React from 'react';
import { Switch, Route, useLocation, useRouteMatch } from "react-router-dom";

import OperatorList from './OperatorList';
import Operator from './Operator';
import AddOperator from './AddOperator';
import EditOperator from './EditOperator';

const OperatorRoutes = () => {
    let { path } = useRouteMatch();

    let location = useLocation();

    let background = location.state && location.state.background;

    return (
        <div style={{ position: "relative"}}>
            <Switch location={background || location}>
                <Route path={`${path}/id/:operatorId`}>
                    <Operator />
                </Route>

                <Route path={path}>
                    <OperatorList />
                </Route>
            </Switch>

            <Route path={`${path}/add`}>
                <AddOperator />
            </Route>
            <Route path={`${path}/id/:operatorId/edit`}>
                <EditOperator />
            </Route>
        </div>
    );
}

export default OperatorRoutes;
