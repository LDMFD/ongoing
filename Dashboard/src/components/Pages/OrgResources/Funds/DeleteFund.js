import ConfirmationDialog from 'Components/Library/Confirmation/ConfirmationDialog';
import React, { useContext, useState } from 'react';
import { useHistory, useParams } from "react-router-dom";

import { Api } from 'State';
import { Context } from 'State/StateProvider'
import { GoBack } from 'Utils/Routing';

const DeleteFund = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state, dispatch ] = useContext(Context);
    let [ fund, setFund ] = useState(null);

    let { fundId } = useParams();

    const onDelete = async (e) => {
        e.preventDefault();

        await Api.OrgResources.Funds.Delete(fundId)
        await Api.OrgResources.Entities.Read(dispatch);

        goBack();
        return false;
    };

    if (!fund) {
        let p = state.Resources.Funds.find(p => p.Id === fundId);
        setFund(p)
        return;
    }

    return (
        <ConfirmationDialog label      = 'Delete fund?'
                            okCallback = {onDelete}  />
    );
}

export default DeleteFund;
