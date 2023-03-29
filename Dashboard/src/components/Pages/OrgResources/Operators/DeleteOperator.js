import { DeletionConfirmation } from 'Components/Library/Confirmation/DeletionConfirmation';
import React, { useContext, useState } from 'react';
import { useParams } from "react-router-dom";

import { Api } from 'State';
import { Context } from 'State/StateProvider'

const DeleteOperator = () => {
    const [ state, dispatch ] = useContext(Context);
    let [ operator, setOperator ] = useState(null);

    let { operatorId } = useParams();

    const onDelete = async (execute) => {
        let res = await Api.OrgResources.Operators.Delete(operatorId, execute)
        await Api.OrgResources.Entities.Read(dispatch);
        return res;
    };

    if (!operator) {
        let p = state.Resources.Operators.find(p => p.Id === operatorId);
        setOperator(p)
        return;
    }

    return (
        <DeletionConfirmation
            handler    = {onDelete}
            label      = {`Delete operator ${operator.Name}?`}
            warning    = 'This operator is currently in use by models or portfolios, which will also be deleted if this operator is deleted. The dependent clients and models are:'
            prompt     = 'Are you sure you want to delete this operator'
            dependents = 'and all its dependents'
        />
    );
}

export default DeleteOperator;
