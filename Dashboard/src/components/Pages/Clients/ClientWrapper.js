import React, { useEffect, useContext, useCallback, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import Breadcrumbs from '@mui/material/Breadcrumbs';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';

import { Context } from 'Store'
import { POPULATE_CLIENT, SET_CLIENTS } from 'Reducer';

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

    const getClient = useCallback(async () => {
        await getClients();
        await getClientDetail();
        setLoaded(true);
    }, [ getClients, getClientDetail ]);

    useEffect(() => {
        getClient();
    }, [ getClient ]);

    const addReview = () => {
        window.ApiClient.post(`/clients/${client.Id}/reviews`).then(_ => {
            getClients().then(() => {
                getClientDetail();
            });
        });
    };

    let client = state.clients.find(c => c.Id === clientId);

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
                <Link to={{ pathname: `/clients/id/${client.Id}/policies/add` }}><Button>Add policy</Button></Link>
                <Button onClick={addReview}>Add review</Button>
                <Link to={{ pathname: `/clients/id/${client.Id}/edit` }}><Button>Edit client</Button></Link>
            </Toolbar>

            {children}
        </div>
    ) : null;
}

export default ClientWrapper;
