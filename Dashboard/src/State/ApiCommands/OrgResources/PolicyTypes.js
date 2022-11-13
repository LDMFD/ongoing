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

const Delete = (policyTypeId) => {
    return window.ApiClient.delete(`advisor/policy-types/${policyTypeId}`)
}

const defaults = {
    Create,
    Update,
    Delete,
};
export default defaults;
