import React, { useContext, useState } from 'react';
import { useHistory, useParams } from "react-router-dom";

import { Context } from 'Store'
import { POPULATE_CLIENT } from 'Reducer';
import { DefaultHolding } from './DefaultHolding';
import HoldingDialog from './HoldingDialog';
import { GoBack } from 'Utils';

const AddHolding = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    let { clientId } = useParams();
    clientId = parseInt(clientId);

    const [, dispatch] = useContext(Context);

    let [ holding, setHolding ] = useState(DefaultHolding);

    const submitHandler = (e) => {
        e.preventDefault();
        if (holding.Proportion === '') {
            holding.Proportion = 1;
        }
        window.ApiClient.post(`/clients/${clientId}/holdings`, {
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
                       submitLabel   = 'Add'
                       submitHandler = {submitHandler}  />
    );
}

export default AddHolding;
