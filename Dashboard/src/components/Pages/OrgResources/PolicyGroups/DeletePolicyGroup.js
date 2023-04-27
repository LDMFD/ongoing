import ConfirmationDialog from 'Components/Library/Confirmation/ConfirmationDialog';
import React, { useContext, useState } from 'react';
import { useHistory, useParams } from "react-router-dom";

import { Api } from 'State';
import { Context } from 'State/StateProvider'
import { GoBack } from 'Utils/Routing';

const DeletePolicyGroup = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state, dispatch ] = useContext(Context);
    let [ policyGroup, setPolicyGroup ] = useState(null);

    let { policyGroupId } = useParams();

    const onDelete = async (e) => {
        e.preventDefault();

        await Api.OrgResources.PolicyGroups.Delete(policyGroupId)
        await Api.OrgResources.Entities.Read(dispatch);

        goBack();
        return false;
    };

    if (!policyGroup) {
        let p = state.Resources.PolicyGroups.find(p => p.Id === policyGroupId);
        setPolicyGroup(p)
        return;
    }

    return (
        <ConfirmationDialog label      = 'Delete policy type?'
                            okCallback = {onDelete}  />
    );
}

export default DeletePolicyGroup;
