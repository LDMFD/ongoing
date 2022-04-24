import React, { useContext, useState } from 'react';
import { useHistory, useParams } from "react-router-dom";

import { Context } from 'State/StateProvider'
import ClientDialog from './ClientDialog';
import { GoBack } from 'Utils/Routing';
import { Api } from 'State';

const EditClient = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state, dispatch ] = useContext(Context);
    let [ client, setClient ] = useState(null);

    let { clientId } = useParams();

    if (!client) {
        setClient(state.Clients.find(c => c.Id === clientId));
        return;
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        await Api.Clients.ClientDetail.Update(client);
        await Api.Clients.ClientDetail.Read(dispatch, clientId);
        await Api.Clients.Clients.Read(dispatch);  // TODO optimize this
        goBack();
        return false;
    };

    return (
        <ClientDialog client        = {client}
                      setClient     = {setClient}
                      submitLabel   = 'Update'
                      submitHandler = {submitHandler}  />
    );
}

export default EditClient;
