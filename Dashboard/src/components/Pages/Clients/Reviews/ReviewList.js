import React, { useContext, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
    Button,
    Toolbar,
} from '@mui/material';

import { Context } from 'StateProvider'
import { POPULATE_CLIENT, SET_CLIENTS } from 'Reducer';

const ReviewList = () => {
    let { clientId } = useParams();
    clientId = parseInt(clientId);

    const [ state, dispatch ] = useContext(Context);

    let client = state.Clients.find(c => c.Id === clientId);

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

    const addReview = () => {
        window.ApiClient.post(`/clients/${client.Id}/reviews`).then(_ => {
            getClients().then(() => {
                getClientDetail();
            });
        });
    };

    return client?.Reviews && (
        <div>
            <Toolbar className="breadcrumb-action">
                <Button onClick={addReview}>Add review</Button>
            </Toolbar>

            {client.Reviews.map(r => (
                <div key={r.Id}>
                    id:{r.Id}
                </div>
            ))}
        </div>
    );
}

export default ReviewList;
