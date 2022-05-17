const Create = (clientId, forecast) => {
    return window.ApiClient.post(`advisor/clients/${clientId}/forecasts`, {
        ...forecast,
    });
}

const Update = (clientId, forecast) => {
    return window.ApiClient.put(`advisor/clients/${clientId}/forecasts/${forecast.Id}`, {
        ...forecast
    })
}

const Delete = (clientId, forecastId) => {
    return window.ApiClient.delete(`advisor/clients/${clientId}/forecasts/${forecastId}`);
}

const defaults = {
    Create,
    Update,
    Delete,
};
export default defaults;
