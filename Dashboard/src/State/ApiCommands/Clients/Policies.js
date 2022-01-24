const Create = (clientId, policy) => {
    return window.ApiClient.post(`/clients/${clientId}/policies`, {
        ...policy,
    });
}

const Update = (clientId, policy) => {
    return window.ApiClient.put(`/clients/${clientId}/policies/${policy.Id}`, {
        ...policy
    })
}

const Delete = (clientId, policyId) => {
    return window.ApiClient.delete(`/clients/${clientId}/policies/${policyId}`);
}

const defaults = {
    Create,
    Update,
    Delete,
};
export default defaults;
