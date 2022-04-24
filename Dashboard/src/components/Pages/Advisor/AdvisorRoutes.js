import React from 'react';
import { Switch, Route, useLocation, useRouteMatch } from "react-router-dom";

import AddClient          from './ClientManagement/AddClient';
import AddFactFind        from './ClientDocuments/FactFinds/AddFactFind';
import AddPolicy          from './ClientHoldings/Policies/AddPolicy';
import AddPolicyFund      from './ClientHoldings/PolicyFunds/AddPolicyFund';
import AddPortfolio       from './ClientHoldings/Portfolios/AddPortfolio';
import AddRiskAssessment  from './ClientDocuments/RiskAssessments/AddRiskAssessment';
import ClientAccountPage  from './ClientManagement/Account'
import ClientList         from './ClientManagement/ClientList';
import ClientWrapper      from './AdvisorSpaceWrapper';
import EditClient         from './ClientManagement/EditClient';
import EditFactFind       from './ClientDocuments/FactFinds/EditFactFind';
import EditPolicy         from './ClientHoldings/Policies/EditPolicy';
import EditPolicyFund     from './ClientHoldings/PolicyFunds/EditPolicyFund';
import EditPortfolio      from './ClientHoldings/Portfolios/EditPortfolio';
import EditRiskAssessment from './ClientDocuments/RiskAssessments/EditRiskAssessment';
import FactFindList       from './ClientDocuments/FactFinds/FactFindList';
import PolicyFundList     from './ClientHoldings/PolicyFunds/PolicyFundList';
import PolicyList         from './ClientHoldings/Policies/PolicyList';
import PortfolioList      from './ClientHoldings/Portfolios/PortfolioList';
import ReportRoutes       from './AdvisorReport/ReportRoutes';
import ReviewList         from './Reviews/AdvisorReviewList';
import ReviewRoutes       from './Reviews/ReviewRoutes';
import RiskAssessmentList from './ClientDocuments/RiskAssessments/RiskAssessmentList';

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
                            <Route path={`${path}/id/:clientId/fact-finds`} component={FactFindList} />
                            <Route path={`${path}/id/:clientId/risk-assessments`} component={RiskAssessmentList} />
                            <Route path={`${path}/id/:clientId`} component={ClientAccountPage} />
                        </Switch>
                        
                        <Route path={`${path}/id/:clientId/edit`} component={EditClient} />

                        <Route path={`${path}/id/:clientId/portfolios/add`} component={AddPortfolio} />
                        <Route path={`${path}/id/:clientId/portfolios/id/:portfolioId/edit`} component={EditPortfolio} />

                        <Route path={`${path}/id/:clientId/policies/add`} component={AddPolicy} />
                        <Route path={`${path}/id/:clientId/policies/id/:policyId/edit`} component={EditPolicy} />
                        
                        <Route path={`${path}/id/:clientId/policy-funds/add`} component={AddPolicyFund} />
                        <Route path={`${path}/id/:clientId/policy-funds/id/:policyFundId/edit`} component={EditPolicyFund} /> 

                        <Route path={`${path}/id/:clientId/risk-assessments/add`} component={AddRiskAssessment} />
                        <Route path={`${path}/id/:clientId/risk-assessments/id/:riskAssessmentId/edit`} component={EditRiskAssessment} />

                        <Route path={`${path}/id/:clientId/fact-finds/add`} component={AddFactFind} />
                        <Route path={`${path}/id/:clientId/fact-finds/id/:factFindId/edit`} component={EditFactFind} />
                    </ClientWrapper>
                </Route>
                <Route path={path} component={ClientList} />
            </Switch>
    
            <Route path={`${path}/add`} component={AddClient} />
        </div>
    );
}
    
export default ClientRoutes;
