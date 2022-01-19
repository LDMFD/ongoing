import React from 'react';
import { Switch, Route, useLocation, useRouteMatch } from "react-router-dom";

import FundList from './FundList';
import AddFund from './AddFund';
import EditFund from './EditFund';
// import FundWrapper from './FundWrapper';

const FundRoutes = () => {
    let { path } = useRouteMatch();

    let location = useLocation();

    let background = location.state && location.state.background;

    return (
        <div style={{ position: "relative"}}>
            {/* <FundWrapper> */}
                <Switch location={background || location}>
                    {/* <Route path={`${path}/id/:FundId`}>
                        <Fund />
                    </Route> */}

                    <Route path={path}>
                        <FundList />
                    </Route>
                </Switch>

                    <Route path={`${path}/add`}>
                        <AddFund />
                    </Route>
                    <Route path={`${path}/id/:fundId/edit`}>
                        <EditFund />
                    </Route>
            {/* </FundWrapper> */}
        </div>
    );
}

export default FundRoutes;
