// TODO rename AdvisorSpaceClientTabs

import React, { useEffect, useContext, useCallback, useState } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import {
    Breadcrumbs,
    Button,
    Tab,
    Tabs,
    Toolbar,
} from '@mui/material';

import { Context } from 'State/StateProvider'
import { RouteMatch } from 'Utils/Routing';
import { Api } from 'State';

const ClientWrapper = ({ children }) => {
    let { clientId } = useParams();
    
    const [ state, dispatch ] = useContext(Context);

    let [ loaded, setLoaded ] = useState(false);

    const getDependencies = useCallback(async () => {
        await Api.Clients.ClientDetail.Read(dispatch, clientId);
        setLoaded(true);
    }, [ dispatch, clientId ]);

    useEffect(() => {
        getDependencies();
    }, [ getDependencies ]);

    let client = state.Clients.find(c => c.Id === clientId);

    const { pathname } = useLocation();

    function ClientTabs() {
        const routeMatch = RouteMatch(pathname, [
            '/clients/id/:clientId/policies',
            '/clients/id/:clientId/policy-funds',
            '/clients/id/:clientId/portfolios',
            '/clients/id/:clientId/risk-assessments',
            '/clients/id/:clientId/modules',
            '/clients/id/:clientId/reviews',
            '/clients/id/:clientId',
        ]);
        const currentTab = routeMatch?.path;
        return (
            <Tabs value={currentTab}>
                <Tab label="Account"          value="/clients/id/:clientId"                  to={`/clients/id/${clientId}`}                      component={Link} />
                <Tab label="Policies"         value="/clients/id/:clientId/policies"         to={`/clients/id/${clientId}/policies`}             component={Link} />
                <Tab label="Policy funds"     value="/clients/id/:clientId/policy-funds"     to={`/clients/id/${clientId}/policy-funds`}         component={Link} />
                <Tab label="Portfolios"       value="/clients/id/:clientId/portfolios"       to={`/clients/id/${clientId}/portfolios`}           component={Link} />
                <Tab label="Risk Assessments" value="/clients/id/:clientId/risk-assessments" to={`/clients/id/${clientId}/risk-assessments`}     component={Link} />
                <Tab label="Report"           value="/clients/id/:clientId/modules"          to={`/clients/id/${clientId}/modules/introduction`} component={Link} />
                <Tab label="Reviews"          value="/clients/id/:clientId/reviews"          to={`/clients/id/${clientId}/reviews`}              component={Link} />
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

            <Toolbar className="breadcrumb-action">
                <Link to={{ pathname: `/clients/id/${client.Id}/edit` }}><Button>Edit client</Button></Link>
            </Toolbar>

            <ClientTabs />

            {children}
        </div>
    ) : null;
}

export default ClientWrapper;
