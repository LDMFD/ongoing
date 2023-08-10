import { DeletionConfirmation } from 'Components/Library/Confirmation/DeletionConfirmation';
import React, { useContext, useState } from 'react';
import { useParams } from "react-router-dom";

import { Api } from 'State';
import { Context } from 'State/StateProvider'

const DeleteRiskProvider = () => {
    const [ state, dispatch ] = useContext(Context);
    let [ riskProvider, setRiskProvider ] = useState(null);

    let { riskProviderId } = useParams();

    const onDelete = async (execute) => {
        let res = await Api.OrgResources.RiskProviders.Delete(riskProviderId, execute)
        await Api.OrgResources.Entities.Read(dispatch);
        return res;
    };

    if (!riskProvider) {
        let p = state.Resources.RiskProviders.find(p => p.Id === riskProviderId);
        setRiskProvider(p)
        return;
    }

    return (
        <DeletionConfirmation
            handler    = {onDelete}
            label      = {`Delete risk provider ${riskProvider.Name}?`}
            warning    = 'This risk provider is currently in use by client risk assessments, which will also be deleted if the provider is deleted. The clients are:'
            prompt     = {<>Are you sure you want to delete this risk provider <b>{riskProvider.Name}</b></>}
            dependents = 'and all linked assessments'
        />
    );
}

export default DeleteRiskProvider;
