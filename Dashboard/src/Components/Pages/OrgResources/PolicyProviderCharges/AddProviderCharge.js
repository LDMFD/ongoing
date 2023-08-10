import React, { useContext, useState } from 'react';
import { useParams, useHistory } from "react-router-dom";

import { Context } from 'State/StateProvider'
import { DefaultProviderCharge } from './DefaultProviderCharge';
import ProviderChargeDialog from './ProviderChargeDialog';
import { GoBack } from 'Utils/Routing';
import { Api } from 'State';

const AddProviderCharge = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state, dispatch] = useContext(Context);

    let { policyProviderId } = useParams();
    
    const [ error, setError ] = useState(null);

    const submitHandler = async (providerCharge) => {
        providerCharge.ProviderId = policyProviderId;
        let response = await Api.OrgResources.ProviderCharges.Create(providerCharge);
        if (response.error) {
            setError(response.error);
        } else {
            await Api.OrgResources.Entities.Read(dispatch);
            goBack();
        }
    };

    return (
        <ProviderChargeDialog
            state          = {state}
            providerCharge = {DefaultProviderCharge}
            submitLabel    = 'Add'
            submitHandler  = {submitHandler}
            error          = {error}
        />
    );
}

export default AddProviderCharge;
