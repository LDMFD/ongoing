import React from 'react';
import { Switch, Route, useLocation, useRouteMatch } from "react-router-dom";

import AddPolicy from './Policies/AddPolicy';
import AddPolicyFund from './PolicyFunds/AddPolicyFund';
import AddPortfolio from './Portfolios/AddPortfolio';
import AddProviderDiscount from './ProviderDiscounts/AddProviderDiscount';
import DeletePlatformDiscount from './ProviderDiscounts/DeletePlatformDiscount';
import DeletePolicy from './Policies/DeletePolicy';
import DeletePolicyFund from './PolicyFunds/DeletePolicyFund';
import DeletePortfolio from './Portfolios/DeletePortfolio';
import EditPolicy from './Policies/EditPolicy';
import EditPolicyFund from './PolicyFunds/EditPolicyFund';
import EditPortfolio from './Portfolios/EditPortfolio';
import EditProviderDiscount from './ProviderDiscounts/EditProviderDiscount';
import HoldingsTabs from './HoldingsTabs';
import PolicyFundList from './PolicyFunds/PolicyFundList';
import PolicyList from './Policies/PolicyList';
import PortfolioList from './Portfolios/PortfolioList';
import PlatformDiscountList from './ProviderDiscounts/ProviderDiscountList';

const ReportRoutes = () => {
    let { path } = useRouteMatch();

    let location = useLocation();

    let background = location.state && location.state.background;

    let basePath = '/clients/id/:clientId/holdings';

    return (
        <div style={{ position: "relative"}}>
            <Switch location={background || location}>
                <Route path={`${path}`}>
                    <HoldingsTabs>
                        <Switch>
                            <Route path={`${basePath}/platform-discounts`} component={PlatformDiscountList} />
                            <Route path={`${basePath}/portfolios`}         component={PortfolioList} />
                            <Route path={`${basePath}/policy-funds`}       component={PolicyFundList} />
                            <Route path={`${basePath}/policies`}           component={PolicyList} />
                        </Switch>
                    </HoldingsTabs>

                    <Route path={`${basePath}/platform-discounts/add`}                           component={AddProviderDiscount} />
                    <Route path={`${basePath}/platform-discounts/id/:providerDiscountId/delete`} component={DeletePlatformDiscount} />
                    <Route path={`${basePath}/platform-discounts/id/:providerDiscountId/edit`}   component={EditProviderDiscount} />

                    <Route path={`${basePath}/portfolios/add`}                       component={AddPortfolio} />
                    <Route path={`${basePath}/portfolios/id/:portfolioId/delete`}    component={DeletePortfolio} />
                    <Route path={`${basePath}/portfolios/id/:portfolioId/edit`}      component={EditPortfolio} />

                    <Route path={`${basePath}/policies/add`}                         component={AddPolicy} />
                    <Route path={`${basePath}/policies/id/:policyId/delete`}         component={DeletePolicy} />
                    <Route path={`${basePath}/policies/id/:policyId/edit`}           component={EditPolicy} />
                    
                    <Route path={`${basePath}/policy-funds/add`}                     component={AddPolicyFund} />
                    <Route path={`${basePath}/policy-funds/id/:policyFundId/edit`}   component={EditPolicyFund} /> 
                    <Route path={`${basePath}/policy-funds/id/:policyFundId/delete`} component={DeletePolicyFund} /> 
                </Route>
            </Switch>
        </div>
    );
}

export default ReportRoutes;
