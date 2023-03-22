const Create = (clientId, policy) => {
    return window.ApiClient.post(`advisor/clients/${clientId}/policies`, {
        ...policy,
    });
}

const Update = (clientId, policy) => {
    return window.ApiClient.put(`advisor/clients/${clientId}/policies/${policy.Id}`, {
        ...policy
    })
}

const Delete = (clientId, policyId, execute) => {
    return window.ApiClient.delete(`advisor/clients/${clientId}/policies/${policyId}?execute=${execute}`);
}

const defaults = {
    Create,
    Update,
    Delete,
};
export default defaults;
