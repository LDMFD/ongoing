import React, { useContext, useState } from 'react';
import { useHistory, useParams } from "react-router-dom";

import { Context } from 'State/StateProvider'
import { Api } from 'State';
import { GoBack } from 'Utils/Routing';
import PolicyProviderDialog from './PolicyProviderDialog';

const EditPolicyProvider = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state, dispatch] = useContext(Context);

    let [ policyProvider, setPolicyProvider ] = useState(null);

    let { policyProviderId } = useParams();

    const submitHandler = async (e) => {
        e.preventDefault();
        await Api.OrgResources.PolicyProviders.Update(policyProvider);
        await Api.OrgResources.Entities.Read(dispatch);
        goBack();
        return false;
    };

    if (!policyProvider) {
        setPolicyProvider(state.Resources.PolicyProviders.find(o => o.Id === policyProviderId))
        return;
    }

    return (
        <PolicyProviderDialog policyProvider      = {policyProvider}
                              setPolicyProvider   = {setPolicyProvider}
                              submitLabel         = 'Update'
                              submitHandler       = {submitHandler} />
    );
}

export default EditPolicyProvider;
