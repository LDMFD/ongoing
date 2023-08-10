import React, { useContext, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { Context } from 'State/StateProvider'
import RiskLevelDialog from './RiskLevelDialog';
import { GoBack } from 'Utils/Routing';
import { Api } from 'State';

const EditRiskLevel = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state, dispatch] = useContext(Context);

    const [ error, setError ] = useState(null);

    const submitHandler = async (riskLevel) => {
        let response = await Api.OrgResources.RiskLevels.Update(riskLevel);
        if (response.error) {
            setError(response.error);
        } else {
            await Api.OrgResources.Entities.Read(dispatch);
            goBack();
        }
    };

    let { levelId } = useParams();

    let riskLevel = state.Resources.RiskLevels.find(p => p.Id === levelId);

    return (
        <RiskLevelDialog
            state         = {state}
            riskLevel     = {riskLevel}
            submitLabel   = 'Update'
            submitHandler = {submitHandler}
            error         = {error}
        />
    );
}

export default EditRiskLevel;
