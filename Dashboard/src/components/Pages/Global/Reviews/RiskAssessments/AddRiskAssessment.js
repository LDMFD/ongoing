import React, { useContext, useState } from 'react';
import { useHistory,  } from "react-router-dom";

import { Api } from 'State';
import { Context } from 'State/StateProvider'
import DefaultRiskAssessment from './DefaultRiskAssessment';
import RiskAssessmentDialog from './RiskAssessmentDialog';
import { GoBack } from 'Utils/Routing';

const AddRiskAssessment = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [, dispatch] = useContext(Context);

    let [ riskAssessment, setRiskAssessment ] = useState(DefaultRiskAssessment);

    const submitHandler = async (e) => {
        e.preventDefault();
        await Api.Global.RiskAssessments.Create(riskAssessment);
        await Api.Global.RiskAssessments.Read(dispatch);
        goBack();
        return false;
    };

    return (
        <RiskAssessmentDialog riskAssessment    = {riskAssessment}
                              setRiskAssessment = {setRiskAssessment}
                              submitLabel          = 'Add'
                              submitHandler        = {submitHandler}  />
    );
}

export default AddRiskAssessment;
