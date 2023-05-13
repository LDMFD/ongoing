import ConfirmationDialog from 'Components/Library/Confirmation/ConfirmationDialog';
import { useContext } from 'react';
import { useParams } from "react-router-dom";

import { Api } from 'State';
import { Context } from 'State/StateProvider';

const DeleteFeesReport = () => {
    const [ , dispatch ] = useContext(Context);

    let { clientId, feesReportId } = useParams();

    const onDelete = async () => {
        let res = await Api.Advisor.FeesReports.Delete(clientId, feesReportId);
        await Api.Advisor.ClientDetail.Read(dispatch, clientId);
        return res;
    };

    return (
        <ConfirmationDialog label      = 'Delete fees report?'
                            okCallback = {onDelete}  />
    );
}

export default DeleteFeesReport;
