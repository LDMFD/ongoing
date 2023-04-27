import React, { useContext } from 'react';
import { useHistory } from "react-router-dom";

import { Context } from 'State/StateProvider'
import { Api } from 'State';
import { GoBack } from 'Utils/Routing';
import { DefaultPolicyGroup } from './DefaultPolicyGroup';
import PolicyGroupDialog from './PolicyGroupDialog';

const AddPolicyGroup = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state, dispatch] = useContext(Context);

    const submitHandler = async (policyGroup) => {
        await Api.OrgResources.PolicyGroups.Create(policyGroup);
        await Api.OrgResources.Entities.Read(dispatch);
        goBack();
    };

    return (
        <PolicyGroupDialog
            state         = {state}
            policyGroup    = {DefaultPolicyGroup}
            submitLabel   = 'Add'
            submitHandler = {submitHandler}
        />
    );
}

export default AddPolicyGroup;
