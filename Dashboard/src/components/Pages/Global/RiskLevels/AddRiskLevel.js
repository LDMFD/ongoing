import React, { useContext, useState } from 'react';
import { useHistory, useParams } from "react-router-dom";

import { Context } from 'State/StateProvider'
import { DefaultRiskLevel } from './DefaultRiskLevel';
import RiskLevelDialog from './RiskLevelDialog';
import { GoBack } from 'Utils/Routing';
import { Api } from 'State';

const AddRiskLevel = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ , dispatch] = useContext(Context);

    let [ riskLevel, setRiskLevel ] = useState(DefaultRiskLevel);

    let { riskProviderId } = useParams();
    riskLevel.RiskProviderId = riskProviderId;

    const submitHandler = async (e) => {
        e.preventDefault();
        await Api.Global.RiskLevels.Create(riskLevel);
        await Api.Global.Entities.Read(dispatch);
        goBack();
        return false;
    };

    return (
        <RiskLevelDialog riskLevel     = {riskLevel}
                         setRiskLevel  = {setRiskLevel}
                         submitLabel   = 'Add'
                         submitHandler = {submitHandler}  />
    );
}

export default AddRiskLevel;
