import React, { useContext, useState } from 'react';
import { useHistory, useParams } from "react-router-dom";

import { Context } from 'State/StateProvider'
import { DefaultProviderCharge } from './DefaultProviderCharge';
import ProviderChargeDialog from './ProviderChargeDialog';
import { GoBack } from 'Utils/Routing';
import { Api } from 'State';

const AddProviderCharge = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ , dispatch] = useContext(Context);

    let [ providerCharge, setProviderCharge ] = useState(DefaultProviderCharge);

    let { policyProviderId } = useParams();
    providerCharge.ProviderId = policyProviderId;

    const submitHandler = async (e) => {
        e.preventDefault();
        await Api.Global.ProviderCharges.Create(providerCharge);
        await Api.Global.Entities.Read(dispatch);
        goBack();
        return false;
    };

    return (
        <ProviderChargeDialog providerCharge    = {providerCharge}
                              setProviderCharge = {setProviderCharge}
                              submitLabel       = 'Add'
                              submitHandler     = {submitHandler}  />
    );
}

export default AddProviderCharge;
