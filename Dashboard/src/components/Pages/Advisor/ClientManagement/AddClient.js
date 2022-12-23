import React, { useContext } from 'react';
import { useHistory } from "react-router-dom";

import { Context } from 'State/StateProvider'
import ClientDialog from './ClientDialog';
import { GoBack } from 'Utils/Routing';
import { Api } from 'State';
import { DefaultClient } from './DefaultClient';

const AddClient = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [, dispatch] = useContext(Context);

    const submitHandler = async (c) => {
        await Api.Advisor.ClientDetail.Create(c);
        await Api.Advisor.Clients.Read(dispatch);
        goBack();
    };

    return (
        <ClientDialog client        = {DefaultClient}
                      submitLabel   = 'Add'
                      submitHandler = {submitHandler}  />
    );
}

export default AddClient;
