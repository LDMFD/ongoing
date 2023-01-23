import ConfirmationDialog from 'Components/Library/Confirmation/ConfirmationDialog';
import React, { useContext, useState } from 'react';
import { useHistory, useParams } from "react-router-dom";

import { Api } from 'State';
import { Context } from 'State/StateProvider'
import { GoBack } from 'Utils/Routing';

const DeletePolicy = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state, dispatch ] = useContext(Context);
    let [ policy, setPolicy ] = useState(null);

    let { clientId, policyId } = useParams();

    const onDelete = async (e) => {
        e.preventDefault();

        await Api.Advisor.Policies.Delete(clientId, policyId);
        await Api.Advisor.ClientDetail.Read(dispatch, clientId);

        goBack();
        return false;
    };

    if (!policy) {
        let p = state.Report.Policies.find(p => p.Id === policyId);
        setPolicy(p)
        return;
    }

    return (
        <ConfirmationDialog label      = 'Delete policy?'
                            okCallback = {onDelete}  />
    );
}

export default DeletePolicy;
