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
    let [ policyType, setPolicyType ] = useState(null);

    let { policyTypeId } = useParams();

    const submitHandler = async (e) => {
        e.preventDefault();
        await Api.Global.PolicyTypes.Update(policyType);
        await Api.Global.Entities.Read(dispatch);
        goBack();
        return false;
    };

    if (!policyType) {
        setPolicyType(state.Entities.PolicyTypes.find(o => o.Id === policyTypeId))
        return;
    }

    return (
        <PolicyTypeDialog policyType      = {policyType}
                          setPolicyType   = {setPolicyType}
                          submitLabel     = 'Update'
                          submitHandler   = {submitHandler} />
    );
}

export default EditPolicyType;
