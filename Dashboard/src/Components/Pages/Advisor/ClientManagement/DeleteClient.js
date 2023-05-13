import ConfirmationDialog from 'Components/Library/Confirmation/ConfirmationDialog';
import { useContext, useState } from 'react';
import { useParams } from "react-router-dom";

import { Api } from 'State';
import { Context } from 'State/StateProvider';

const DeleteClient = () => {
    const [ state, dispatch ] = useContext(Context);
    let [ client, setClient ] = useState(null);

    let { clientId } = useParams();

    const onDelete = async (e) => {
        let res = await Api.Advisor.ClientDetail.Delete(clientId)
        await Api.Advisor.Clients.Read(dispatch);
        return res;
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
