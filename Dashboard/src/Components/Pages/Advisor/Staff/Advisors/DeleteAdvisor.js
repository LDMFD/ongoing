import { DeletionConfirmation } from 'Components/Library/Confirmation/DeletionConfirmation';
import React, { useContext, useState } from 'react';
import { useParams } from "react-router-dom";

import { Api } from 'State';
import { Context } from 'State/StateProvider'

const DeleteAdvisor = () => {
    const [ state, dispatch ] = useContext(Context);
    let [ advisor, setAdvisor ] = useState(null);

    let { advisorId } = useParams();

    const onDelete = async (execute) => {
        let res = await Api.Staff.Advisors.Delete(advisorId, execute)
        await Api.Staff.Advisors.Read(dispatch);
        return res;
    };

    if (!advisor) {
        let p = state.Advisors.find(p => p.Id === advisorId);
        setAdvisor(p)
        return;
    }

    return (
        <DeletionConfirmation
            handler = {onDelete}
            label   = {`Staff member deletion`}
            warning = {`This will delete the staff member, but not their clients. The following clients will need assigning a new advisor:`}
            prompt  = {`Delete staff member ${advisor.Forenames} ${advisor.Surname}`}
        />
    );
}

export default DeleteAdvisor;
