import React from 'react';
import { Switch, Route, useLocation, useRouteMatch } from "react-router-dom";

import StaffWrapper from './StaffWrapper';
import AdvisorRoutes from './Advisors/AdvisorRoutes';

const StaffRoutes = () => {
    let { path } = useRouteMatch();

    let location = useLocation();

    let background = location.state && location.state.background;

    return (
        <div style={{ position: "relative"}}>
            <Switch location={background || location}>
                <Route path={`${path}`}>
                    <StaffWrapper>
                        <Route path={`${path}`} component={AdvisorRoutes} />
                    </StaffWrapper>
                </Route>
            </Switch>
        </div>
    );
}
    
export default StaffRoutes;
