import ConfirmationDialog from 'Components/Library/Confirmation/ConfirmationDialog';
import React, { useContext, useState } from 'react';
import { useHistory, useParams } from "react-router-dom";

import { Api } from 'State';
import { Context } from 'State/StateProvider'
import { GoBack } from 'Utils/Routing';

const DeletePolicyFund = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state, dispatch ] = useContext(Context);
    let [ policyFund, setPolicyFund ] = useState(null);

    let { clientId, policyFundId } = useParams();

    const onDelete = async (e) => {
        e.preventDefault();

        await Api.Advisor.PolicyFunds.Delete(clientId, policyFundId);
        await Api.Advisor.ClientDetail.Read(dispatch, clientId);

        goBack();
        return false;
    };

    if (!policyFund) {
        let p = state.Report.PolicyFunds.find(p => p.Id === policyFundId);
        setPolicyFund(p)
        return;
    }

    return (
        <ConfirmationDialog label      = 'Delete policy fund?'
                            okCallback = {onDelete}  />
    );
}

export default DeletePolicyFund;
