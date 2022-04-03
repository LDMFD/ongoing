import React, { useContext, useState } from 'react';
import { useHistory } from "react-router-dom";

import { Context } from 'State/StateProvider'
import { Api } from 'State';
import { GoBack } from 'Utils/Routing';
import { DefaultPolicyType } from './DefaultPolicyType';
import PolicyTypeDialog from './PolicyTypeDialog';

const AddPolicyType = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ , dispatch] = useContext(Context);

    let [ policyType, setPolicyType ] = useState(DefaultPolicyType);

    const submitHandler = async (e) => {
        e.preventDefault();
        await Api.Global.PolicyTypes.Create(policyType);
        await Api.Global.Entities.Read(dispatch);
        goBack();
        return false;
    };

    return (
        <PolicyTypeDialog policyType      = {policyType}
                          setPolicyType   = {setPolicyType}
                          submitLabel     = 'Add'
                          submitHandler   = {submitHandler} />
    );
}

export default AddPolicyType;
