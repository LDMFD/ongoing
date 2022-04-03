import React, { useContext, useState } from 'react';
import { useHistory, useParams } from "react-router-dom";

import { Context } from 'State/StateProvider'
import { GoBack } from 'Utils/Routing';
import OperatorDialog from './OperatorDialog';
import { Api } from 'State';

const EditOperator = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state, dispatch] = useContext(Context);

    let [ operator, setOperator ] = useState(null);

    let { operatorId } = useParams();

    const submitHandler = async (e) => {
        e.preventDefault();
        await Api.Global.Operators.Update(operator);
        await Api.Global.Entities.Read(dispatch);
        goBack();
        return false;
    };

    if (!operator) {
        setOperator(state.Entities.Operators.find(o => o.Id === operatorId))
        return;
    }

    return (
        <OperatorDialog operator      = {operator}
                        setOperator   = {setOperator}
                        submitLabel   = 'Update'
                        submitHandler = {submitHandler} />
    );
}

export default EditOperator;
