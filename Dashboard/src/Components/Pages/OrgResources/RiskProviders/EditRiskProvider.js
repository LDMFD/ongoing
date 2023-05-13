import React, { useContext, useState } from 'react';
import { useHistory, useParams } from "react-router-dom";

import { Context } from 'State/StateProvider'
import { Api } from 'State';
import { GoBack } from 'Utils/Routing';
import RiskProviderDialog from './RiskProviderDialog';

const EditRiskProvider = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state, dispatch] = useContext(Context);

    let [ riskProvider, setRiskProvider ] = useState(null);

    let { riskProviderId } = useParams();

    const submitHandler = async (e) => {
        e.preventDefault();
        await Api.OrgResources.RiskProviders.Update(riskProvider);
        await Api.OrgResources.Entities.Read(dispatch);
        goBack();
        return false;
    };

    if (!riskProvider) {
        setRiskProvider(state.Resources.RiskProviders.find(o => o.Id === riskProviderId))
        return;
    }

    return (
        <RiskProviderDialog riskProvider    = {riskProvider}
                            setRiskProvider = {setRiskProvider}
                            submitLabel     = 'Update'
                            submitHandler   = {submitHandler} />
    );
}

export default EditRiskProvider;
