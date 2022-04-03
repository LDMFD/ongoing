const Create = (policyProvider) => {
    return window.ApiClient.post(`advisor/policy-providers`, {
        ...policyProvider,
    });
}

const Update = (policyProvider) => {
    return window.ApiClient.put(`advisor/policy-providers/${policyProvider.Id}`, {
        ...policyProvider
    })
}

const Delete = (policyProviderId) => {
    return window.ApiClient.delete(`advisor/policy-providers/${policyProviderId}`)
}

const defaults = {
    Create,
    Update,
    Delete,
};
export default defaults;
