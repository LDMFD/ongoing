import React, { useContext, useState } from 'react';
import { useHistory, useParams } from "react-router-dom";

import { Context } from 'State/StateProvider'
import RiskAssessmentDialog from './RiskAssessmentDialog';
import { GoBack } from 'Utils/Routing';
import { Api } from 'State';

const EditRiskAssessment = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state, dispatch] = useContext(Context);
    let [ assessment, setAssessment ] = useState(null);

    let { riskAssessmentId } = useParams();

    let client = state.ClientContext;

    if (!assessment) {
        setAssessment(state.Report.RiskAssessments.find(h => h.Id === riskAssessmentId))
        return;
    }
    const submitHandler = async (e) => {
        e.preventDefault();
        await Api.Advisor.RiskAssessments.Update(client.Id, assessment)
        await Api.Advisor.ClientDetail.Read(dispatch, client.Id)
        goBack();
        return false;
    };

    return (
        <RiskAssessmentDialog assessment     = {assessment}
                              setAssessment  = {setAssessment}
                              submitLabel    = 'Update'
                              submitHandler  = {submitHandler}  />
    );
}

export default EditRiskAssessment;
