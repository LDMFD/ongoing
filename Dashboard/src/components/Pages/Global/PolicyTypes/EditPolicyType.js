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
    policyTypeId = parseInt(policyTypeId);

    if (!policyType) {
        setPolicyType(state.PolicyTypes.find(o => o.Id === policyTypeId))
        return;
    }

    const submitHandler = (e) => {
        e.preventDefault();
        Api.Global.PolicyTypes.Update(policyType)
        .then(() => {
            goBack();
        })
        .then(() => {
            Api.Global.PolicyTypes.Read(dispatch)
        });
        return false;
    };

    return (
        <PolicyTypeDialog policyType      = {policyType}
                          setPolicyType   = {setPolicyType}
                          submitLabel     = 'Update'
                          submitHandler   = {submitHandler} />
    );
}

export default EditPolicyType;
