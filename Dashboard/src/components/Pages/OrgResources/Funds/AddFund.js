import React, { useContext, useState } from 'react';
import { useHistory,  } from "react-router-dom";

import { Context } from 'State/StateProvider'
import DefaultFund from './DefaultFund';
import FundDialog from './FundDialog';
import { GoBack } from 'Utils/Routing';
import { Api } from 'State';

const AddFund = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [, dispatch] = useContext(Context);

    let [ fund, setFund ] = useState(DefaultFund);

    const submitHandler = async (e) => {
        e.preventDefault();
        await Api.OrgResources.Funds.Create(fund);
        await Api.OrgResources.Entities.Read(dispatch);
        goBack();
        return false;
    };

    return (
        <FundDialog fund          = {fund}
                    setFund       = {setFund}
                    submitLabel   = 'Add'
                    submitHandler = {submitHandler}  />
    );
}

export default AddFund;
