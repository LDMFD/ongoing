import React, { useEffect, useContext, useCallback, useState } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import {
    Breadcrumbs,
    Button,
    Tab,
    Tabs,
    Toolbar,
} from '@mui/material';

import { POPULATE_CLIENT } from 'State/Reducer';
import { Context } from 'State/StateProvider'
import { RouteMatch } from 'Utils';

const ClientWrapper = ({ children }) => {
    let { clientId } = useParams();
    clientId = parseInt(clientId);
    
    const [ state, dispatch ] = useContext(Context);

    let [ loaded, setLoaded ] = useState(false);

    const getClientDetail = useCallback(() => {
        return window.ApiClient.get(`/clients/${clientId}`).then(res => {
            dispatch({
                type: POPULATE_CLIENT,
                payload: res.data,
            });
        });
    }, [ dispatch, clientId ]);

    const getDependencies = useCallback(async () => {
        await getClientDetail();

        setLoaded(true);
    }, [
        getClientDetail,
    ]);

    useEffect(() => {
        getDependencies();
    }, [ getDependencies ]);

    let client = state.Clients.find(c => c.Id === clientId);

    const { pathname } = useLocation();

    function ClientTabs() {
        const routeMatch = RouteMatch(pathname, [
            '/clients/id/:clientId/portfolios',
            '/clients/id/:clientId/policy-funds',
            '/clients/id/:clientId/reviews',
            '/clients/id/:clientId',
        ]);
        const currentTab = routeMatch?.path;
        return (
            <Tabs value={currentTab}>
                <Tab label="Policies"      value="/clients/id/:clientId"               to={`/clients/id/${clientId}`}               component={Link} />
                <Tab label="Policy funds"  value="/clients/id/:clientId/policy-funds"  to={`/clients/id/${clientId}/policy-funds`}  component={Link} />
                <Tab label="Portfolios"    value="/clients/id/:clientId/portfolios"    to={`/clients/id/${clientId}/portfolios`}    component={Link} />
                <Tab label="Reviews"       value="/clients/id/:clientId/reviews"       to={`/clients/id/${clientId}/reviews`}       component={Link} />
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
                    {client.Surname}, {client.Forenames}
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
