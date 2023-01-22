import React, { useContext, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { Api } from 'State';
import { Context } from 'State/StateProvider'
import { GoBack } from 'Utils/Routing';
import ModelDialog from './ModelDialog';

const EditModel = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state, dispatch] = useContext(Context);

    let { modelId } = useParams();

    const [ error, setError ] = useState(null);

    const submitHandler = async (model) => {
        let response = await Api.OrgResources.Models.Update(model);
        if (response.error) {
            setError(response.error);
        } else {
            await Api.OrgResources.Entities.Read(dispatch);
            goBack();
        }
    };

    let model = state.Resources.Models.find(p => p.Id === modelId);

    return (
        <ModelDialog
            model         = {model}
            state          = {state}
            submitLabel   = 'Update'
            submitHandler = {submitHandler}
            error          = {error}
        />
    );
}

export default EditModel;
