import React, { useContext, useState } from 'react';
import { useHistory, useParams } from "react-router-dom";

import { Context } from 'Store'
import { POPULATE_CLIENT } from 'Reducer';
import { DefaultPolicyFund } from './DefaultPolicyFund';
import PolicyFundDialog from './PolicyFundDialog';
import { GoBack } from 'Utils';

const AddPolicyFund = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    let { clientId } = useParams();
    clientId = parseInt(clientId);

    const [, dispatch] = useContext(Context);

    let [ policyFund, setPolicyFund ] = useState(DefaultPolicyFund);

    const submitHandler = (e) => {
        e.preventDefault();
        if (policyFund.Proportion === '') {
            policyFund.Proportion = 1;
        }
        window.ApiClient.post(`/clients/${clientId}/policy-funds`, {
            ...policyFund
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
        <PolicyFundDialog policyFund    = {policyFund}
                          setPolicyFund = {setPolicyFund}
                          submitLabel   = 'Add'
                          submitHandler = {submitHandler}  />
    );
}

export default AddPolicyFund;
