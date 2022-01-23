import { Switch, Route } from "react-router-dom";

import ClientRoutes         from './Pages/Clients/ClientRoutes';
import OperatorRoutes       from './Pages/Services/Operators/OperatorRoutes';
import FundRoutes           from './Pages/Services/Funds/FundRoutes';
import ModelRoutes          from './Pages/Services/Models/ModelRoutes';
import PolicyTypeRoutes     from './Pages/Services/PolicyTypes/PolicyTypeRoutes';
import PolicyProviderRoutes from './Pages/Services/PolicyProviders/PolicyProviderRoutes';
  
const routes = () => (
    <Switch>
        <Route path="/clients"          component={ClientRoutes} />
        <Route path="/operators"        component={OperatorRoutes} />
        <Route path="/funds"            component={FundRoutes} />
        <Route path="/models"           component={ModelRoutes} />
        <Route path="/policy-types"     component={PolicyTypeRoutes} />
        <Route path="/policy-providers" component={PolicyProviderRoutes} />
        <Route path="/" />
    </Switch>
);
export default routes;
