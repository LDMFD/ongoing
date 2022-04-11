const Create = (clientId, policyFund) => {
    return window.ApiClient.post(`advisor/clients/${clientId}/policy-funds`, {
        ...policyFund,
    });
}

const Update = (clientId, policyFund) => {
    return window.ApiClient.put(`advisor/clients/${clientId}/policy-funds/${policyFund.Id}`, {
        ...policyFund
    })
}

const Delete = (clientId, policyFundId) => {
    return window.ApiClient.delete(`advisor/clients/${clientId}/policy-funds/${policyFundId}`);
}

const defaults = {
    Create,
    Update,
    Delete,
};
export default defaults;
