import React, { useContext } from 'react';
import { useHistory, useParams } from "react-router-dom";

import { Context } from 'State/StateProvider'
import { DefaultProviderDiscount } from './DefaultProviderDiscount';
import ProviderDiscountDialog from './ProviderDiscountDialog';
import { GoBack } from 'Utils/Routing';
import { Api } from 'State';

const AddProviderDiscount = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state, dispatch] = useContext(Context);

    let { clientId } = useParams();

    const submitHandler = async (providerDiscount) => {
        await Api.Advisor.ProviderDiscounts.Create(clientId, providerDiscount);
        await Api.Advisor.ClientDetail.Read(dispatch, clientId);
        goBack();
    };

    return (
        <ProviderDiscountDialog providerDiscount    = {DefaultProviderDiscount}
                                state               = {state}
                                submitLabel         = 'Add'
                                submitHandler       = {submitHandler}  />
    );
}

export default AddProviderDiscount;
