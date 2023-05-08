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
import BreadcrumbBar from 'Components/Library/BreadcrumbBar/BreadcrumbBar';

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
                <Tab label="Client"     value={`${rootValue}`}           to={`${rootTo}`}                      component={Link} />
                <Tab label="Holdings"   value={`${rootValue}/holdings`}  to={`${rootTo}/holdings/policies`}    component={Link} />
                <Tab label="Documents"  value={`${rootValue}/documents`} to={`${rootTo}/documents/fact-finds`} component={Link} />
                <Tab label="Draft"      value={`${rootValue}/modules`}   to={`${rootTo}/modules/dates`}        component={Link} />
                <Tab label="Reviews"    value={`${rootValue}/reviews`}   to={`${rootTo}/reviews`}              component={Link} />
            </Tabs>
        );
    }

    return loaded ? (
        <div>
            <BreadcrumbBar>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link underline="hover" color="inherit" to='/clients'>
                        Clients
                    </Link>
                    <b>
                        <Link underline="hover" color="inherit" to={window.location}>
                            {client.Identity.Forenames} {client.Identity.Surname}
                        </Link>
                    </b>
                </Breadcrumbs>
            </BreadcrumbBar>

            <ClientTabs />

            {children}
        </div>
    ) : null;
}

export default ClientWrapper;
