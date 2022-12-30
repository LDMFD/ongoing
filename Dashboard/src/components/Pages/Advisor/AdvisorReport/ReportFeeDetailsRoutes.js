import React, { useContext } from 'react';
import { useLocation, useRouteMatch, Switch, Route } from "react-router-dom";

import FeeDetailsTabs from '../../../ReviewComponents/Fees/FeeModules/Details/FeeDetailsTabs';

import AdviceFees         from '../../../ReviewComponents/Fees/FeeModules/Details/DetailModules/AdviceFees';
import PlatformFees       from '../../../ReviewComponents/Fees/FeeModules/Details/DetailModules/PlatformFees/PlatformFees';
import FundLevelFees      from '../../../ReviewComponents/Fees/FeeModules/Details/DetailModules/FundLevelFees';
import PortfolioLevelFees from '../../../ReviewComponents/Fees/FeeModules/Details/DetailModules/PortfolioLevelFees';
import DimFees            from '../../../ReviewComponents/Fees/FeeModules/Details/DetailModules/DimFees';
import { Context } from 'State';

const ReportFeeDetailsRoutes = () => {
    const [state,  ] = useContext(Context);
    let client = state.Metadata;

    let basePath = '/clients/id/:clientId/modules/:module/details';
    let baseTarget = `/clients/id/${client.Id}/modules/fees/details`;

    let { path } = useRouteMatch();

    let location = useLocation();

    let background = location.state && location.state.background;

    return (
        <div style={{ position: "relative"}}>
            <Switch location={background || location}>
                <Route path={`${path}`}>
                    <FeeDetailsTabs basePath={basePath} baseTarget={baseTarget}>
                        <Switch>
                            <Route path={`${basePath}/advice`}          component={AdviceFees} />
                            <Route path={`${basePath}/platform`}        component={PlatformFees} />
                            <Route path={`${basePath}/fund-level`}      component={FundLevelFees} />
                            <Route path={`${basePath}/portfolio-level`} component={PortfolioLevelFees} />
                            <Route path={`${basePath}/dim`}             component={DimFees} />
                        </Switch>
                    </FeeDetailsTabs>
                </Route>

            </Switch>
        </div>
    );
};

export default ReportFeeDetailsRoutes;
