import React from 'react';
import { Switch, Route, useLocation, useRouteMatch } from "react-router-dom";

import AddClient          from './ClientManagement/AddClient';
import ClientAccountPage  from './ClientManagement/Account'
import ClientList         from './ClientManagement/ClientList';
import ClientWrapper      from './AdvisorSpaceWrapper';
import EditClient         from './ClientManagement/EditClient';
import HoldingsRoutes     from './ClientHoldings/HoldingsRoutes';
import DocumentsRoutes    from './ClientDocuments/DocumentsRoutes';
import ReportRoutes       from './AdvisorReport/ReportRoutes';
import ReviewList         from './Reviews/AdvisorReviewList';
import ReviewRoutes       from './Reviews/ReviewRoutes';

const ClientRoutes = () => {
    let { path } = useRouteMatch();

    let location = useLocation();

    // See https://v5.reactrouter.com/web/example/modal-gallery
    let background = location.state && location.state.background;

    return (
        <div style={{ position: "relative"}}>
            <Switch location={background || location}>
                <Route path={`${path}/id/:clientId`}>
                    <ClientWrapper>
                        <Switch>
                            <Route path={`${path}/id/:clientId/reviews/id/:reviewId/modules/:module`} component={ReviewRoutes} />
                            <Route path={`${path}/id/:clientId/reviews/id/:reviewId`} component={ReviewRoutes} />

                            <Route path={`${path}/id/:clientId/holdings`} component={HoldingsRoutes} />
                            <Route path={`${path}/id/:clientId/documents`} component={DocumentsRoutes} />

                            <Route path={`${path}/id/:clientId/modules/:module`} component={ReportRoutes} />
                            <Route path={`${path}/id/:clientId/report`} component={ReportRoutes} />

                            <Route path={`${path}/id/:clientId/reviews`} component={ReviewList} />
                            <Route path={`${path}/id/:clientId`} component={ClientAccountPage} />
                        </Switch>
                        
                        <Route path={`${path}/id/:clientId/edit`} component={EditClient} />
                    </ClientWrapper>
                </Route>
                <Route path={path} component={ClientList} />
            </Switch>
    
            <Route path={`${path}/add`} component={AddClient} />
        </div>
    );
}
    
export default ClientRoutes;
