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

    const [ state, dispatch] = useContext(Context);

    let { riskProviderId } = useParams();

    const [ error, setError ] = useState(null);
    
    const submitHandler = async (riskLevel) => {
        riskLevel.RiskProviderId = riskProviderId;
        let response = await Api.OrgResources.RiskLevels.Create(riskLevel);
        if (response.error) {
            setError(response.error);
        } else {
            await Api.OrgResources.Entities.Read(dispatch);
            goBack();
        }
    };

    return (
        <RiskLevelDialog
            state         = {state}
            riskLevel     = {DefaultRiskLevel}
            submitLabel   = 'Add'
            submitHandler = {submitHandler}  
            error         = {error}
        />
    );
}

export default AddRiskLevel;
