import React, { useContext, useState } from 'react';
import { useHistory, useParams } from "react-router-dom";

import { Context } from 'State/StateProvider'
import ProviderDiscountDialog from './ProviderDiscountDialog';
import { GoBack } from 'Utils/Routing';
import { Api } from 'State';

const EditProviderDiscount = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state, dispatch ] = useContext(Context);
    let [ providerDiscount, setProviderDiscount ] = useState(null);

    let { clientId, providerDiscountId } = useParams();

    if (!providerDiscount) {
        setProviderDiscount(state.Report.ProviderDiscounts.find(p => p.Id === providerDiscountId))
        return;
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        await Api.Advisor.ProviderDiscounts.Update(clientId, providerDiscount);
        await Api.Advisor.ClientDetail.Read(dispatch, clientId);
        goBack();
        return false;
    };

    return (
        <ProviderDiscountDialog providerDiscount    = {providerDiscount}
                                setProviderDiscount = {setProviderDiscount}
                                submitLabel         = 'Update'
                                submitHandler       = {submitHandler}  />
    );
}

export default EditProviderDiscount;
