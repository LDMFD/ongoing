import { DeletionConfirmation } from 'Components/Library/Confirmation/DeletionConfirmation';
import React, { useContext, useState } from 'react';
import { useParams } from "react-router-dom";

import { Api } from 'State';
import { Context } from 'State/StateProvider'

const DeletePolicyProvider = () => {
    const [ state, dispatch ] = useContext(Context);
    let [ policyProvider, setPolicyProvider ] = useState(null);

    let { policyProviderId } = useParams();

    const onDelete = async (execute) => {
        let res = await Api.OrgResources.PolicyProviders.Delete(policyProviderId, execute)
        await Api.OrgResources.Entities.Read(dispatch);
        return res;
    };

    if (!policyProvider) {
        let p = state.Resources.PolicyProviders.find(p => p.Id === policyProviderId);
        setPolicyProvider(p)
        return;
    }

    return (
        <DeletionConfirmation
            handler    = {onDelete}
            label      = {`Delete platform ${policyProvider.Name}?`}
            warning    = 'This platform is currently in use by the following clients:'
            prompt     = {<>Are you sure you want to delete this platform <b>{policyProvider.Name}</b></>}
            dependents = 'and all dependent holdings held by these clients'
        />
    );
}

export default DeletePolicyProvider;
