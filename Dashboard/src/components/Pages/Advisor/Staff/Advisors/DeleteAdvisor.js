import React, { useContext } from 'react';
import { useParams } from "react-router-dom";

import { Api } from 'State';
import { Context } from 'State/StateProvider'
import ConfirmationDialog from 'Components/Library/Confirmation/ConfirmationDialog';

const DeleteAdvisor = () => {
    const [ , dispatch ] = useContext(Context);

    let { advisorId } = useParams();

    const onDelete = async () => {
        await Api.Staff.Advisors.Delete(advisorId);
        await Api.Staff.Advisors.Read(dispatch);
    };

    return (
        <ConfirmationDialog label      = 'Delete advisor?'
                            okCallback = {onDelete}  />
    );
}

export default DeleteAdvisor;
