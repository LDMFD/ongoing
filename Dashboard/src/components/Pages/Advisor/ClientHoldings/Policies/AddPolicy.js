import React, { useContext } from 'react';
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

    let { clientId } = useParams();

    const submitHandler = async (policy) => {
        await Api.Advisor.Policies.Create(clientId, policy);
        await Api.Advisor.ClientDetail.Read(dispatch, clientId);
        goBack();
    };

    return (
        <PolicyDialog state         = {state}
                      policy        = {DefaultPolicy}
                      submitLabel   = 'Add'
                      submitHandler = {submitHandler}  />
    );
}

export default AddPolicy;
