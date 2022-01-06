import { Switch, Route } from "react-router-dom";

import ClientRoutes from './Pages/Clients/ClientRoutes';
import OperatorRoutes from './Pages/Funds/Operators/OperatorRoutes';
import PolicyTypeRoutes from './Pages/Funds/PolicyTypes/PolicyTypeRoutes';
  
export default (
    <Switch>
        <Route path="/clients">
            <ClientRoutes />
        </Route>

        <Route path="/operators">
            <OperatorRoutes />
        </Route>

        <Route path="/policy-types">
            <PolicyTypeRoutes />
        </Route>

        <Route path="/" />
    </Switch>
);
