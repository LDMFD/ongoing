import React, { useContext, useState } from 'react';
import { useHistory, useParams } from "react-router-dom";

import { Context } from 'State/StateProvider'
import OrgDialog from './OrgDialog';
import { GoBack } from 'Utils/Routing';
import { Api } from 'State';

const EditOrg = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state, dispatch] = useContext(Context);
    let [ org, setOrg ] = useState(null);

    let { orgId } = useParams();

    if (!org) {
        setOrg(state.Organisations.find(o => o.Id === orgId))
        return;
    }
    const submitHandler = async (e) => {
        e.preventDefault();
        await Api.Superuser.Organisations.Update(org)
        await Api.Superuser.Organisations.Read(dispatch);
        goBack();
        return false;
    };

    return (
        <OrgDialog org           = {org}
                   setOrg        = {setOrg}
                   submitLabel   = 'Update'
                   submitHandler = {submitHandler}  />
    );
}

export default EditOrg;
