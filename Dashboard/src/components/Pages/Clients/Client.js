import React, { useEffect, useContext, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';

import Breadcrumbs from '@mui/material/Breadcrumbs';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';

import { Context } from '../../../Store'
import { POPULATE_CLIENT, SET_CLIENTS } from '../../../Reducer';

import Review from './Review';

const Client = () => {
    let { clientId } = useParams();
    clientId = parseInt(clientId);
    
    const [ state, dispatch ] = useContext(Context);

    const getClients = useCallback(() => {
        window.ApiClient.get("/clients").then(res => {
            dispatch({
                type: SET_CLIENTS,
                payload: res.data,
            });
        });
    }, [ dispatch ]);

    const getClientDetail = useCallback(() => {
        window.ApiClient.get(`/clients/${clientId}`).then(res => {
            dispatch({
                type: POPULATE_CLIENT,
                payload: res.data,
            });
        });
    }, [ dispatch, clientId ]);

    useEffect(() => {
        getClients();
        getClientDetail();
    }, [ getClients, getClientDetail ]);

    const addReview = () => {
        window.ApiClient.post(`/clients/${client.Id}/reviews`).then(_ => {
            getClients();
            getClientDetail();
        });
    };

    let client = state.clients.find(c => c.Id === clientId);

    return client ? (
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
                <Button onClick={addReview}>Add review</Button>
                <Link to={{ pathname: `/clients/id/${client.Id}/edit` }}><Button>Edit client</Button></Link>
            </Toolbar>

            <br /><br /><br />
            {client.Reviews ? client.Reviews.map(review => (
                <div key={review.Id}>
                    <Review review={review} />
                    <br />
                </div>
            )) : 'No reviews'}
        </div>
    ) : null;
}

export default Client;
