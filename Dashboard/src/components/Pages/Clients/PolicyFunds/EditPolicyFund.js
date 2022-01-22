import React, { useContext, useState } from 'react';
import { useHistory, useParams } from "react-router-dom";

import { Context } from 'StateProvider'
import { POPULATE_CLIENT } from 'Reducer';
import PolicyFundDialog from './PolicyFundDialog';
import { GoBack } from 'Utils';

const EditPolicyFund = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state, dispatch] = useContext(Context);
    let [ policyFund, setPolicyFund ] = useState(null);

    let { clientId, policyFundId } = useParams();
    clientId = parseInt(clientId);
    policyFundId = parseInt(policyFundId);

    if (!policyFund) {
        let client = state.Clients.find(c => c.Id === clientId);
        setPolicyFund(client.PolicyFunds.find(h => h.Id === policyFundId))
        return;
    }
    const submitHandler = (e) => {
        e.preventDefault();
        if (policyFund.Proportion === '') {
            policyFund.Proportion = 1;
        }
        window.ApiClient.put(`/clients/${clientId}/policy-funds/${policyFundId}`, {
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
        <PolicyFundDialog policyFund       = {policyFund}
                          setPolicyFund    = {setPolicyFund}
                          submitLabel      = 'Update'
                          submitHandler    = {submitHandler}  />
    );
}

export default EditPolicyFund;
