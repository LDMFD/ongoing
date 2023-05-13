import ConfirmationDialog from 'Components/Library/Confirmation/ConfirmationDialog';
import { useContext } from 'react';
import { useParams } from "react-router-dom";

import { Api } from 'State';
import { Context } from 'State/StateProvider';

const DeleteRiskAssessment = () => {
    const [ , dispatch ] = useContext(Context);

    let { clientId, riskAssessmentId } = useParams();

    const onDelete = async () => {
        let res = await Api.Advisor.RiskAssessments.Delete(clientId, riskAssessmentId);
        await Api.Advisor.ClientDetail.Read(dispatch, clientId);
        return res;
    };

    return (
        <ConfirmationDialog label      = 'Delete risk assessment?'
                            okCallback = {onDelete}  />
    );
}

export default DeleteRiskAssessment;
