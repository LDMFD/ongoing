import React, { useContext } from 'react';
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

    let client = state.Clients.find(c => c.Id === clientId);

    const submitHandler = async (c) => {
        await Api.Advisor.ClientDetail.Update(c);
        await Api.Advisor.ClientDetail.Read(dispatch, clientId);
        await Api.Advisor.Clients.Read(dispatch);  // TODO optimize this
        goBack();
        return false;
    };

    return (
        <ClientDialog client        = {client}
                      submitLabel   = 'Update'
                      submitHandler = {submitHandler}  />
    );
}

export default EditClient;
