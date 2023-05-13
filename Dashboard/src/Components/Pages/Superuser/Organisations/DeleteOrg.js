import React, { useContext } from 'react';
import { useParams } from "react-router-dom";

import { Api } from 'State';
import { Context } from 'State/StateProvider'
import ConfirmationDialog from 'Components/Library/Confirmation/ConfirmationDialog';

const DeleteOrg = () => {
    const [ , dispatch ] = useContext(Context);

    let { orgId } = useParams();

    const onDelete = async () => {
        let res = await Api.Superuser.Organisations.Delete(orgId);
        await Api.Superuser.Organisations.Read(dispatch);
        return res;
    };

    return (
        <ConfirmationDialog label      = 'Delete organisation?'
                            okCallback = {onDelete}  />
    );
}

export default DeleteOrg;
