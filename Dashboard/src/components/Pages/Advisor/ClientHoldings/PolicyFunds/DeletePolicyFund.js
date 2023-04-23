import ConfirmationDialog from 'Components/Library/Confirmation/ConfirmationDialog';
import { useContext, useState } from 'react';
import { useParams } from "react-router-dom";

import { Api } from 'State';
import { Context } from 'State/StateProvider';

const DeletePolicyFund = () => {
    const [ state, dispatch ] = useContext(Context);
    let [ policyFund, setPolicyFund ] = useState(null);

    let { clientId, policyFundId } = useParams();

    const onDelete = async (e) => {
        let res = await Api.Advisor.PolicyFunds.Delete(clientId, policyFundId);
        await Api.Advisor.ClientDetail.Read(dispatch, clientId);
        return res;
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
