import React, { useContext } from 'react';
import { useHistory, useParams } from "react-router-dom";

import { Context } from 'State/StateProvider'
import { DefaultPolicyFund } from './DefaultPolicyFund';
import PolicyFundDialog from './PolicyFundDialog';
import { GoBack } from 'Utils/Routing';
import { Api } from 'State';

const AddPolicyFund = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    let { clientId } = useParams();

    const [ state, dispatch ] = useContext(Context);

    const submitHandler = async (policyFund) => {
        await Api.Advisor.PolicyFunds.Create(clientId, policyFund);
        await Api.Advisor.ClientDetail.Read(dispatch, clientId);
        goBack();
    };

    return (
        <PolicyFundDialog policyFund    = {DefaultPolicyFund}
                          state         = {state}
                          submitLabel   = 'Add'
                          submitHandler = {submitHandler}  />
    );
}

export default AddPolicyFund;
