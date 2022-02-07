import React, { useContext, useState } from 'react';
import { useHistory, useParams } from "react-router-dom";

import { Api } from 'State';
import { Context } from 'State/StateProvider'
import DiligenceTemplateDialog from './DiligenceTemplateDialog';
import { GoBack } from 'Utils';

const EditDiligenceTemplate = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state, dispatch ] = useContext(Context);
    let [ diligenceTemplate, setDiligenceTemplate ] = useState(null);

    let { diligenceTemplateId } = useParams();
    diligenceTemplateId = parseInt(diligenceTemplateId);

    if (!diligenceTemplate) {
        let p = state.DiligenceTemplates.find(p => p.Id === diligenceTemplateId);
        if (!p) {
            return <>DiligenceTemplate not found</>;
        }
        setDiligenceTemplate(p)
        return;
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        await Api.Global.DiligenceTemplates.Update(diligenceTemplate);
        await Api.Global.DiligenceTemplates.Read(dispatch);
        goBack();
        return false;
    };

    return (
        <DiligenceTemplateDialog diligenceTemplate    = {diligenceTemplate}
                                 setDiligenceTemplate = {setDiligenceTemplate}
                                 submitLabel          = 'Update'
                                 submitHandler        = {submitHandler}  />
    );
}

export default EditDiligenceTemplate;
