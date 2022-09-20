import React, { useContext, useState } from 'react';
import { useHistory, useParams } from "react-router-dom";

import { Context } from 'State/StateProvider'
import AdvisorDialog from './AdvisorDialog';
import { GoBack } from 'Utils/Routing';
import { Api } from 'State';

const EditAdvisor = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state, dispatch] = useContext(Context);
    let [ advisor, setAdvisor ] = useState(null);

    let { advisorId } = useParams();

    if (!advisor) {
        setAdvisor(state.Advisors.find(o => o.Id === advisorId))
        return;
    }
    const submitHandler = async (e) => {
        e.preventDefault();
        await Api.Staff.Advisors.Update(advisor)
        await Api.Staff.Advisors.Read(dispatch);
        goBack();
        return false;
    };

    return (
        <AdvisorDialog advisor       = {advisor}
                       setAdvisor    = {setAdvisor}
                       submitLabel   = 'Update'
                       submitHandler = {submitHandler}  />
    );
}

export default EditAdvisor;
