import React, { useContext } from 'react';
import { useHistory, useParams } from "react-router-dom";

import { Context } from 'State/StateProvider'
import { GoBack } from 'Utils/Routing';
import OperatorDialog from './OperatorDialog';
import { Api } from 'State';

const EditOperator = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state, dispatch] = useContext(Context);

    let { operatorId } = useParams();

    const submitHandler = async (operator) => {
        await Api.OrgResources.Operators.Update(operator);
        await Api.OrgResources.Entities.Read(dispatch);
        goBack();
    };

    let operator = state.Resources.Operators.find(o => o.Id === operatorId);

    return (
        <OperatorDialog operator      = {operator}
                        state         = {state}
                        submitLabel   = 'Update'
                        submitHandler = {submitHandler} />
    );
}

export default EditOperator;
