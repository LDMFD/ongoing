import React from 'react';
import { Switch, Route, useLocation, useRouteMatch } from "react-router-dom";

import OrgList from './OrgList';
import AddOrg from './AddOrg';
import EditOrg from './EditOrg';

const OrgRoutes = () => {
    let { path } = useRouteMatch();

    let location = useLocation();

    let background = location.state && location.state.background;

    return (
        <div style={{ position: "relative"}}>
            <Switch location={background || location}>
                <Route path={path}>
                    <OrgList />
                </Route>
            </Switch>

            <Route path={`${path}/add`}>
                <AddOrg />
            </Route>
            <Route path={`${path}/id/:orgId/edit`}>
                <EditOrg />
            </Route>
        </div>
    );
}

export default OrgRoutes;
