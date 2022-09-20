import React, { useContext, useState } from 'react';
import { useHistory } from "react-router-dom";

import { Context } from 'State/StateProvider'
import { DefaultOrg } from './DefaultOrg';
import OrgDialog from './OrgDialog';
import { GoBack } from 'Utils/Routing';
import { Api } from 'State';
import SendSignInLink from "Components/Library/Auth/AuthEmailer";

const AddOrg = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [, dispatch] = useContext(Context);
    let [ org, setOrg ] = useState(DefaultOrg);

    const submitHandler = async (e) => {
        e.preventDefault();
        await Api.Superuser.Organisations.Create(org);
        await Api.Superuser.Organisations.Read(dispatch);
        SendSignInLink(org.Email)
        goBack();
        return false;
    };
    
    return (
        <OrgDialog org           = {org}
                   setOrg        = {setOrg}
                   submitLabel   = 'Add'
                   submitHandler = {submitHandler}  />
    );
}

export default AddOrg;
