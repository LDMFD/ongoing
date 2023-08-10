import React, { useContext, useState } from 'react';
import { useHistory, useParams } from "react-router-dom";

import { Context } from 'State/StateProvider'
import ProviderDiscountDialog from './ProviderDiscountDialog';
import { GoBack } from 'Utils/Routing';
import { Api } from 'State';

const EditProviderDiscount = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    let { clientId, providerDiscountId } = useParams();

    const [ state, dispatch ] = useContext(Context);

    const [ error, setError ] = useState(null);

    const submitHandler = async (discount) => {
        let response = await Api.Advisor.ProviderDiscounts.Update(clientId, discount);
        if (response.error) {
            setError(response.error);
        } else {
            await Api.Advisor.ClientDetail.Read(dispatch, clientId);
            goBack();
        }
    };

    let discount = state.Report.ProviderDiscounts.find(p => p.Id === providerDiscountId);

    return (
        <ProviderDiscountDialog
            providerDiscount = {discount}
            state            = {state}
            submitLabel      = 'Update'
            submitHandler    = {submitHandler}
            error            = {error}
        />
    );
}

export default EditProviderDiscount;
