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

    let { clientId } = useParams();

    const [ state, dispatch] = useContext(Context);

    const [ error, setError ] = useState(null);

    const submitHandler = async (providerDiscount) => {
        let response = await Api.Advisor.ProviderDiscounts.Create(clientId, providerDiscount);
        if (response.error) {
            setError(response.error);
        } else {
            await Api.Advisor.ClientDetail.Read(dispatch, clientId);
            goBack();
        }
    };

    return (
        <ProviderDiscountDialog
            providerDiscount = {DefaultProviderDiscount}
            state            = {state}
            submitLabel      = 'Add'
            submitHandler    = {submitHandler}
            error            = {error}
        />
    );
}

export default AddProviderDiscount;
