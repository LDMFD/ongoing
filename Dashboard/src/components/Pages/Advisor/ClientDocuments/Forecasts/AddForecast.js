import React, { useContext, useState } from 'react';
import { useHistory, useParams } from "react-router-dom";

import { Context } from 'State/StateProvider'
import { DefaultForecast } from './DefaultForecast';
import ForecastDialog from './ForecastDialog';
import { GoBack } from 'Utils/Routing';
import { Api } from 'State';

const AddForecast = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [, dispatch] = useContext(Context);
    let [ forecast, setForecast ] = useState(DefaultForecast);

    let { clientId } = useParams();

    const submitHandler = async (e) => {
        e.preventDefault();
        await Api.Advisor.Forecasts.Create(clientId, forecast);
        await Api.Advisor.ClientDetail.Read(dispatch, clientId);
        goBack();
        return false;
    };
    
    return (
        <ForecastDialog forecast      = {forecast}
                        setForecast   = {setForecast}
                        submitLabel   = 'Add'
                        submitHandler = {submitHandler}  />
    );
}

export default AddForecast;
