import React, { useContext, useState } from 'react';
import { useHistory, useParams } from "react-router-dom";

import { Api } from 'State';
import { Context } from 'State/StateProvider'
import { GoBack } from 'Utils/Routing';
import ConfirmationDialog from '../../../../Library/ConfirmationDialog';

const DeleteModulePreset = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state, dispatch ] = useContext(Context);
    let [ modulePreset, setModulePreset ] = useState(null);

    let { modulePresetId } = useParams();
    modulePresetId = parseInt(modulePresetId);

    const onDelete = async (e) => {
        e.preventDefault();

        await Api.Global.ModulePresets.Delete(modulePresetId)
        await Api.Global.Entities.Read(dispatch);

        goBack();
        return false;
    };

    if (!modulePreset) {
        let p = state.Entities.ModulePresets.find(p => p.Id === modulePresetId);
        setModulePreset(p)
        return;
    }

    return (
        <ConfirmationDialog label      = 'Delete module preset?'
                            okCallback = {onDelete}  />
    );
}

export default DeleteModulePreset;
