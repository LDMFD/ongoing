import { useContext } from 'react';
import { useParams } from 'react-router-dom';

import { Api } from 'State';
import { Context } from 'State';
import ConfirmationDialog from 'Components/Library/Confirmation/ConfirmationDialog';

const DeletePlatformDiscount = () => {
    const [ , dispatch] = useContext(Context);

    let { clientId, providerDiscountId } = useParams();

    const onDelete = async () => {
        let res = await Api.Advisor.ProviderDiscounts.Delete(clientId, providerDiscountId);
        await Api.Advisor.ClientDetail.Read(dispatch, clientId);
        return res;
    };

    return (
        <ConfirmationDialog label      = 'Delete platform discount?'
                            okCallback = {onDelete}  />
    );
}

export default DeletePlatformDiscount;
