import React, { useContext, useState } from 'react';
import { useHistory, useParams } from "react-router-dom";

import { Context } from 'State/StateProvider'
import { DefaultRiskAssessment } from './DefaultRiskAssessment';
import RiskAssessmentDialog from './RiskAssessmentDialog';
import { GoBack } from 'Utils/Routing';
import { Api } from 'State';

const AddRiskAssessment = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [, dispatch] = useContext(Context);
    let [ assessment, setAssessment ] = useState(DefaultRiskAssessment);

    let { clientId } = useParams();

    const submitHandler = async (e) => {
        e.preventDefault();
        await Api.Clients.RiskAssessments.Create(clientId, assessment);
        await Api.Clients.ClientDetail.Read(dispatch, clientId);
        goBack();
        return false;
    };
    
    return (
        <RiskAssessmentDialog assessment     = {assessment}
                              setAssessment  = {setAssessment}
                              submitLabel    = 'Add'
                              submitHandler  = {submitHandler}  />
    );
}

export default AddRiskAssessment;
