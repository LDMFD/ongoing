import React, { useContext, useState } from 'react';
import { useHistory, useParams } from "react-router-dom";

import { Context } from 'State/StateProvider'
import { Api } from 'State';
import { GoBack } from 'Utils/Routing';
import PolicyTypeDialog from './PolicyTypeDialog';

const EditPolicyType = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state, dispatch] = useContext(Context);

    let { policyTypeId } = useParams();

    const [ error, setError ] = useState(null);

    const submitHandler = async (policyType) => {
        let response = await Api.OrgResources.PolicyTypes.Update(policyType);
        if (response.error) {
            setError(response.error);
        } else {
            await Api.OrgResources.Entities.Read(dispatch);
            goBack();
        }
    };

    let policyType = state.Resources.PolicyTypes.find(o => o.Id === policyTypeId);

    return (
        <PolicyTypeDialog
            policyType    = {policyType}
            state         = {state}
            submitLabel   = 'Update'
            submitHandler = {submitHandler}
            error         = {error}
        />
    );
}

export default EditPolicyType;
