import React, { useContext, useState } from 'react';
import { useHistory, useParams } from "react-router-dom";

import { Api } from 'State';
import { Context } from 'State/StateProvider';
import { GoBack } from 'Utils/Routing';
import AdvisorDialog from './AdvisorDialog';

const EditAdvisor = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state, dispatch] = useContext(Context);

    let { advisorId } = useParams();

    const [ error, setError ] = useState(null);

    const submitHandler = async (advisor) => {
        let response = await Api.Staff.Advisors.Update(advisor);
        if (response.error) {
            setError(response.error);
        } else {
            await Api.Staff.Advisors.Read(dispatch);
            goBack();
        }
    };

    let advisor = state.Advisors.find(o => o.Id === advisorId);

    return (
        <AdvisorDialog
            advisor       = {advisor}
            state         = {state}
            submitLabel   = 'Update'
            submitHandler = {submitHandler}
            error         = {error}
        />
    );
}

export default EditAdvisor;
