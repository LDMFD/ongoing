import React, { useContext, useState } from 'react';
import { useHistory } from "react-router-dom";

import { Api } from 'State';
import { Context } from 'State/StateProvider'
import DefaultModulePreset from './DefaultModulePreset';
import ModulePresetDialog from './ModulePresetDialog';
import { GoBack } from 'Utils/Routing';

const AddModulePreset = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state, dispatch ] = useContext(Context);
    const [ error, setError ] = useState(null);

    const submitHandler = async (preset) => {
        let response = await Api.OrgResources.ModulePresets.Create(preset);
        if (response.error) {
            setError(response.error);
        } else {
            await Api.OrgResources.Entities.Read(dispatch);
            goBack();
        }
    };

    return (
        <ModulePresetDialog
            state         = {state}
            preset        = {DefaultModulePreset}
            submitLabel   = 'Add'
            submitHandler = {submitHandler}
            error         = {error}
        />
    );
}

export default AddModulePreset;
