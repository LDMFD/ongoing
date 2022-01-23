import React, { useContext, useState } from 'react';
import { useHistory } from "react-router-dom";

import { Context } from 'State/StateProvider'
import Client from 'State/HttpClient';
import { GoBack } from 'Utils';
import { DefaultPolicyType } from './DefaultPolicyType';
import PolicyTypeDialog from './PolicyTypeDialog';

const AddPolicyType = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ , dispatch] = useContext(Context);

    let [ policyType, setPolicyType ] = useState(DefaultPolicyType);

    const submitHandler = (e) => {
        e.preventDefault();
        Client.PolicyTypes.Create(policyType)
        .then(() => {
            goBack();
        })
        .then(() => {
            Client.PolicyTypes.Read(dispatch)
        });
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
