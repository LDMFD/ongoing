import React, { useContext, useState } from 'react';
import { useHistory, useParams } from "react-router-dom";

import { Context } from 'State/StateProvider'
import { GoBack } from 'Utils/Routing';
import OperatorDialog from './OperatorDialog';
import { Api } from 'State';

const EditOperator = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    let { operatorId } = useParams();

    const [ state, dispatch] = useContext(Context);

    const [ error, setError ] = useState(null);

    const submitHandler = async (operator) => {
        let response = await Api.OrgResources.Operators.Update(operator);
        if (response.error) {
            setError(response.error);
        } else {
            await Api.OrgResources.Entities.Read(dispatch);
            goBack();
        }
    };

    let operator = state.Resources.Operators.find(o => o.Id === operatorId);

    return (
        <OperatorDialog
            operator      = {operator}
            state         = {state}
            submitLabel   = 'Update'
            submitHandler = {submitHandler}
            error         = {error}
        />
    );
}

export default EditOperator;
