import React, { useContext, useState } from 'react';
import { useHistory, useParams } from "react-router-dom";

import { Context } from 'Store'
import { POPULATE_CLIENT } from 'Reducer';
import HoldingDialog from './HoldingDialog';
import { GoBack } from 'Utils';

const EditHolding = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state, dispatch] = useContext(Context);
    let [ holding, setHolding ] = useState(null);

    let { clientId, holdingId } = useParams();
    clientId = parseInt(clientId);
    holdingId = parseInt(holdingId);

    if (!holding) {
        let client = state.clients.find(c => c.Id === clientId);
        setHolding(client.Holdings.find(h => h.Id === holdingId))
        return;
    }
    const submitHandler = (e) => {
        e.preventDefault();
        if (holding.Proportion === '') {
            holding.Proportion = 1;
        }
        window.ApiClient.put(`/clients/${clientId}/holdings/${holdingId}`, {
            ...holding
        }).then(_ => {
            return window.ApiClient.get(`/clients/${clientId}`).then(res => {
                dispatch({
                    type: POPULATE_CLIENT,
                    payload: res.data,
                })
            }).then(goBack);;
        });
        return false;
    };

    return (
        <HoldingDialog holding       = {holding}
                       setHolding    = {setHolding}
                       submitLabel   = 'Update'
                       submitHandler = {submitHandler}  />
    );
}

export default EditHolding;
