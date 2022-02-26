import React, { useContext, useState } from 'react';
import { useHistory, useParams } from "react-router-dom";

import { Context } from 'State/StateProvider'
import PolicyDialog from './PolicyDialog';
import { GoBack } from 'Utils/Routing';
import { Api } from 'State';

const EditPolicy = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state, dispatch ] = useContext(Context);
    let [ policy, setPolicy ] = useState(null);

    let { clientId, policyId } = useParams();
    clientId = parseInt(clientId);
    policyId = parseInt(policyId);

    if (!policy) {
        let client = state.Clients.find(c => c.Id === clientId);
        setPolicy(client.Policies.find(p => p.Id === policyId))
        return;
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        await Api.Clients.Policies.Update(clientId, policy);
        await Api.Clients.ClientDetail.Read(dispatch, clientId);
        goBack();
        return false;
    };

    return (
        <PolicyDialog policy        = {policy}
                      setPolicy     = {setPolicy}
                      submitLabel   = 'Edit'
                      submitHandler = {submitHandler}  />
    );
}

export default EditPolicy;
