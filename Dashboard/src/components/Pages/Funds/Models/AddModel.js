import React, { useContext, useState } from 'react';
import { useHistory } from "react-router-dom";

import { Context } from 'Store'
import { SET_MODELS } from 'Reducer';
import { DefaultModel } from './DefaultModel';
import ModelDialog from './ModelDialog';
import { GoBack } from 'Utils';

const AddModel = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ , dispatch] = useContext(Context);

    let [ model, setModel ] = useState(DefaultModel);

    const submitHandler = (e) => {
        e.preventDefault();
        window.ApiClient.post("/models", {
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
        <ModelDialog model     = {model}
                         setModel  = {setModel}
                         submitLabel   = 'Add'
                         submitHandler = {submitHandler}  />
    );
}

export default AddModel;
