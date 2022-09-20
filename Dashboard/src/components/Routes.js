import { Switch, Route } from "react-router-dom";

import SuperuserRoutes      from './Pages/Superuser/SuperuserRoutes';
import StaffRoutes          from "./Pages/Advisor/Staff/StaffRoutes";
import ClientRoutes         from './Pages/Advisor/AdvisorRoutes';
import OperatorRoutes       from './Pages/Global/Operators/OperatorRoutes';
import FundRoutes           from './Pages/Global/Funds/FundRoutes';
import ModelRoutes          from './Pages/Global/Models/ModelRoutes';
import PolicyTypeRoutes     from './Pages/Global/PolicyTypes/PolicyTypeRoutes';
import PolicyProviderRoutes from './Pages/Global/PolicyProviders/PolicyProviderRoutes';
import RiskProviderRoutes   from './Pages/Global/RiskProviders/RiskProviderRoutes';
import ModulePresetRoutes   from './Pages/Global/Reviews/ModulePresets/ModulePresetRoutes';

import ClientSpaceRoutes from "./Pages/ClientSpace/ClientSpaceRoutes";
  
const routes = () => (
    <Switch>
        <Route path="/admin"                          component={SuperuserRoutes} />
        <Route path="/staff"                          component={StaffRoutes} />

        <Route path="/clients"                        component={ClientRoutes} />
        <Route path="/operators"                      component={OperatorRoutes} />
        <Route path="/funds"                          component={FundRoutes} />
        <Route path="/models"                         component={ModelRoutes} />
        <Route path="/policy-types"                   component={PolicyTypeRoutes} />
        <Route path="/policy-providers"               component={PolicyProviderRoutes} />
        <Route path="/risk-providers"                 component={RiskProviderRoutes} />
        <Route path="/review-config/module-presets"   component={ModulePresetRoutes} />

        <Route path="/client-space"                   component={ClientSpaceRoutes} />
        
        <Route path="/" />
    </Switch>
);
export default routes;
