import { DeletionConfirmation } from 'Components/Library/Confirmation/DeletionConfirmation';
import React, { useContext, useState } from 'react';
import { useParams } from "react-router-dom";

import { Api } from 'State';
import { Context } from 'State/StateProvider'

const DeleteModel = () => {
    const [ state, dispatch ] = useContext(Context);
    let [ model, setModel ] = useState(null);

    let { modelId } = useParams();

    const onDelete = async (execute) => {
        let res = await Api.OrgResources.Models.Delete(modelId, execute);
        await Api.OrgResources.Entities.Read(dispatch);
        return res;
    };

    if (!model) {
        let p = state.Resources.Models.find(p => p.Id === modelId);
        setModel(p)
        return;
    }

    return (
        <DeletionConfirmation
            handler    = {onDelete}
            label      = {`Delete model ${model.Name}?`}
            warning    = 'This model is currently in use by client holdings (portfolios), which will also be deleted if this model is deleted. The clients are:'
            prompt     = {<>Are you sure you want to delete this model <b>{model.Name}</b></>}
            dependents = 'and all linked holdings'
        />
    );
}

export default DeleteModel;
