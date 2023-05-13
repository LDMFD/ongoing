import React, { useContext, useState } from 'react';
import { useHistory } from "react-router-dom";

import { Api } from 'State';
import { Context } from 'State/StateProvider'
import { DefaultPolicyType } from './DefaultPolicyType';
import { GoBack } from 'Utils/Routing';
import PolicyTypeDialog from './PolicyTypeDialog';

const AddPolicyType = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state, dispatch] = useContext(Context);
    
    const [ error, setError ] = useState(null);

    const submitHandler = async (policyType) => {
        let response = await Api.OrgResources.PolicyTypes.Create(policyType);
        if (response.error) {
            setError(response.error);
        } else {
            await Api.OrgResources.Entities.Read(dispatch);
            goBack();
        }
    };

    return (
        <PolicyTypeDialog
            state         = {state}
            policyType    = {DefaultPolicyType}
            submitLabel   = 'Add'
            submitHandler = {submitHandler}
            error         = {error}
        />
    );
}

export default AddPolicyType;
