import ConfirmationDialog from 'Components/Library/Confirmation/ConfirmationDialog';
import React, { useContext, useState } from 'react';
import { useHistory, useParams } from "react-router-dom";

import { Api } from 'State';
import { Context } from 'State/StateProvider'
import { GoBack } from 'Utils/Routing';

const DeletePolicyProvider = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state, dispatch ] = useContext(Context);
    let [ policyProvider, setPolicyProvider ] = useState(null);

    let { policyProviderId } = useParams();

    const onDelete = async (e) => {
        e.preventDefault();

        await Api.OrgResources.PolicyProviders.Delete(policyProviderId)
        await Api.OrgResources.Entities.Read(dispatch);

        goBack();
        return false;
    };

    if (!policyProvider) {
        let p = state.Resources.PolicyProviders.find(p => p.Id === policyProviderId);
        setPolicyProvider(p)
        return;
    }

    return (
        <ConfirmationDialog label      = 'Delete policy provider?'
                            okCallback = {onDelete}  />
    );
}

export default DeletePolicyProvider;
