import React from 'react';
import { Switch, Route, useLocation, useRouteMatch } from "react-router-dom";

import AddClient           from './ClientManagement/AddClient';
import ClientAccountPage   from './ClientManagement/ClientAccountPage'
import ClientList          from './ClientManagement/ClientList';
import ClientWrapper       from './AdvisorSpaceWrapper';
import EditClient          from './ClientManagement/EditClient';
import HoldingsRoutes      from './ClientHoldings/HoldingsRoutes';
import DocumentsRoutes     from './ClientDocuments/DocumentsRoutes';
import AdvisorReportRoutes from './AdvisorReport/ReportRoutes';
import AdvisorReviewList   from './Reviews/AdvisorReviewList';
import AdvisorReviewRoutes from './Reviews/AdvisorReviewRoutes';

const AdvisorClientRoutes = () => {
    let { path } = useRouteMatch();

    let location = useLocation();

    let background = location.state && location.state.background;

    return (
        <div style={{ position: "relative"}}>
            <Switch location={background || location}>
                <Route path={`${path}/id/:clientId`}>
                    <ClientWrapper>
                        <Switch>
                            <Route path={`${path}/id/:clientId/reviews/id/:reviewId/modules/:module`} component={AdvisorReviewRoutes} />
                            <Route path={`${path}/id/:clientId/reviews/id/:reviewId`} component={AdvisorReviewRoutes} />

                            <Route path={`${path}/id/:clientId/holdings`} component={HoldingsRoutes} />
                            <Route path={`${path}/id/:clientId/documents`} component={DocumentsRoutes} />

                            <Route path={`${path}/id/:clientId/modules/:module`} component={AdvisorReportRoutes} />
                            <Route path={`${path}/id/:clientId/report`} component={AdvisorReportRoutes} />

                            <Route path={`${path}/id/:clientId/reviews`} component={AdvisorReviewList} />
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
    
export default AdvisorClientRoutes;
