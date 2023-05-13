import { useContext, useState } from 'react';
import { useParams } from "react-router-dom";

import { Api } from 'State';
import { Context } from 'State/StateProvider';
import ConfirmationDialog from '../../../../Library/Confirmation/ConfirmationDialog';

const DeleteModulePreset = () => {
    const [ state, dispatch ] = useContext(Context);
    let [ modulePreset, setModulePreset ] = useState(null);

    let { modulePresetId } = useParams();

    const onDelete = async (e) => {
        let res = await Api.OrgResources.ModulePresets.Delete(modulePresetId)
        await Api.OrgResources.Entities.Read(dispatch);
        return res;
    };

    if (!modulePreset) {
        let p = state.Resources.ModulePresets.find(p => p.ModuleType === modulePresetId);
        setModulePreset(p)
        return;
    }

    return (
        <ConfirmationDialog label      = 'Delete module preset?'
                            okCallback = {onDelete}  />
    );
}

export default DeleteModulePreset;
