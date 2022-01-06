import React from 'react';
import { Switch, Route, useLocation, useRouteMatch } from "react-router-dom";

import PolicyTypeList from './PolicyTypeList';
import PolicyType from './PolicyType';
import AddPolicyType from './AddPolicyType';
import EditPolicyType from './EditPolicyType';

const PolicyTypeRoutes = () => {
    let { path } = useRouteMatch();

    let location = useLocation();

    let background = location.state && location.state.background;

    return (
        <div style={{ position: "relative"}}>
            <Switch location={background || location}>
                <Route path={`${path}/id/:policyTypeId`}>
                    <PolicyType />
                </Route>

                <Route path={path}>
                    <PolicyTypeList />
                </Route>
            </Switch>

            <Route path={`${path}/add`}>
                <AddPolicyType />
            </Route>
            <Route path={`${path}/id/:policyTypeId/edit`}>
                <EditPolicyType />
            </Route>
        </div>
    );
}

export default PolicyTypeRoutes;
