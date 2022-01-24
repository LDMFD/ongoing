const Create = (clientId, portfolio) => {
    return window.ApiClient.post(`/clients/${clientId}/portfolios`, {
        ...portfolio,
    });
}

const Update = (clientId, portfolio) => {
    return window.ApiClient.put(`/clients/${clientId}/portfolios/${portfolio.Id}`, {
        ...portfolio
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
