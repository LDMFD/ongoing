import React, { useContext } from 'react';
import { Switch, Route, useLocation, useRouteMatch, useParams } from "react-router-dom";
import {
    Button,
    Toolbar,
} from '@mui/material';

import { Api }                from 'State';
import { Context }            from 'State/StateProvider'
import { ModuleEditor }       from '../Reviews/Modules/ModuleEditor';
import Dates                  from 'Components/ReviewComponents/Dates/Dates';
import EditDates              from 'Components/ReviewComponents/Dates/EditDates';
import Introduction           from 'Components/ReviewComponents/Introduction';
import PolicyValuations       from 'Components/ReviewComponents/PolicyValuations';
import Publish                from 'Components/ReviewComponents/Publish';
import ReportConclusionRoutes from './ReportConclusionRoutes';
import ReportFeeRoutes        from './ReportFeeRoutes';
import ReportProfileRoutes    from './ReportProfileRoutes';
import ReportTabs             from './ReportTabs';

const ReportRoutes = () => {
    let { path } = useRouteMatch();

    let location = useLocation();

    let background = location.state && location.state.background;

    let basePath = '/clients/id/:clientId/modules';

    let { clientId } = useParams();
    const [state, dispatch ] = useContext(Context);

    const addReview = async () => {
        await Api.Advisor.Reviews.Create(clientId);
        await Api.Advisor.ClientDetail.Read(dispatch, clientId);
    };

    return (
        <div style={{ position: "relative"}}>
            {state.Draft ? (
                <Switch location={background || location}>
                    <Route path={`${path}`}>
                        <ReportTabs>
                            <Switch>
                                <Route path={`${basePath}/introduction`}             component={Introduction} />
                                <Route path={`${basePath}/profile`}                  component={ReportProfileRoutes} />
                                <Route path={`${basePath}/policy-valuations`}        component={PolicyValuations} />
                                <Route path={`${basePath}/fees`}                     component={ReportFeeRoutes} />
                                <Route path={`${basePath}/assessments`}              component={ReportConclusionRoutes} />
                                <Route path={`${basePath}/publish`}                  component={Publish} />
                                <Route path={`${basePath}/dates`}                    component={Dates} />
                            </Switch>
                        </ReportTabs>
                        <Route path={`${basePath}/:page/edit/:rmod/:field`}          component={ModuleEditor} />
                        <Route path={`${basePath}/:page/:subpage/edit/:rmod/:field`} component={ModuleEditor} />
                        <Route path={`${basePath}/dates/edit`}                       component={EditDates} />
                    </Route>
                </Switch>
            ) : (
                <Toolbar className="breadcrumb-action">
                    <Button onClick={addReview}>Start new review</Button>
                </Toolbar>
            )}
        </div>
    );
}

export default ReportRoutes;
