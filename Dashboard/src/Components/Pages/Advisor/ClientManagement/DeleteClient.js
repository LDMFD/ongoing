import { useContext, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import ConfirmationDialog from 'Components/Library/Confirmation/ConfirmationDialog';
import { Api } from 'State';
import { Context } from 'State/StateProvider';

const DeleteClient = () => {
    let history = useHistory();

    const [ state, dispatch ] = useContext(Context);
    let [ client, setClient ] = useState(null);

    let { clientId } = useParams();

    const onDelete = async (e) => {
        let res = await Api.Advisor.ClientDetail.Delete(clientId)
        history.push(`/clients`);
        await Api.Advisor.Clients.Read(dispatch);
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
