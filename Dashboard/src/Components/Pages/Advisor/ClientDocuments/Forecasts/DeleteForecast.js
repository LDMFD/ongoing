import ConfirmationDialog from 'Components/Library/Confirmation/ConfirmationDialog';
import { useContext } from 'react';
import { useParams } from "react-router-dom";

import { Api } from 'State';
import { Context } from 'State/StateProvider';

const DeleteForecast = () => {
    const [ , dispatch ] = useContext(Context);

    let { clientId, forecastId } = useParams();

    const onDelete = async () => {
        let res = await Api.Advisor.Forecasts.Delete(clientId, forecastId);
        await Api.Advisor.ClientDetail.Read(dispatch, clientId);
        return res;
    };

    return (
        <ConfirmationDialog label      = 'Delete forecast?'
                            okCallback = {onDelete}  />
    );
}

export default DeleteForecast;
