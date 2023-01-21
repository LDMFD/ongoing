import React, { useContext } from 'react';
import { useHistory, useParams } from "react-router-dom";

import { Api } from 'State';
import { Context } from 'State/StateProvider'
import { GoBack } from 'Utils/Routing';
import ModulePresetDialog from './ModulePresetDialog';

const EditModulePreset = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state, dispatch ] = useContext(Context);

    let { modulePresetId } = useParams();

    const submitHandler = async (preset) => {
        await Api.OrgResources.ModulePresets.Update(preset);
        await Api.OrgResources.Entities.Read(dispatch);
        goBack();
    };

    let preset = state.Resources.ModulePresets.find(p => p.ModuleType === modulePresetId);

    return (
        <ModulePresetDialog
            state         = {state}
            preset        = {preset}
            submitLabel   = 'Update'
            submitHandler = {submitHandler}  />
    );
}

export default EditModulePreset;
