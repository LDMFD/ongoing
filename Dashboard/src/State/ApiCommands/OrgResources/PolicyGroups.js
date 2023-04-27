const Create = (policyGroup) => {
    return window.ApiClient.post(`advisor/policy-groups`, {
        ...policyGroup,
    });
}

const Update = (policyGroup) => {
    return window.ApiClient.put(`advisor/policy-groups/${policyGroup.Id}`, {
        ...policyGroup,
    });
}

const Delete = (policyGroupId) => {
    return window.ApiClient.delete(`advisor/policy-groups/${policyGroupId}`)
}

const defaults = {
    Create,
    Update,
    Delete,
};

export default defaults;
