import ConfirmationDialog from 'Components/Library/Confirmation/ConfirmationDialog';
import React, { useContext, useState } from 'react';
import { useHistory, useParams } from "react-router-dom";

import { Api } from 'State';
import { Context } from 'State/StateProvider'
import { GoBack } from 'Utils/Routing';

const DeleteClient = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state, dispatch ] = useContext(Context);
    let [ client, setClient ] = useState(null);

    let { clientId } = useParams();

    const onDelete = async (e) => {
        e.preventDefault();

        await Api.Advisor.ClientDetail.Delete(clientId)
        await Api.Advisor.Clients.Read(dispatch);

        goBack();
        return false;
    };

    if (!client) {
        let p = state.Clients.find(p => p.Id === clientId);
        setClient(p)
        return;
    }

    return (
        <ConfirmationDialog label      = {`Delete client ${client.Identity.Forenames} ${client.Identity.Surname}?`}
                            okCallback = {onDelete}  />
    );
}

export default DeleteClient;
