import React, { useContext, useState } from 'react';
import { useHistory } from "react-router-dom";

import { Context } from 'State/StateProvider'
import { GoBack } from 'Utils/Routing';
import { DefaultOperator } from './DefaultOperator';
import OperatorDialog from './OperatorDialog';
import { Api } from 'State';

const AddOperator = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ , dispatch] = useContext(Context);
    let [ operator, setOperator ] = useState(DefaultOperator);

    const submitHandler = async (e) => {
        e.preventDefault();
        await Api.Global.Operators.Create(operator);
        await Api.Global.Entities.Read(dispatch);
        goBack();
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
