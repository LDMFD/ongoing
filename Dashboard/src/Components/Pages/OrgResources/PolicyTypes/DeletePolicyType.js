import { DeletionConfirmation } from 'Components/Library/Confirmation/DeletionConfirmation';
import React, { useContext, useState } from 'react';
import { useParams } from "react-router-dom";

import { Api } from 'State';
import { Context } from 'State/StateProvider'

const DeletePolicyType = () => {
    const [ state, dispatch ] = useContext(Context);
    let [ policyType, setPolicyType ] = useState(null);

    let { policyTypeId } = useParams();

    const onDelete = async (execute) => {
        let res = await Api.OrgResources.PolicyTypes.Delete(policyTypeId, execute)
        await Api.OrgResources.Entities.Read(dispatch);
        return res;
    };

    if (!policyType) {
        let p = state.Resources.PolicyTypes.find(p => p.Id === policyTypeId);
        setPolicyType(p)
        return;
    }

    return (
        <DeletionConfirmation
            handler    = {onDelete}
            label      = {`Delete policy type ${policyType.Name}?`}
            warning    = 'This policy type is currently in use by the following clients:'
            prompt     = 'The policies held by these clients will also be deleted if this policy type is deleted. Are you sure you want to delete this policy type'
            dependents = 'and all linked holdings'
        />
    );
}

export default DeletePolicyType;
