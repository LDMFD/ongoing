import React from 'react';
import { Switch, Route, useLocation, useRouteMatch } from "react-router-dom";

import PolicyGroupList from './PolicyGroupList';
import AddPolicyGroup from './AddPolicyGroup';
import EditPolicyGroup from './EditPolicyGroup';
import DeletePolicyGroup from './DeletePolicyGroup';

const PolicyGroupRoutes = () => {
    let { path } = useRouteMatch();

    let location = useLocation();

    let background = location.state && location.state.background;

    return (
        <div style={{ position: "relative"}}>
            <Switch location={background || location}>
                <Route path={path}>
                    <PolicyGroupList />
                </Route>
            </Switch>

            <Route path={`${path}/add`}>
                <AddPolicyGroup />
            </Route>
            <Route path={`${path}/id/:policyGroupId/edit`}>
                <EditPolicyGroup />
            </Route>
            <Route path={`${path}/id/:policyGroupId/delete`}>
                <DeletePolicyGroup />
            </Route>
        </div>
    );
}

export default PolicyGroupRoutes;
