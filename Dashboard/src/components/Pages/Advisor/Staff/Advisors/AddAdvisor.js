import React, { useContext, useState } from 'react';
import { useHistory } from "react-router-dom";

import { Context } from 'State/StateProvider'
import { DefaultAdvisor } from './DefaultAdvisor';
import AdvisorDialog from './AdvisorDialog';
import { GoBack } from 'Utils/Routing';
import { Api } from 'State';
import SendSignInLink from "Components/Library/Auth/AuthEmailer";

const AddAdvisor = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [, dispatch] = useContext(Context);
    let [ advisor, setAdvisor ] = useState(DefaultAdvisor);

    const submitHandler = async (e) => {
        e.preventDefault();
        await Api.Staff.Advisors.Create(advisor);
        await Api.Staff.Advisors.Read(dispatch);
        SendSignInLink(advisor.Email)
        goBack();
        return false;
    };
    
    return (
        <AdvisorDialog advisor       = {advisor}
                       setAdvisor    = {setAdvisor}
                       submitLabel   = 'Add'
                       submitHandler = {submitHandler}  />
    );
}

export default AddAdvisor;
