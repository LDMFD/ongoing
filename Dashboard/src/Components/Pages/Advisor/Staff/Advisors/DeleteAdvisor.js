import { DeletionConfirmation } from 'Components/Library/Confirmation/DeletionConfirmation';
import React, { useContext, useState } from 'react';
import { useParams } from "react-router-dom";

import { Api } from 'State';
import { Context } from 'State/StateProvider'

const DeleteAdvisor = () => {
    const [ state, dispatch ] = useContext(Context);
    let [ advisor, setAdvisor ] = useState(null);

    let { advisorId } = useParams();

    const onDelete = async () => {
        let res = await Api.Staff.Advisors.Delete(advisorId)
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
            dryRun    = {false}
            handler    = {onDelete}
            label      = {`Staff member deletion`}
            prompt      = {`Delete staff member ${advisor.Forenames} ${advisor.Surname}`}
        />
    );
}

export default DeleteAdvisor;
