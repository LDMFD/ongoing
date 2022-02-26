import React, { useContext, useState } from 'react';
import { useHistory } from "react-router-dom";

import { Context } from 'State/StateProvider'
import { Api } from 'State';
import { GoBack } from 'Utils/Routing';
import { DefaultPolicyProvider } from './DefaultPolicyProvider';
import PolicyProviderDialog from './PolicyProviderDialog';

const AddPolicyProvider = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ , dispatch] = useContext(Context);
    let [ policyProvider, setPolicyProvider ] = useState(DefaultPolicyProvider);

    const submitHandler = (e) => {
        e.preventDefault();
        window.ApiClient.post("advisor/policy-providers", {
            ...policyProvider
        })
        .then(() => {
            goBack();
        })
        .then(() => {
            Api.Global.PolicyProviders.Read(dispatch)
        });
        return false;
    };

    return (
        <PolicyProviderDialog policyProvider      = {policyProvider}
                              setPolicyProvider   = {setPolicyProvider}
                              submitLabel         = 'Add'
                              submitHandler       = {submitHandler} />
    );
}

export default AddPolicyProvider;
