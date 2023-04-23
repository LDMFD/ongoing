import ConfirmationDialog from 'Components/Library/Confirmation/ConfirmationDialog';
import { useContext } from 'react';
import { useParams } from "react-router-dom";

import { Api } from 'State';
import { Context } from 'State/StateProvider';

const DeleteFactFind = () => {
    const [ , dispatch ] = useContext(Context);

    let { clientId, factFindId } = useParams();

    const onDelete = async () => {
        let res = await Api.Advisor.FactFinds.Delete(clientId, factFindId);
        await Api.Advisor.ClientDetail.Read(dispatch, clientId);
        return res;
    };

    return (
        <ConfirmationDialog label      = 'Delete fact find?'
                            okCallback = {onDelete}  />
    );
}

export default DeleteFactFind;
