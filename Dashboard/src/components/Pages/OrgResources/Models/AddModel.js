import React, { useContext, useState } from 'react';
import { useHistory } from "react-router-dom";

import { Context } from 'State/StateProvider'
import { DefaultModel } from './DefaultModel';
import ModelDialog from './ModelDialog';
import { GoBack } from 'Utils/Routing';
import { Api } from 'State';

const AddModel = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ , dispatch] = useContext(Context);

    let [ model, setModel ] = useState(DefaultModel);

    const submitHandler = async (e) => {
        e.preventDefault();
        await Api.OrgResources.Models.Create(model);
        await Api.OrgResources.Entities.Read(dispatch);
        goBack();
        return false;
    };

    return (
        <ModelDialog model         = {model}
                     setModel      = {setModel}
                     submitLabel   = 'Add'
                     submitHandler = {submitHandler}  />
    );
}

export default AddModel;
