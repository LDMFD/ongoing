import { Switch, Route } from "react-router-dom";

import ClientRoutes from './Pages/Clients/ClientRoutes';
  
export default (
    <Switch>
        <Route path="/clients">
            <ClientRoutes />
        </Route>

        <Route path="/" />
    </Switch>
);
