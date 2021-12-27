import React from 'react';
import { Switch, Route, useLocation, useRouteMatch } from "react-router-dom";

import ClientList from './ClientList';
import Reviews from './Client';
import AddClient from './AddClient';
import EditClient from './EditClient';

const ClientRoutes = () => {
    let { path } = useRouteMatch();

    let location = useLocation();

    // See https://v5.reactrouter.com/web/example/modal-gallery
    let background = location.state && location.state.background;

    return (
        <div style={{ position: "relative"}}>
            <Switch location={background || location}>
                <Route path={`${path}/id/:clientId`}>
                    <Reviews />

                    {/* <Route path={`${path}/id/:clientId/edit`}>
                        <EditClient />
                    </Route> */}
                </Route>

                <Route path={path}>
                    <ClientList />
                </Route>
            </Switch>

            <Route path={`${path}/add`}>
                <AddClient />
            </Route>
            <Route path={`${path}/id/:clientId/edit`}>
                <EditClient />
            </Route>
        </div>
    );
}

export default ClientRoutes;
