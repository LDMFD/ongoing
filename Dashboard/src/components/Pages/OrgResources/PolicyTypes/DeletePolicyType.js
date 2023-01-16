import ConfirmationDialog from 'Components/Library/Confirmation/ConfirmationDialog';
import React, { useContext, useState } from 'react';
import { useHistory, useParams } from "react-router-dom";

import { Api } from 'State';
import { Context } from 'State/StateProvider'
import { GoBack } from 'Utils/Routing';

const DeletePolicyType = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state, dispatch ] = useContext(Context);
    let [ policyType, setPolicyType ] = useState(null);

    let { policyTypeId } = useParams();

    const onDelete = async (e) => {
        e.preventDefault();

        await Api.OrgResources.PolicyTypes.Delete(policyTypeId)
        await Api.OrgResources.Entities.Read(dispatch);

        goBack();
        return false;
    };

    if (!policyType) {
        let p = state.Resources.PolicyTypes.find(p => p.Id === policyTypeId);
        setPolicyType(p)
        return;
    }

    return (
        <ConfirmationDialog label      = 'Delete policy type?'
                            okCallback = {onDelete}  />
    );
}

export default DeletePolicyType;
