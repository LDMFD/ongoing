import { Switch, Route } from "react-router-dom";

import AdvisorClientRoutes  from './Pages/Advisor/AdvisorRoutes';
import FundRoutes           from './Pages/OrgResources/Funds/FundRoutes';
import ModelRoutes          from './Pages/OrgResources/Models/ModelRoutes';
import ModulePresetRoutes   from './Pages/OrgResources/Reviews/ModulePresets/ModulePresetRoutes';
import OperatorRoutes       from './Pages/OrgResources/Operators/OperatorRoutes';
import PolicyProviderRoutes from './Pages/OrgResources/PolicyProviders/PolicyProviderRoutes';
import PolicyTypeRoutes     from './Pages/OrgResources/PolicyTypes/PolicyTypeRoutes';
import RiskProviderRoutes   from './Pages/OrgResources/RiskProviders/RiskProviderRoutes';
import StaffRoutes          from "./Pages/Advisor/Staff/StaffRoutes";
import SuperuserRoutes      from './Pages/Superuser/SuperuserRoutes';

import ClientSpaceRoutes from "./Pages/ClientSpace/ClientSpaceRoutes";
import NoMatch from "./Pages/404/404";
import { Api } from "State";
  
const routes = () => (
    <Switch>
        <Route path="/admin"                          component={SuperuserRoutes} />
        <Route path="/staff"                          component={StaffRoutes} />

        <Route path="/clients"                        component={AdvisorClientRoutes} />
        <Route path="/operators"                      component={OperatorRoutes} />
        <Route path="/funds"                          component={FundRoutes} />
        <Route path="/models"                         component={ModelRoutes} />
        <Route path="/policy-types"                   component={PolicyTypeRoutes} />
        <Route path="/platforms"                      component={PolicyProviderRoutes} />
        <Route path="/risk-providers"                 component={RiskProviderRoutes} />
        <Route path="/review-config/module-presets"   component={ModulePresetRoutes} />

        <Route path="/client-space"                   component={ClientSpaceRoutes} />

        <Route path="/throw"                          component={() => {
            throw new Error("Test error"); }}
        />
        <Route path="/throw-server"                   component={() => {
            const _throw = async () => {
                await Api.Superuser.Throw.Throw();
            };
            _throw();
        }} />
        
        <Route path="*">
            <NoMatch />
        </Route>
    </Switch>
);

export default routes;
