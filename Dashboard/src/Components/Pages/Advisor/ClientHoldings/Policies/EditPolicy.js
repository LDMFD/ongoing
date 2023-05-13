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

    const [ error, setError ] = useState(null);

    let { clientId, policyId } = useParams();

    const submitHandler = async (pol) => {
        let response = await Api.Advisor.Policies.Update(clientId, pol);
        if (response.error) {
            setError(response.error);
        } else {
            await Api.Advisor.ClientDetail.Read(dispatch, clientId);
            goBack();
        }
    };

    let policy = state.Report.Policies.find(p => p.Id === policyId);

    return (
        <PolicyDialog
            state         = {state}
            policy        = {policy}
            submitLabel   = 'Update'
            submitHandler = {submitHandler}
            error         = {error}
        />
    );
}

export default EditPolicy;
