import React, { useContext } from 'react';
import { useHistory, useParams } from "react-router-dom";

import { Context } from 'State/StateProvider'
import PolicyDialog from './PolicyDialog';
import { GoBack } from 'Utils/Routing';
import { Api } from 'State';

const EditPolicy = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state, dispatch ] = useContext(Context);

    let { clientId, policyId } = useParams();

    const submitHandler = async (pol) => {
        await Api.Advisor.Policies.Update(clientId, pol);
        await Api.Advisor.ClientDetail.Read(dispatch, clientId);
        goBack();
        return false;
    };

    let policy = state.Report.Policies.find(p => p.Id === policyId);

    return (
        <PolicyDialog state         = {state}
                      policy        = {policy}
                      submitLabel   = 'Update'
                      submitHandler = {submitHandler}  />
    );
}

export default EditPolicy;
