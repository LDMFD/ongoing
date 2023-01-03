import React, { useContext } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { Context } from 'State/StateProvider'
import ProviderChargeDialog from './ProviderChargeDialog';
import { GoBack } from 'Utils/Routing';
import { Api } from 'State';

const EditProviderCharge = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state, dispatch ] = useContext(Context);

    const submitHandler = async (pc) => {
        await Api.OrgResources.ProviderCharges.Update(pc);
        await Api.OrgResources.Entities.Read(dispatch);
        goBack();
    };

    let { chargeId } = useParams();

    let providerCharge = state.Resources.ProviderCharges.find(p => p.Id === chargeId);

    return (
        <ProviderChargeDialog state             = {state}
                              providerCharge    = {providerCharge}
                              submitLabel       = 'Update'
                              submitHandler     = {submitHandler} />
    );
}

export default EditProviderCharge;
