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
    let [ riskLevel, setRiskLevel ] = useState(null);

    let { levelId } = useParams();

    if (!riskLevel) {
        let p = state.Entities.RiskLevels.find(p => p.Id === levelId);
        setRiskLevel(p)
        return;
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        await Api.Global.RiskLevels.Update(riskLevel);
        await Api.Global.Entities.Read(dispatch);
        goBack();
        return false;
    };

    return (
        <RiskLevelDialog riskLevel     = {riskLevel}
                         setRiskLevel  = {setRiskLevel}
                         submitLabel   = 'Update'
                         submitHandler = {submitHandler} />
    );
}

export default EditRiskLevel;
