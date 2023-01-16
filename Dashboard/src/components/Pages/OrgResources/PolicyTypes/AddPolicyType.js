import React, { useContext } from 'react';
import { useHistory } from "react-router-dom";

import { Context } from 'State/StateProvider'
import { Api } from 'State';
import { GoBack } from 'Utils/Routing';
import { DefaultPolicyType } from './DefaultPolicyType';
import PolicyTypeDialog from './PolicyTypeDialog';

const AddPolicyType = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state, dispatch] = useContext(Context);

    const submitHandler = async (policyType) => {
        await Api.OrgResources.PolicyTypes.Create(policyType);
        await Api.OrgResources.Entities.Read(dispatch);
        goBack();
    };

    return (
        <PolicyTypeDialog
            state         = {state}
            policyType    = {DefaultPolicyType}
            submitLabel   = 'Add'
            submitHandler = {submitHandler}
        />
    );
}

export default AddPolicyType;
