import React, { useContext, useState } from 'react';
import { useHistory, useParams } from "react-router-dom";

import { Api } from 'State';
import { Context } from 'State/StateProvider'
import ModulePresetDialog from './ModulePresetDialog';
import { GoBack } from 'Utils';

const EditModulePreset = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state, dispatch ] = useContext(Context);
    let [ modulePreset, setModulePreset ] = useState(null);

    let { modulePresetId } = useParams();
    modulePresetId = parseInt(modulePresetId);

    if (!modulePreset) {
        let p = state.ModulePresets.find(p => p.Id === modulePresetId);
        if (!p) {
            return <>ModulePreset not found</>;
        }
        setModulePreset(p)
        return;
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        await Api.Global.ModulePresets.Update(modulePreset);
        await Api.Global.ModulePresets.Read(dispatch);
        goBack();
        return false;
    };

    return (
        <ModulePresetDialog modulePreset    = {modulePreset}
                            setModulePreset = {setModulePreset}
                            submitLabel     = 'Update'
                            submitHandler   = {submitHandler}  />
    );
}

export default EditModulePreset;
