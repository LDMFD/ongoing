const Create = (clientId, portfolio) => {
    return window.ApiClient.post(`/clients/${clientId}/portfolios`, {
        ...portfolio,
    });
}

const Update = (client) => {
    return window.ApiClient.put(`/clients/${client.Id}`, {
        ...client
    })
}

const Delete = (clientId, portfolioId) => {
    return window.ApiClient.delete(`/clients/${clientId}/portfolios/${portfolioId}`);
}

const defaults = {
    Create,
    Update,
    Delete,
};
export default defaults;
