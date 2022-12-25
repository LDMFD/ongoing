import React, { useContext } from 'react';
import { useHistory, useParams } from "react-router-dom";

import { Context } from 'State/StateProvider'
import { DefaultRiskAssessment } from './DefaultRiskAssessment';
import RiskAssessmentDialog from './RiskAssessmentDialog';
import { GoBack } from 'Utils/Routing';
import { Api } from 'State';

const AddRiskAssessment = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state, dispatch] = useContext(Context);

    let { clientId } = useParams();

    const submitHandler = async (assessment) => {
        await Api.Advisor.RiskAssessments.Create(clientId, assessment);
        await Api.Advisor.ClientDetail.Read(dispatch, clientId);
        goBack();
    };
    
    return (
        <RiskAssessmentDialog assessment     = {DefaultRiskAssessment}
                              state          = {state}
                              submitLabel    = 'Add'
                              submitHandler  = {submitHandler}  />
    );
}

export default AddRiskAssessment;
