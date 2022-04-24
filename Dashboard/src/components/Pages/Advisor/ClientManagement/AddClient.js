import React, { useContext, useState } from 'react';
import { useHistory } from "react-router-dom";

import { Context } from 'State/StateProvider'
import { DefaultClient } from './DefaultClient';
import ClientDialog from './ClientDialog';
import { GoBack } from 'Utils/Routing';
import { Api } from 'State';

const AddClient = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [, dispatch] = useContext(Context);

    let [ client, setClient ] = useState(DefaultClient);

    const submitHandler = async (e) => {
        e.preventDefault();
        await Api.Advisor.ClientDetail.Create(client);
        await Api.Advisor.Clients.Read(dispatch);
        goBack();
        return false;
    };

    return (
        <ClientDialog client        = {client}
                      setClient     = {setClient}
                      submitLabel   = 'Add'
                      submitHandler = {submitHandler}  />
    );
}

export default AddClient;
