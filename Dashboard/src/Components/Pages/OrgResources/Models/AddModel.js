import React, { useContext, useState } from 'react';
import { useHistory } from "react-router-dom";

import { Api } from 'State';
import { Context } from 'State/StateProvider'
import { DefaultModel } from './DefaultModel';
import { GoBack } from 'Utils/Routing';
import ModelDialog from './ModelDialog';

const AddModel = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state, dispatch] = useContext(Context);

    const [ error, setError ] = useState(null);

    const submitHandler = async (model) => {
        let response = await Api.OrgResources.Models.Create(model);
        if (response.error) {
            setError(response.error);
        } else {
            await Api.OrgResources.Entities.Read(dispatch);
            goBack();
        }
    };

    return (
        <ModelDialog
            state         = {state}
            model         = {DefaultModel}
            submitLabel   = 'Add'
            submitHandler = {submitHandler}
            error         = {error}
        />
    );
}

export default AddModel;
