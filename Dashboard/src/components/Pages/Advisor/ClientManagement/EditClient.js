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

    let { clientId } = useParams();

    const [ error, setError ] = useState(null);

    const submitHandler = async (c) => {
        let response = await Api.Advisor.ClientDetail.Update(c);
        if (response.error) {
            setError(response.error);
        } else {
            await Api.Advisor.ClientDetail.Read(dispatch, clientId);
            await Api.Advisor.Clients.Read(dispatch);  // TODO optimize this
            goBack();
        }
    };

    let client = state.Clients.find(c => c.Id === clientId);

    return (
        <ClientDialog
            client        = {client}
            submitLabel   = 'Update'
            submitHandler = {submitHandler}
            error         = {error}
        />
    );
}

export default EditClient;
