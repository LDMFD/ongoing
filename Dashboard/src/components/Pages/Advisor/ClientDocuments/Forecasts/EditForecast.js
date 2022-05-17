import React, { useContext, useState } from 'react';
import { useHistory, useParams } from "react-router-dom";

import { Context } from 'State/StateProvider'
import ForecastDialog from './ForecastDialog';
import { GoBack } from 'Utils/Routing';
import { Api } from 'State';

const EditForecast = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state, dispatch] = useContext(Context);
    let [ forecast, setForecast ] = useState(null);

    let { forecastId } = useParams();

    let client = state.ClientContext;

    if (!forecast) {
        setForecast(state.Report.Forecasts.find(h => h.Id === forecastId))
        return;
    }
    const submitHandler = async (e) => {
        e.preventDefault();
        await Api.Advisor.Forecasts.Update(client.Id, forecast)
        await Api.Advisor.ClientDetail.Read(dispatch, client.Id)
        goBack();
        return false;
    };

    return (
        <ForecastDialog forecast      = {forecast}
                        setForecast   = {setForecast}
                        submitLabel   = 'Update'
                        submitHandler = {submitHandler}  />
    );
}

export default EditForecast;
