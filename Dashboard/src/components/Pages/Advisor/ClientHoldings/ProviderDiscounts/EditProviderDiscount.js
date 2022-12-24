import React, { useContext } from 'react';
import { useHistory, useParams } from "react-router-dom";

import { Context } from 'State/StateProvider'
import ProviderDiscountDialog from './ProviderDiscountDialog';
import { GoBack } from 'Utils/Routing';
import { Api } from 'State';

const EditProviderDiscount = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state, dispatch ] = useContext(Context);

    let { clientId, providerDiscountId } = useParams();

    const submitHandler = async (discount) => {
        await Api.Advisor.ProviderDiscounts.Update(clientId, discount);
        await Api.Advisor.ClientDetail.Read(dispatch, clientId);
        goBack();
    };

    let discount = state.Report.ProviderDiscounts.find(p => p.Id === providerDiscountId);

    return (
        <ProviderDiscountDialog providerDiscount    = {discount}
                                state               = {state}
                                submitLabel         = 'Update'
                                submitHandler       = {submitHandler}  />
    );
}

export default EditProviderDiscount;
