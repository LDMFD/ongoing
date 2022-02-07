import React, { useContext, useState } from 'react';
import { useHistory,  } from "react-router-dom";

import { Api } from 'State';
import { Context } from 'State/StateProvider'
import DefaultDiligenceTemplate from './DefaultDiligenceTemplate';
import DiligenceTemplateDialog from './DiligenceTemplateDialog';
import { GoBack } from 'Utils';

const AddDiligenceTemplate = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [, dispatch] = useContext(Context);

    let [ diligenceTemplate, setDiligenceTemplate ] = useState(DefaultDiligenceTemplate);

    const submitHandler = async (e) => {
        e.preventDefault();
        await Api.Global.DiligenceTemplates.Create(diligenceTemplate);
        await Api.Global.DiligenceTemplates.Read(dispatch);
        goBack();
        return false;
    };

    return (
        <DiligenceTemplateDialog diligenceTemplate    = {diligenceTemplate}
                                 setDiligenceTemplate = {setDiligenceTemplate}
                                 submitLabel          = 'Add'
                                 submitHandler        = {submitHandler}  />
    );
}

export default AddDiligenceTemplate;
