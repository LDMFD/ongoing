import React, { useContext, useState } from 'react';
import { useHistory } from "react-router-dom";

import { Context } from 'State/StateProvider'
import Client from 'State/Client';
import { GoBack } from 'Utils';
import { DefaultPolicyProvider } from './DefaultPolicyProvider';
import PolicyProviderDialog from './PolicyProviderDialog';

const AddPolicyProvider = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ , dispatch] = useContext(Context);
    let [ policyProvider, setPolicyProvider ] = useState(DefaultPolicyProvider);

    const submitHandler = (e) => {
        e.preventDefault();
        window.ApiClient.post("/policy-providers", {
            ...policyProvider
        })
        .then(() => {
            goBack();
        })
        .then(() => {
            Client.GetPolicyProviders(dispatch)
        });
        return false;
    };

    return (
        <PolicyProviderDialog policyProvider      = {policyProvider}
                              setPolicyProvider   = {setPolicyProvider}
                              submitLabel   = 'Add'
                              submitHandler = {submitHandler} />
    );
}

export default AddPolicyProvider;
