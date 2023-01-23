import React, { useContext, useState } from 'react';
import { useHistory, useParams } from "react-router-dom";

import { Context } from 'State/StateProvider'
import { DefaultPolicy } from './DefaultPolicy';
import PolicyDialog from './PolicyDialog';
import { GoBack } from 'Utils/Routing';
import { Api } from 'State';

const AddPolicy = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state, dispatch] = useContext(Context);

    const [ error, setError ] = useState(null);

    let { clientId } = useParams();

    const submitHandler = async (policy) => {
        let response = await Api.Advisor.Policies.Create(clientId, policy);
        if (response.error) {
            setError(response.error);
        } else {
            await Api.Advisor.ClientDetail.Read(dispatch, clientId);
            goBack();
        }
    };

    return (
        <PolicyDialog
            state         = {state}
            policy        = {DefaultPolicy}
            submitLabel   = 'Add'
            submitHandler = {submitHandler}
            error         = {error}
        />
    );
}

export default AddPolicy;
