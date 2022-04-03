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
        let c = state.Clients.find(c => c.Id === clientId);
        setClient({
            Id: c.Id,
            Forenames: c.Forenames,
            Surname: c.Surname,
            Email: c.Email,
        })
        return;
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        await Api.Clients.ClientDetail.Update(client);
        await Api.Clients.ClientDetail.Read(dispatch, clientId);
        goBack();
        return false;
    };

    return (
        <ClientDialog client           = {client}
                      setClient        = {setClient}
                      submitLabel      = 'Update'
                      submitHandler    = {submitHandler}  />
    );
}

export default EditClient;
