import React, { useContext } from 'react';
import { useHistory, useParams } from "react-router-dom";

import { Context } from 'State/StateProvider'
import { DefaultForecast } from './DefaultForecast';
import ForecastDialog from './ForecastDialog';
import { GoBack } from 'Utils/Routing';
import { Api } from 'State';

const AddForecast = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state, dispatch] = useContext(Context);

    let { clientId } = useParams();

    const submitHandler = async (forecast) => {
        await Api.Advisor.Forecasts.Create(clientId, forecast);
        await Api.Advisor.ClientDetail.Read(dispatch, clientId);
        goBack();
    };
    
    return (
        <ForecastDialog forecast      = {DefaultForecast}
                        state         = {state}
                        submitLabel   = 'Add'
                        submitHandler = {submitHandler}  />
    );
}

export default AddForecast;
