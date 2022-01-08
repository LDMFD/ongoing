import { Switch, Route } from "react-router-dom";

import ClientRoutes         from './Pages/Clients/ClientRoutes';
import OperatorRoutes       from './Pages/Funds/Operators/OperatorRoutes';
import PortfolioRoutes      from './Pages/Funds/Portfolios/PortfolioRoutes';
import PolicyTypeRoutes     from './Pages/Funds/PolicyTypes/PolicyTypeRoutes';
import PolicyProviderRoutes from './Pages/Funds/PolicyProviders/PolicyProviderRoutes';
  
export default (
    <Switch>
        <Route path="/clients"          component={ClientRoutes} />
        <Route path="/operators"        component={OperatorRoutes} />
        <Route path="/portfolios"       component={PortfolioRoutes} />
        <Route path="/policy-types"     component={PolicyTypeRoutes} />
        <Route path="/policy-providers" component={PolicyProviderRoutes} />
        <Route path="/" />
    </Switch>
);
