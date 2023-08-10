import React, { useContext, useState } from 'react';
import { useHistory, useParams } from "react-router-dom";

import { Api } from 'State';
import { Context } from 'State/StateProvider';
import { GoBack } from 'Utils/Routing';
import RiskProviderDialog from './RiskProviderDialog';

const EditRiskProvider = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state, dispatch] = useContext(Context);

    let { riskProviderId } = useParams();

    const [ error, setError ] = useState(null);

    const submitHandler = async (riskProvider) => {
        let response = await Api.OrgResources.RiskProviders.Update(riskProvider);
        if (response.error) {
            setError(response.error);
        } else {
            await Api.OrgResources.Entities.Read(dispatch);
            goBack();
        }
    };

    let riskProvider = state.Resources.RiskProviders.find(o => o.Id === riskProviderId);

    return (
        <RiskProviderDialog
            riskProvider  = {riskProvider}
            state         = {state}
            submitLabel   = 'Update'
            submitHandler = {submitHandler}
            error         = {error}
        />
    );
}

export default EditRiskProvider;
