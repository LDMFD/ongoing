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

    if (!policy) {
        setPolicy(state.Report.Policies.find(p => p.Id === policyId))
        return;
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        await Api.Advisor.Policies.Update(clientId, policy);
        await Api.Advisor.ClientDetail.Read(dispatch, clientId);
        goBack();
        return false;
    };

    return (
        <PolicyDialog policy        = {policy}
                      setPolicy     = {setPolicy}
                      submitLabel   = 'Update'
                      submitHandler = {submitHandler}  />
    );
}

export default EditPolicy;
