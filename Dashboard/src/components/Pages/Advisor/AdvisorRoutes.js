import React from 'react';
import { Switch, Route, useLocation, useRouteMatch } from "react-router-dom";

import ClientWrapper     from './AdvisorSpaceWrapper';
import PortfolioList     from './Portfolios/PortfolioList';
import AddPortfolio      from './Portfolios/AddPortfolio';
import EditPortfolio     from './Portfolios/EditPortfolio';
import AddClient         from './ClientProfiles/AddClient';
import ClientList        from './ClientProfiles/ClientList';
import ClientAccountPage from './ClientProfiles/Account'
import EditClient        from './ClientProfiles/EditClient';
import AddPolicy         from './Policies/AddPolicy';
import EditPolicy        from './Policies/EditPolicy';
import PolicyList        from './Policies/PolicyList';
import PolicyFundList    from './PolicyFunds/PolicyFundList';
import AddPolicyFund     from './PolicyFunds/AddPolicyFund';
import EditPolicyFund    from './PolicyFunds/EditPolicyFund';
import ReviewList        from './Reviews/AdvisorReviewList';
import ReportRoutes      from './AdvisorReport/ReportRoutes';
import ReviewRoutes from './Reviews/ReviewRoutes';

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

                            <Route path={`${path}/id/:clientId/modules/:module`} component={ReportRoutes} />
                            <Route path={`${path}/id/:clientId/report`} component={ReportRoutes} />

                            <Route path={`${path}/id/:clientId/reviews`} component={ReviewList} />
                            <Route path={`${path}/id/:clientId/portfolios`} component={PortfolioList} />
                            <Route path={`${path}/id/:clientId/policy-funds`} component={PolicyFundList} />
                            <Route path={`${path}/id/:clientId/policies`} component={PolicyList} />
                            <Route path={`${path}/id/:clientId`} component={ClientAccountPage} />
                        </Switch>
                        
                        <Route path={`${path}/id/:clientId/edit`} component={EditClient} />

                        <Route path={`${path}/id/:clientId/portfolios/add`} component={AddPortfolio} />
                        <Route path={`${path}/id/:clientId/portfolios/id/:portfolioId/edit`} component={EditPortfolio} />

                        <Route path={`${path}/id/:clientId/policies/add`} component={AddPolicy} />
                        <Route path={`${path}/id/:clientId/policies/id/:policyId/edit`} component={EditPolicy} />
                        
                        <Route path={`${path}/id/:clientId/policy-funds/add`} component={AddPolicyFund} />
                        <Route path={`${path}/id/:clientId/policy-funds/id/:policyFundId/edit`} component={EditPolicyFund} /> 
                    </ClientWrapper>
                </Route>
                <Route path={path} component={ClientList} />
            </Switch>
    
            <Route path={`${path}/add`} component={AddClient} />
        </div>
    );
}
    
export default ClientRoutes;
