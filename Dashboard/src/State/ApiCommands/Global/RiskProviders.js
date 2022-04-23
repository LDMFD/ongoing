const Create = (riskProvider) => {
    return window.ApiClient.post(`advisor/risk-providers`, {
        ...riskProvider,
    });
}

const Update = (riskProvider) => {
    return window.ApiClient.put(`advisor/risk-providers/${riskProvider.Id}`, {
        ...riskProvider
    })
}

const Delete = (riskProviderId) => {
    return window.ApiClient.delete(`advisor/risk-providers/${riskProviderId}`)
}

const defaults = {
    Create,
    Update,
    Delete,
};
export default defaults;
