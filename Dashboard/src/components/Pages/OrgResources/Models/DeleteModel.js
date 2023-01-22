import ConfirmationDialog from 'Components/Library/Confirmation/ConfirmationDialog';
import React, { useContext, useState } from 'react';
import { useHistory, useParams } from "react-router-dom";

import { Api } from 'State';
import { Context } from 'State/StateProvider'
import { GoBack } from 'Utils/Routing';

const DeleteModel = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state, dispatch ] = useContext(Context);
    let [ model, setModel ] = useState(null);

    let { modelId } = useParams();

    const onDelete = async (e) => {
        e.preventDefault();

        await Api.OrgResources.Models.Delete(modelId)
        await Api.OrgResources.Entities.Read(dispatch);

        goBack();
        return false;
    };

    if (!model) {
        let p = state.Resources.Models.find(p => p.Id === modelId);
        setModel(p)
        return;
    }

    return (
        <ConfirmationDialog label      = 'Delete model?'
                            okCallback = {onDelete}  />
    );
}

export default DeleteModel;
