import React, { useContext, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { Context } from 'State/StateProvider'
import ProviderChargeDialog from './ProviderChargeDialog';
import { GoBack } from 'Utils/Routing';
import { Api } from 'State';

const EditProviderCharge = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state, dispatch] = useContext(Context);
    let [ providerCharge, setProviderCharge ] = useState(null);

    let { chargeId } = useParams();

    if (!providerCharge) {
        let p = state.Entities.ProviderCharges.find(p => p.Id === chargeId);
        setProviderCharge(p)
        return;
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        await Api.Global.ProviderCharges.Update(providerCharge);
        await Api.Global.Entities.Read(dispatch);
        goBack();
        return false;
    };

    return (
        <ProviderChargeDialog providerCharge    = {providerCharge}
                              setProviderCharge = {setProviderCharge}
                              submitLabel       = 'Update'
                              submitHandler     = {submitHandler} />
    );
}

export default EditProviderCharge;
