import React, { useContext, useState } from 'react';
import { useHistory,  } from "react-router-dom";

import { Api } from 'State';
import { Context } from 'State/StateProvider'
import DefaultModulePreset from './DefaultModulePreset';
import ModulePresetDialog from './ModulePresetDialog';
import { GoBack } from 'Utils';

const AddModulePreset = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [, dispatch] = useContext(Context);

    let [ modulePreset, setModulePreset ] = useState(DefaultModulePreset);

    const submitHandler = async (e) => {
        e.preventDefault();

        if (!modulePreset.ModuleType || modulePreset.ModuleType === 'select') {
            alert('Select a module type first.')
            return false;
        }

        await Api.Global.ModulePresets.Create(modulePreset);
        await Api.Global.ModulePresets.Read(dispatch);
        goBack();
        return false;
    };

    return (
        <ModulePresetDialog modulePreset    = {modulePreset}
                            setModulePreset = {setModulePreset}
                            submitLabel     = 'Add'
                            submitHandler   = {submitHandler}  />
    );
}

export default AddModulePreset;
