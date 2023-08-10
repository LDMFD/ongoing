import { DeletionConfirmation } from 'Components/Library/Confirmation/DeletionConfirmation';
import React, { useContext, useState } from 'react';
import { useParams } from "react-router-dom";

import { Api } from 'State';
import { Context } from 'State/StateProvider'

const DeletePolicy = () => {
    const [ state, dispatch ] = useContext(Context);
    let [ policy, setPolicy ] = useState(null);

    let { clientId, policyId } = useParams();

    const onDelete = async (execute) => {
        let res = await Api.Advisor.Policies.Delete(clientId, policyId, execute);
        await Api.Advisor.ClientDetail.Read(dispatch, clientId);
        return res;
    };

    if (!policy) {
        let p = state.Report.Policies.find(p => p.Id === policyId);
        setPolicy(p)
        return;
    }
    return (
        <DeletionConfirmation
            handler    = {onDelete}
            label      = {`Delete policy ${policy.ExternalId}?`}
            warning    = 'This policy is currently in use by the following holdings, which will also be deleted if this policy is deleted:'
            prompt     = {<>Are you sure you want to delete this policy <b>{policy.ExternalId}</b></>}
            dependents = 'and all linked holdings'
        />
    );
}

export default DeletePolicy;
