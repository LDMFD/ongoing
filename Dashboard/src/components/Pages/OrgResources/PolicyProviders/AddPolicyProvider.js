import React, { useContext, useState } from 'react';
import { useHistory } from "react-router-dom";

import { Api } from 'State';
import { Context } from 'State/StateProvider'
import { DefaultPolicyProvider } from './DefaultPolicyProvider';
import { GoBack } from 'Utils/Routing';
import PolicyProviderDialog from './PolicyProviderDialog';

const AddPolicyProvider = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state, dispatch] = useContext(Context);

    const [ error, setError ] = useState(null);

    const submitHandler = async (provider) => {
        let response = await Api.OrgResources.PolicyProviders.Create(provider);
        if (response.error) {
            setError(response.error);
        } else {
            await Api.OrgResources.Entities.Read(dispatch);
            goBack();
        }
    };

    return (
        <PolicyProviderDialog
            state         = {state}
            provider      = {DefaultPolicyProvider}
            submitLabel   = 'Add'
            submitHandler = {submitHandler}
            error         = {error}
        />
    );
}

export default AddPolicyProvider;
