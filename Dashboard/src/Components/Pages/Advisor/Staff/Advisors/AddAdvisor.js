import React, { useContext, useState } from 'react';
import { useHistory } from "react-router-dom";

import SendSignInLink from "Components/Library/Auth/AuthEmailer";
import { Api } from 'State';
import { Context } from 'State/StateProvider';
import { GoBack } from 'Utils/Routing';
import AdvisorDialog from './AdvisorDialog';
import { DefaultAdvisor } from './DefaultAdvisor';

const AddAdvisor = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state, dispatch] = useContext(Context);

    const [ error, setError ] = useState(null);

    const submitHandler = async (advisor) => {
        let response = await Api.Staff.Advisors.Create(advisor);
        if (response.error) {
            setError(response.error);
        } else {
            await Api.Staff.Advisors.Read(dispatch);
            SendSignInLink(advisor.Email)
            goBack();
        }
    };
    
    return (
        <AdvisorDialog
            state         = {state}
            advisor       = {DefaultAdvisor}
            submitLabel   = 'Add'
            submitHandler = {submitHandler}
            error         = {error}

        />
    );
}

export default AddAdvisor;
