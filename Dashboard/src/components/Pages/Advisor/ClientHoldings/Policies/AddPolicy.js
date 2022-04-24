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

    const [, dispatch] = useContext(Context);
    let [ policy, setPolicy ] = useState(DefaultPolicy);

    let { clientId } = useParams();

    const submitHandler = async (e) => {
        e.preventDefault();
        await Api.Advisor.Policies.Create(clientId, policy);
        await Api.Advisor.ClientDetail.Read(dispatch, clientId);
        goBack();
        return false;
    };

    return (
        <PolicyDialog policy        = {policy}
                      setPolicy     = {setPolicy}
                      submitLabel   = 'Add'
                      submitHandler = {submitHandler}  />
    );
}

export default AddPolicy;
