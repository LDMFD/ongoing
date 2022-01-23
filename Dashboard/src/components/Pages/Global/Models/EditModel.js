import React, { useContext, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { Context } from 'State/StateProvider'
import { SET_MODELS } from 'State/Reducer';
import ModelDialog from './ModelDialog';
import { GoBack } from 'Utils';

const EditModel = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state, dispatch] = useContext(Context);
    let [ model, setModel ] = useState(null);

    let { modelId } = useParams();
    modelId = parseInt(modelId);

    if (!model) {
        let p = state.Models.find(p => p.Id === modelId);
        if (!p) {
            return <>Model not found</>;
        }
        setModel(p)
        return;
    }

    const submitHandler = (e) => {
        e.preventDefault();
        window.ApiClient.put(`/models/${model.Id}`, {
            ...model,
            FileUid: model?.File?.Uid,
        })
        .then(() => {
            goBack();
        })
        .then(_ => {
            window.ApiClient.get("/models").then(res => {
                dispatch({
                    type: SET_MODELS,
                    payload: res.data,
                })
            })
        });
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
