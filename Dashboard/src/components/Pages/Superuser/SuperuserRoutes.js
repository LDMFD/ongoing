import React from 'react';
import { Switch, Route, useLocation, useRouteMatch } from "react-router-dom";

import AdminSpaceWrapper from './SuperuserSpaceWrapper';
import OrgRoutes from './Organisations/OrgRoutes';

const ClientRoutes = () => {
    let { path } = useRouteMatch();

    let location = useLocation();

    // See https://v5.reactrouter.com/web/example/modal-gallery
    let background = location.state && location.state.background;

    return (
        <div style={{ position: "relative"}}>
            <Switch location={background || location}>
                <Route path={`${path}`}>
                    <AdminSpaceWrapper>
                        <Route path={`${path}/organisations`} component={OrgRoutes} />
                    </AdminSpaceWrapper>
                </Route>
            </Switch>
        </div>
    );
}
    
export default ClientRoutes;
