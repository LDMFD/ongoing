import React, { useContext, useState } from 'react';
import { useHistory, useParams } from "react-router-dom";

import { Context } from 'State/StateProvider'
import Client from 'State/Client';
import { GoBack } from 'Utils';
import PolicyProviderDialog from './PolicyProviderDialog';

const EditPolicyProvider = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state, dispatch] = useContext(Context);

    let [ policyProvider, setPolicyProvider ] = useState(null);

    let { policyProviderId } = useParams();
    policyProviderId = parseInt(policyProviderId);

    if (!policyProvider) {
        setPolicyProvider(state.PolicyProviders.find(o => o.Id === policyProviderId))
        return;
    }

    const submitHandler = (e) => {
        e.preventDefault();
        Client.UpdatePolicyProvider(policyProvider)
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
                              submitLabel         = 'Update'
                              submitHandler       = {submitHandler} />
    );
}

export default EditPolicyProvider;
