import React, { useContext } from 'react';
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
    
    const submitHandler = async (providerCharge) => {
        providerCharge.ProviderId = policyProviderId;
        await Api.OrgResources.ProviderCharges.Create(providerCharge);
        await Api.OrgResources.Entities.Read(dispatch);
        goBack();
    };

    return (
        <ProviderChargeDialog state             = {state}
                              providerCharge    = {DefaultProviderCharge}
                              submitLabel       = 'Add'
                              submitHandler     = {submitHandler}  />
    );
}

export default AddProviderCharge;
