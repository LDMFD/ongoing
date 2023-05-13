import React from 'react';
import { Switch, Route, useLocation, useRouteMatch } from "react-router-dom";

import AddFund from './AddFund';
import DeleteFund from './DeleteFund';
import EditFund from './EditFund';
import FundList from './FundList';

const FundRoutes = () => {
    let { path } = useRouteMatch();

    let location = useLocation();

    let background = location.state && location.state.background;

    return (
        <div style={{ position: "relative"}}>
            <Switch location={background || location}>
                <Route path={path}>
                    <FundList />
                </Route>
            </Switch>

            <Route path={`${path}/add`}>
                <AddFund />
            </Route>
            <Route path={`${path}/id/:fundId/delete`}>
                <DeleteFund />
            </Route>
            <Route path={`${path}/id/:fundId/edit`}>
                <EditFund />
            </Route>
        </div>
    );
}

export default FundRoutes;
