import { DeletionConfirmation } from 'Components/Library/Confirmation/DeletionConfirmation';
import React, { useContext, useState } from 'react';
import { useParams } from "react-router-dom";

import { Api, Context } from 'State';

const DeleteRiskLevel = () => {
    const [ state, dispatch ] = useContext(Context);
    let [ riskLevel, setRiskLevel ] = useState(null);

    let { levelId } = useParams();

    const onDelete = async (execute) => {
        let res = await Api.OrgResources.RiskLevels.Delete(levelId, execute)
        await Api.OrgResources.Entities.Read(dispatch);
        return res;
    };

    if (!riskLevel) {
        let p = state.Resources.RiskLevels.find(p => p.Id === levelId);
        setRiskLevel(p)
        return;
    }

    return (
        <DeletionConfirmation
            handler    = {onDelete}
            label      = {`Delete risk level ${riskLevel.Name}?`}
            warning    = 'This risk level is currently in use by client risk assessments, which will also be deleted if the level is deleted. The clients are:'
            prompt     = 'Are you sure you want to delete this risk level'
            dependents = 'and all linked assessments'
        />
    );
}

export default DeleteRiskLevel;
