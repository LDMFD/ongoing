import React, { useContext, useState } from 'react';
import { useHistory, useParams } from "react-router-dom";

import { Context } from 'State/StateProvider'
import { DefaultProviderDiscount } from './DefaultProviderDiscount';
import ProviderDiscountDialog from './ProviderDiscountDialog';
import { GoBack } from 'Utils/Routing';
import { Api } from 'State';

const AddProviderDiscount = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [, dispatch] = useContext(Context);
    let [ providerDiscount, setProviderDiscount ] = useState(DefaultProviderDiscount);

    let { clientId } = useParams();

    const submitHandler = async (e) => {
        e.preventDefault();
        await Api.Advisor.ProviderDiscounts.Create(clientId, providerDiscount);
        await Api.Advisor.ClientDetail.Read(dispatch, clientId);
        goBack();
        return false;
    };

    return (
        <ProviderDiscountDialog providerDiscount    = {providerDiscount}
                                setProviderDiscount = {setProviderDiscount}
                                submitLabel         = 'Add'
                                submitHandler       = {submitHandler}  />
    );
}

export default AddProviderDiscount;
