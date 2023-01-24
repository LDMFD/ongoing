import React, { useContext, useState } from 'react';
import { useHistory, useParams } from "react-router-dom";

import { Api } from 'State';
import { Context } from 'State/StateProvider'
import { GoBack } from 'Utils/Routing';
import FundDialog from './FundDialog';

const EditFund = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state, dispatch ] = useContext(Context);

    let { fundId } = useParams();

    const [ error, setError ] = useState(null);

    const submitHandler = async (fund) => {
        let response = await Api.OrgResources.Funds.Update(fund);
        if (response.error) {
            setError(response.error);
        } else {
            await Api.OrgResources.Entities.Read(dispatch);
            goBack();
        }
    };

    let fund = state.Resources.Funds.find(p => p.Id === fundId);
    
    return (
        <FundDialog
            fund          = {fund}
            state         = {state}
            submitLabel   = 'Update'
            submitHandler = {submitHandler}
            error         = {error}
        />
    );
}

export default EditFund;
