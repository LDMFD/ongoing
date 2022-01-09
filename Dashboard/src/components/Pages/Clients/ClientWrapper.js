import React, { useEffect, useContext, useCallback, useState } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';

import Breadcrumbs from '@mui/material/Breadcrumbs';
import Button from '@mui/material/Button';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Toolbar from '@mui/material/Toolbar';

import {
    POPULATE_CLIENT,
    SET_CLIENTS,
    SET_OPERATORS,
    SET_PORTFOLIOS,
    SET_POLICY_TYPES,
    SET_POLICY_PROVIDERS,
} from 'Reducer';
import { Context } from 'Store'
import { RouteMatch } from 'Utils';

// import Review from './Review';

const ClientWrapper = ({ children }) => {
    let { clientId } = useParams();
    clientId = parseInt(clientId);
    
    const [ state, dispatch ] = useContext(Context);

    let [ loaded, setLoaded ] = useState(false);

    const getClients = useCallback(() => {
        return window.ApiClient.get("/clients").then(res => {
            dispatch({
                type: SET_CLIENTS,
                payload: res.data,
            });
        });
    }, [ dispatch ]);

    const getClientDetail = useCallback(() => {
        return window.ApiClient.get(`/clients/${clientId}`).then(res => {
            dispatch({
                type: POPULATE_CLIENT,
                payload: res.data,
            });
        });
    }, [ dispatch, clientId ]);

    const getOperators = useCallback(() => {
        return window.ApiClient.get("/operators").then(res => {
            dispatch({
                type: SET_OPERATORS,
                payload: res.data,
            });
        });
    }, [ dispatch ]);

    const getPolicyProviders = useCallback(() => {
        return window.ApiClient.get("/policy-providers").then(res => {
            dispatch({
                type: SET_POLICY_PROVIDERS,
                payload: res.data,
            });
        });
    }, [ dispatch ]);

    const getPolicyTypes = useCallback(() => {
        return window.ApiClient.get("/policy-types").then(res => {
            dispatch({
                type: SET_POLICY_TYPES,
                payload: res.data,
            });
        });
    }, [ dispatch ]);

    const getPortfolios = useCallback(() => {
        return window.ApiClient.get("/portfolios").then(res => {
            dispatch({
                type: SET_PORTFOLIOS,
                payload: res.data,
            });
        });
    }, [ dispatch ]);


    const getDependencies = useCallback(async () => {
        await getOperators();
        await getPolicyProviders();
        await getPolicyTypes();
        await getPortfolios();

        await getClients();
        await getClientDetail();

        setLoaded(true);
    }, [
        getOperators,
        getPolicyProviders,
        getPolicyTypes,
        getPortfolios,

        getClients,
        getClientDetail,
    ]);

    useEffect(() => {
        getDependencies();
    }, [ getDependencies ]);

    let client = state.clients.find(c => c.Id === clientId);

    const { pathname } = useLocation();

    function ClientTabs() {
        const routeMatch = RouteMatch(pathname, [
            '/clients/id/:clientId/policies',
            '/clients/id/:clientId/reviews',
            '/clients/id/:clientId',
        ]);
        const currentTab = routeMatch?.path;
        return (
            <Tabs value={currentTab}>
                <Tab label="Holdings" value="/clients/id/:clientId"          to={`/clients/id/${clientId}`}          component={Link} />
                <Tab label="Policies" value="/clients/id/:clientId/policies" to={`/clients/id/${clientId}/policies`} component={Link} />
                <Tab label="Reviews"  value="/clients/id/:clientId/reviews"  to={`/clients/id/${clientId}/reviews`}  component={Link} />
            </Tabs>
        );
    }

    return loaded ? (
        <div className='reviews'>
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
