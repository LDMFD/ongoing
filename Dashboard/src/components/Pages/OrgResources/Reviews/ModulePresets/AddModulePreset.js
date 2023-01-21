import React, { useContext } from 'react';
import { useHistory } from "react-router-dom";

import { Api } from 'State';
import { Context } from 'State/StateProvider'
import DefaultModulePreset from './DefaultModulePreset';
import ModulePresetDialog from './ModulePresetDialog';
import { GoBack } from 'Utils/Routing';

const AddModulePreset = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state, dispatch] = useContext(Context);

    const submitHandler = async (preset) => {
        await Api.OrgResources.ModulePresets.Create(preset);
        await Api.OrgResources.Entities.Read(dispatch);
        goBack();
    };

    return (
        <ModulePresetDialog
            state         = {state}
            preset        = {DefaultModulePreset}
            submitLabel   = 'Add'
            submitHandler = {submitHandler}
        />
    );
}

export default AddModulePreset;
