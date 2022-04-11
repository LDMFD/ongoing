const Create = (clientId, portfolio) => {
    return window.ApiClient.post(`advisor/clients/${clientId}/portfolios`, {
        ...portfolio,
    });
}

const Update = (clientId, portfolio) => {
    return window.ApiClient.put(`advisor/clients/${clientId}/portfolios/${portfolio.Id}`, {
        ...portfolio
    })
}

const Delete = (clientId, portfolioId) => {
    return window.ApiClient.delete(`advisor/clients/${clientId}/portfolios/${portfolioId}`);
}

const defaults = {
    Create,
    Update,
    Delete,
};
export default defaults;
