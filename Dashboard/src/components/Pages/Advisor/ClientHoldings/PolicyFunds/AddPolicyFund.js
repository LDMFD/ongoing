import React, { useContext, useState } from 'react';
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

    const [, dispatch] = useContext(Context);

    let [ policyFund, setPolicyFund ] = useState(DefaultPolicyFund);

    const submitHandler = async (e) => {
        e.preventDefault();
        // if (policyFund.Proportion === '') {
        //     policyFund.Proportion = 1;
        // }
        await Api.Clients.PolicyFunds.Create(clientId, policyFund);
        await Api.Clients.ClientDetail.Read(dispatch, clientId);
        goBack();
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
