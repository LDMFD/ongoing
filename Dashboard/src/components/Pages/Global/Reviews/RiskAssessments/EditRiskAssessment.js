import React, { useContext, useState } from 'react';
import { useHistory, useParams } from "react-router-dom";

import { Api } from 'State';
import { Context } from 'State/StateProvider'
import RiskAssessmentDialog from './RiskAssessmentDialog';
import { GoBack } from 'Utils';

const EditRiskAssessment = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state, dispatch ] = useContext(Context);
    let [ riskAssessment, setRiskAssessment ] = useState(null);

    let { riskAssessmentId } = useParams();
    riskAssessmentId = parseInt(riskAssessmentId);

    if (!riskAssessment) {
        let p = state.RiskAssessments.find(p => p.Id === riskAssessmentId);
        if (!p) {
            return <>RiskAssessment not found</>;
        }
        setRiskAssessment(p)
        return;
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        await Api.Global.RiskAssessments.Update(riskAssessment);
        await Api.Global.RiskAssessments.Read(dispatch);
        goBack();
        return false;
    };

    return (
        <RiskAssessmentDialog riskAssessment    = {riskAssessment}
                              setRiskAssessment = {setRiskAssessment}
                              submitLabel          = 'Update'
                              submitHandler        = {submitHandler}  />
    );
}

export default EditRiskAssessment;
