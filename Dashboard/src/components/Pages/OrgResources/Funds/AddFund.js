import React, { useContext, useState } from 'react';
import { useHistory } from "react-router-dom";

import { Api } from 'State';
import { Context } from 'State/StateProvider'
import { GoBack } from 'Utils/Routing';
import { DefaultFund } from './DefaultFund';
import FundDialog from './FundDialog';

const AddFund = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state, dispatch] = useContext(Context);

    const [ error, setError ] = useState(null);

    const submitHandler = async (fund) => {
        let response = await Api.OrgResources.Funds.Create(fund);
        if (response.error) {
            setError(response.error);
        } else {
            await Api.OrgResources.Entities.Read(dispatch);
            goBack();
        }
    };

    return (
        <FundDialog
            state         = {state}
            fund          = {DefaultFund}
            submitLabel   = 'Add'
            submitHandler = {submitHandler}
            error         = {error}
        />
    );
}

export default AddFund;
