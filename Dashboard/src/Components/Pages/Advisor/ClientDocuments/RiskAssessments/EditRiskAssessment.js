import React, { useContext } from 'react';
import { useHistory, useParams } from "react-router-dom";

import { Context } from 'State/StateProvider'
import RiskAssessmentDialog from './RiskAssessmentDialog';
import { GoBack } from 'Utils/Routing';
import { Api } from 'State';

const EditRiskAssessment = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state, dispatch] = useContext(Context);

    let { clientId, riskAssessmentId } = useParams();

    const submitHandler = async (assessment) => {
        await Api.Advisor.RiskAssessments.Update(clientId, assessment)
        await Api.Advisor.ClientDetail.Read(dispatch, clientId)
        goBack();
    };

    let assessment = state.Report.RiskAssessments.find(h => h.Id === riskAssessmentId);

    return (
        <RiskAssessmentDialog assessment     = {assessment}
                              state          = {state}
                              submitLabel    = 'Update'
                              submitHandler  = {submitHandler}  />
    );
}

export default EditRiskAssessment;
