import React, { useContext, useState } from 'react';
import { useHistory } from "react-router-dom";

import { Context } from 'State/StateProvider'
import { Api } from 'State';
import { GoBack } from 'Utils/Routing';
import { DefaultRiskProvider } from './DefaultRiskProvider';
import RiskProviderDialog from './RiskProviderDialog';

const AddRiskProvider = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ , dispatch] = useContext(Context);
    let [ riskProvider, setRiskProvider ] = useState(DefaultRiskProvider);

    const submitHandler = async (e) => {
        e.preventDefault();
        await Api.OrgResources.RiskProviders.Create(riskProvider);
        await Api.OrgResources.Entities.Read(dispatch);
        goBack();
        return false;
    };

    return (
        <RiskProviderDialog riskProvider    = {riskProvider}
                            setRiskProvider = {setRiskProvider}
                            submitLabel     = 'Add'
                            submitHandler   = {submitHandler} />
    );
}

export default AddRiskProvider;
