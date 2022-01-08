import React from 'react';
import { Switch, Route, useLocation, useRouteMatch } from "react-router-dom";

import PortfolioList from './PortfolioList';
// import Portfolio from './Portfolio';
import AddPortfolio from './AddPortfolio';
import EditPortfolio from './EditPortfolio';
import PortfolioWrapper from './PortfolioWrapper';

const PortfolioRoutes = () => {
    let { path } = useRouteMatch();

    let location = useLocation();

    let background = location.state && location.state.background;

    return (
        <div style={{ position: "relative"}}>
            <PortfolioWrapper>
                <Switch location={background || location}>
                    {/* <Route path={`${path}/id/:portfolioId`}>
                        <Portfolio />
                    </Route> */}

                    <Route path={path}>
                        <PortfolioList />
                    </Route>
                </Switch>

                    <Route path={`${path}/add`}>
                        <AddPortfolio />
                    </Route>
                    <Route path={`${path}/id/:portfolioId/edit`}>
                        <EditPortfolio />
                    </Route>
            </PortfolioWrapper>
        </div>
    );
}

export default PortfolioRoutes;
