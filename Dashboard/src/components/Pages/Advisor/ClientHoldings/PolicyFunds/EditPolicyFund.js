import React, { useContext, useState } from 'react';
import { useHistory, useParams } from "react-router-dom";

import { Context } from 'State/StateProvider'
import PolicyFundDialog from './PolicyFundDialog';
import { GoBack } from 'Utils/Routing';
import { Api } from 'State';

const EditPolicyFund = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state, dispatch] = useContext(Context);
    let [ policyFund, setPolicyFund ] = useState(null);

    let { policyFundId } = useParams();
    
    let client = state.ClientContext;
    
    if (!policyFund) {
        setPolicyFund(state.Report.PolicyFunds.find(h => h.Id === policyFundId))
        return;
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        // if (policyFund.Proportion === '') {
        //     policyFund.Proportion = 1;
        // }
        await Api.Advisor.PolicyFunds.Update(client.Id, policyFund);
        await Api.Advisor.ClientDetail.Read(dispatch, client.Id);
        goBack();
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
