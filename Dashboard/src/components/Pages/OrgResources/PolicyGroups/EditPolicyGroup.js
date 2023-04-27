import React, { useContext } from 'react';
import { useHistory, useParams } from "react-router-dom";

import { Context } from 'State/StateProvider'
import { Api } from 'State';
import { GoBack } from 'Utils/Routing';
import PolicyGroupDialog from './PolicyGroupDialog';

const EditPolicyGroup = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state, dispatch] = useContext(Context);

    let { policyGroupId } = useParams();

    const submitHandler = async (policyGroup) => {
        await Api.OrgResources.PolicyGroups.Update(policyGroup);
        await Api.OrgResources.Entities.Read(dispatch);
        goBack();
    };

    let policyGroup = state.Resources.PolicyGroups.find(o => o.Id === policyGroupId);

    return (
        <PolicyGroupDialog
            policyGroup    = {policyGroup}
            state         = {state}
            submitLabel   = 'Update'
            submitHandler = {submitHandler}
        />
    );
}

export default EditPolicyGroup;
