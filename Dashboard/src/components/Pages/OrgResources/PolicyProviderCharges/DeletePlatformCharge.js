import { useContext, useState } from 'react';
import { useParams } from "react-router-dom";

import { Api } from 'State';
import ConfirmationDialog from 'Components/Library/Confirmation/ConfirmationDialog';
import { Context } from 'State/StateProvider';

const DeletePlatformCharge = () => {
    const [ state, dispatch ] = useContext(Context);
    let [ charge, setCharge ] = useState(null);

    let { chargeId } = useParams();

    const onDelete = async () => {
        let res = await Api.OrgResources.ProviderCharges.Delete(chargeId);
        await Api.OrgResources.Entities.Read(dispatch);
        return res;
    };

    if (!charge) {
        let charge = state.Resources.ProviderCharges.filter(pc => pc.ProviderId === chargeId);
        setCharge(charge)
        return;
    }

    return (
        <ConfirmationDialog label      = 'Delete fact find?'
                            okCallback = {onDelete}  />
    );
}

export default DeletePlatformCharge;
