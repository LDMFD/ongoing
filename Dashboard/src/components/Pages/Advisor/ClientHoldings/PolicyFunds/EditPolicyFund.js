import React, { useContext } from 'react';
import { useHistory, useParams } from "react-router-dom";

import { Context } from 'State/StateProvider'
import PolicyFundDialog from './PolicyFundDialog';
import { GoBack } from 'Utils/Routing';
import { Api } from 'State';

const EditPolicyFund = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state, dispatch] = useContext(Context);

    let { policyFundId } = useParams();
    
    let client = state.Metadata;
    
    const submitHandler = async (policyFund) => {
        await Api.Advisor.PolicyFunds.Update(client.Id, policyFund);
        await Api.Advisor.ClientDetail.Read(dispatch, client.Id);
        goBack();
    };

    let policyFund = state.Report.PolicyFunds.find(h => h.Id === policyFundId);

    return (
        <PolicyFundDialog policyFund       = {policyFund}
                          state            = {state}
                          submitLabel      = 'Update'
                          submitHandler    = {submitHandler}  />
    );
}

export default EditPolicyFund;
