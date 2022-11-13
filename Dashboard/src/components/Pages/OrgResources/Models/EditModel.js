import React, { useContext, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { Context } from 'State/StateProvider'
import ModelDialog from './ModelDialog';
import { GoBack } from 'Utils/Routing';
import { Api } from 'State';

const EditModel = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state, dispatch] = useContext(Context);
    let [ model, setModel ] = useState(null);

    let { modelId } = useParams();

    if (!model) {
        let p = state.Resources.Models.find(p => p.Id === modelId);
        setModel(p)
        return;
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        await Api.OrgResources.Models.Update(model);
        await Api.OrgResources.Entities.Read(dispatch);
        goBack();
        return false;
    };

    return (
        <ModelDialog model         = {model}
                     setModel      = {setModel}
                     submitLabel   = 'Update'
                     submitHandler = {submitHandler} />
    );
}

export default EditModel;
