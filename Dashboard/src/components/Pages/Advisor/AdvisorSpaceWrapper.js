// TODO rename AdvisorSpaceClientTabs

import React, { useEffect, useContext, useCallback, useState } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import {
    Breadcrumbs,
    Tab,
    Tabs,
} from '@mui/material';

import { Context } from 'State/StateProvider'
import { RouteMatch } from 'Utils/Routing';
import { Api } from 'State';

const ClientWrapper = ({ children }) => {
    let { clientId } = useParams();
    
    const [ state, dispatch ] = useContext(Context);

    let [ loaded, setLoaded ] = useState(false);

    const getDependencies = useCallback(async () => {
        await Api.Advisor.ClientDetail.Read(dispatch, clientId);
        setLoaded(true);
    }, [ dispatch, clientId ]);

    useEffect(() => {
        getDependencies();
    }, [ getDependencies ]);

    let client = state.Clients.find(c => c.Id === clientId);

    const { pathname } = useLocation();

    function ClientTabs() {
        const routeMatch = RouteMatch(pathname, [
            '/clients/id/:clientId/holdings',
            '/clients/id/:clientId/documents',
            '/clients/id/:clientId/modules',
            '/clients/id/:clientId/reviews',
            '/clients/id/:clientId',
        ]);
        const currentTab = routeMatch?.path;
        let rootValue = '/clients/id/:clientId';
        let rootTo = `/clients/id/${clientId}`;
        return (
            <Tabs value={currentTab}>
                <Tab label="Account"             value={`${rootValue}`}           to={`${rootTo}`}                            component={Link} />
                <Tab label="Holdings"            value={`${rootValue}/holdings`}  to={`${rootTo}/holdings/policies`}          component={Link} />
                <Tab label="Documents"           value={`${rootValue}/documents`} to={`${rootTo}/documents/risk-assessments`} component={Link} />
                <Tab label="Current state"       value={`${rootValue}/modules`}   to={`${rootTo}/modules/introduction`}       component={Link} />
                <Tab label="Reviews"             value={`${rootValue}/reviews`}   to={`${rootTo}/reviews`}                    component={Link} />
            </Tabs>
        );
    }

    return loaded ? (
        <div>
            <Breadcrumbs aria-label="breadcrumb">
                <Link underline="hover" color="inherit" to='/clients'>
                    Clients
                </Link>
                <Link underline="hover" color="inherit" to={window.location}>
                    {client.Identity.Surname}, {client.Identity.Forenames}
                </Link>
            </Breadcrumbs>

            <ClientTabs />

            {children}
        </div>
    ) : null;
}

export default ClientWrapper;
