import React, { useContext, useState } from 'react';
import { useHistory, useParams } from "react-router-dom";

import { Context } from 'State/StateProvider'
import FundDialog from './FundDialog';
import { GoBack } from 'Utils/Routing';
import { Api } from 'State';

const EditFund = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state, dispatch ] = useContext(Context);
    let [ fund, setFund ] = useState(null);

    let { fundId } = useParams();

    const submitHandler = async (e) => {
        e.preventDefault();
        await Api.OrgResources.Funds.Update(fund);
        await Api.OrgResources.Entities.Read(dispatch);
        goBack();
        return false;
    };

    if (!fund) {
        let p = state.Resources.Funds.find(p => p.Id === fundId);
        setFund(p)
        return;
    }
    return (
        <FundDialog fund          = {fund}
                    setFund       = {setFund}
                    submitLabel   = 'Update'
                    submitHandler = {submitHandler}  />
    );
}

export default EditFund;
