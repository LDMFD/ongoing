import React, { useContext, useState } from 'react';
import { useHistory } from "react-router-dom";

import { Context } from 'State/StateProvider'
import { GoBack } from 'Utils/Routing';
import { DefaultOperator } from './DefaultOperator';
import OperatorDialog from './OperatorDialog';
import { Api } from 'State';

const AddOperator = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state, dispatch] = useContext(Context);

    const [ error, setError ] = useState(null);

    const submitHandler = async (operator) => {
        let response = await Api.OrgResources.Operators.Create(operator);
        if (response.error) {
            setError(response.error);
        } else {
            await Api.OrgResources.Entities.Read(dispatch);
            goBack();
        }
    };

    return (
        <OperatorDialog
            state         = {state}
            operator      = {DefaultOperator}
            submitLabel   = 'Add'
            submitHandler = {submitHandler}
            error         = {error}
        />
    );
}

export default AddOperator;
