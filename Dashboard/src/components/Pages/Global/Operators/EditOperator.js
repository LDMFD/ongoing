import React, { useContext, useState } from 'react';
import { useHistory, useParams } from "react-router-dom";

import { Context } from 'State/StateProvider'
import { SET_OPERATORS } from 'State/Reducer';
import { GoBack } from 'Utils';
import OperatorDialog from './OperatorDialog';

const EditOperator = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state, dispatch] = useContext(Context);

    let [ operator, setOperator ] = useState(null);

    let { operatorId } = useParams();
    operatorId = parseInt(operatorId);

    if (!operator) {
        setOperator(state.Operators.find(o => o.Id === operatorId))
        return;
    }

    const submitHandler = (e) => {
        e.preventDefault();
        window.ApiClient.put(`advisor/operators/${operator.Id}`, {
            ...operator
        })
        .then(() => {
            goBack();
        })
        .then(_ => {
            window.ApiClient.get("advisor/operators").then(res => {
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
                        submitLabel   = 'Update'
                        submitHandler = {submitHandler} />
    );
}

export default EditOperator;
