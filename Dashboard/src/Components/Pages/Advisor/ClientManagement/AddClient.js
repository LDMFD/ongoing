import React, { useContext, useState } from 'react';
import { useHistory } from "react-router-dom";

import { Context } from 'State/StateProvider'
import ClientDialog from './ClientDialog';
import { GoBack } from 'Utils/Routing';
import { Api } from 'State';
import { DefaultClient } from './DefaultClient';

const AddClient = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state, dispatch ] = useContext(Context);

    const [ error, setError ] = useState(null);

    const submitHandler = async (c) => {
        let response = await Api.Advisor.ClientDetail.Create(c);
        if (response.error) {
            setError(response.error);
        } else {
            await Api.Advisor.Clients.Read(dispatch);
            goBack();
        }
    };

    return (
        <ClientDialog
            state         = {state}
            client        = {DefaultClient}
            submitLabel   = 'Add'
            submitHandler = {submitHandler}
            error         = {error}
        />
    );
}

export default AddClient;
