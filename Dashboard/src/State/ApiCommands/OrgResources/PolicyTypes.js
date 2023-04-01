const Create = (policyType) => {
    return window.ApiClient.post(`advisor/policy-types`, {
        ...policyType,
    });
}

const Update = (policyType) => {
    return window.ApiClient.put(`advisor/policy-types/${policyType.Id}`, {
        ...policyType,
    });
}

const Delete = (policyTypeId, execute) => {
    return window.ApiClient.delete(`advisor/policy-types/${policyTypeId}?execute=${execute}`);
}

const defaults = {
    Create,
    Update,
    Delete,
};
export default defaults;
