import React, { useContext } from 'react';
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

    const submitHandler = async (operator) => {
        await Api.OrgResources.Operators.Create(operator);
        await Api.OrgResources.Entities.Read(dispatch);
        goBack();
    };

    return (
        <OperatorDialog state         = {state}
                        operator      = {DefaultOperator}
                        submitLabel   = 'Add'
                        submitHandler = {submitHandler} />
    );
}

export default AddOperator;
