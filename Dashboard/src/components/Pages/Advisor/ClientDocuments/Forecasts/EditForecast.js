import React, { useContext } from 'react';
import { useHistory, useParams } from "react-router-dom";

import { Context } from 'State/StateProvider'
import ForecastDialog from './ForecastDialog';
import { GoBack } from 'Utils/Routing';
import { Api } from 'State';

const EditForecast = () => {
    let history = useHistory();
    let goBack = GoBack(history);

    const [ state, dispatch] = useContext(Context);

    let { forecastId } = useParams();

    let client = state.Metadata;

    const submitHandler = async (forecast) => {
        await Api.Advisor.Forecasts.Update(client.Id, forecast)
        await Api.Advisor.ClientDetail.Read(dispatch, client.Id)
        goBack();
    };
    
    let forecast = state.Report.Forecasts.find(h => h.Id === forecastId);

    return (
        <ForecastDialog forecast      = {forecast}
                        state         = {state}
                        submitLabel   = 'Update'
                        submitHandler = {submitHandler}  />
    );
}

export default EditForecast;
