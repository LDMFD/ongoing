import React from 'react';
import { Switch, Route, useLocation, useRouteMatch } from "react-router-dom";

import AdvisorList from './AdvisorList';
import AddAdvisor from './AddAdvisor';
import EditAdvisor from './EditAdvisor';
import DeleteAdvisor from './DeleteAdvisor';

const Advisor = () => {
    let { path } = useRouteMatch();

    let location = useLocation();

    let background = location.state && location.state.background;

    return (
        <div style={{ position: "relative"}}>
            <Switch location={background || location}>
                <Route path={path}>
                    <AdvisorList />
                </Route>
            </Switch>

            <Route path={`${path}/add`}>
                <AddAdvisor />
            </Route>
            <Route path={`${path}/id/:advisorId/delete`}>
                <DeleteAdvisor />
            </Route>
            <Route path={`${path}/id/:advisorId/edit`}>
                <EditAdvisor />
            </Route>
        </div>
    );
}

export default Advisor;
