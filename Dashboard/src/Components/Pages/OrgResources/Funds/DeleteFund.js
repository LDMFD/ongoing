import { DeletionConfirmation } from 'Components/Library/Confirmation/DeletionConfirmation';
import React, { useContext, useState } from 'react';
import { useParams } from "react-router-dom";

import { Api } from 'State';
import { Context } from 'State/StateProvider'

const DeleteFund = () => {
    const [ state, dispatch ] = useContext(Context);
    let [ fund, setFund ] = useState(null);

    let { fundId } = useParams();

    const onDelete = async (execute) => {
        let res = await Api.OrgResources.Funds.Delete(fundId, execute)
        await Api.OrgResources.Entities.Read(dispatch);
        return res;
    };

    if (!fund) {
        let p = state.Resources.Funds.find(p => p.Id === fundId);
        setFund(p)
        return;
    }

    return (
        <DeletionConfirmation
            handler    = {onDelete}
            label      = {`Delete fund ${fund.Name}?`}
            warning    = 'This policy is currently in use by client holdings (policy funds), which will also be deleted if this fund is deleted. The clients are:'
            prompt     = 'Are you sure you want to delete this fund'
            dependents = 'and all linked holdings'
        />
    );
}

export default DeleteFund;
