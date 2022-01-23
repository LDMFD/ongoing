import React, { useContext, useState } from 'react';
import { useHistory } from "react-router-dom";

import { Context } from 'StateProvider'
import { SET_OPERATORS } from 'Reducer';
import { GoBack } from 'Utils';
import { DefaultOperator } from './DefaultOperator';
import OperatorDialog from './OperatorDialog';

const AddOperator = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ , dispatch] = useContext(Context);

    let [ operator, setOperator ] = useState(DefaultOperator);

    const submitHandler = (e) => {
        e.preventDefault();
        window.ApiClient.post("/operators", {
            ...operator
        })
        .then(() => {
            goBack();
        })
        .then(_ => {
            window.ApiClient.get("/operators").then(res => {
                dispatch({
                    type: SET_OPERATORS,
                    payload: res.data,
                })
            });
        });
        return false;
    };

    return (
        <OperatorDialog operator      = {operator}
                        setOperator   = {setOperator}
                        submitLabel   = 'Add'
                        submitHandler = {submitHandler} />
    );
}

export default AddOperator;
