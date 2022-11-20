import React, { useContext, useState } from 'react';
import { useHistory, useParams } from "react-router-dom";

import { Api } from 'State';
import { Context } from 'State/StateProvider'
import ModulePresetDialog from './ModulePresetDialog';
import { GoBack } from 'Utils/Routing';

const EditModulePreset = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state, dispatch ] = useContext(Context);
    let [ modulePreset, setModulePreset ] = useState(null);

    let { modulePresetId } = useParams();

    if (!modulePreset) {
        let p = state.Resources.ModulePresets.find(p => p.ModuleType === modulePresetId);
        setModulePreset(p)
        return;
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        await Api.OrgResources.ModulePresets.Update(modulePreset);
        await Api.OrgResources.Entities.Read(dispatch);
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
