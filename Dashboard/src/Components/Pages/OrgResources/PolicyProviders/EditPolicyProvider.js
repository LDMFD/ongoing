import React, { useContext, useState } from 'react';
import { useHistory, useParams } from "react-router-dom";

import { Api } from 'State';
import { Context } from 'State/StateProvider'
import { GoBack } from 'Utils/Routing';
import PolicyProviderDialog from './PolicyProviderDialog';

const EditPolicyProvider = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state, dispatch ] = useContext(Context);

    let { policyProviderId } = useParams();

    const [ error, setError ] = useState(null);

    const submitHandler = async (provider) => {
        let response = await Api.OrgResources.PolicyProviders.Update(provider);
        if (response.error) {
            setError(response.error);
        } else {
            await Api.OrgResources.Entities.Read(dispatch);
            goBack();
        }
    };

    let provider = state.Resources.PolicyProviders.find(o => o.Id === policyProviderId);

    return (
        <PolicyProviderDialog
            provider       = {provider}
            state          = {state}
            submitLabel    = 'Update'
            submitHandler  = {submitHandler}
            error          = {error}
        />
    );
}

export default EditPolicyProvider;
