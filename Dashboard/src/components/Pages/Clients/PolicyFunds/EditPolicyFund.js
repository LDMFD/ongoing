import React, { useContext, useState } from 'react';
import { useHistory, useParams } from "react-router-dom";

import { Context } from 'State/StateProvider'
import { POPULATE_CLIENT } from 'State/Reducer';
import PolicyFundDialog from './PolicyFundDialog';
import { GoBack } from 'Utils/Routing';

const EditPolicyFund = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state, dispatch] = useContext(Context);
    let [ policyFund, setPolicyFund ] = useState(null);

    let { policyFundId } = useParams();
    policyFundId = parseInt(policyFundId);
    
    let client = state.ClientContext;
    
    if (!policyFund) {
        setPolicyFund(client.PolicyFunds.find(h => h.Id === policyFundId))
        return;
    }
    const submitHandler = (e) => {
        e.preventDefault();
        if (policyFund.Proportion === '') {
            policyFund.Proportion = 1;
        }
        window.ApiClient.put(`advisor/clients/${client.Id}/policy-funds/${policyFundId}`, {
            ...policyFund
        }).then(_ => {
            return window.ApiClient.get(`advisor/clients/${client.Id}`).then(res => {
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
