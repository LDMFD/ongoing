const Create = (clientId, policyfund) => {
    return window.ApiClient.post(`advisor/clients/${clientId}/policyfunds`, {
        ...policyfund,
    });
}

const Update = (client) => {
    return window.ApiClient.put(`advisor/clients/${client.Id}`, {
        ...client
    })
}

const Delete = (clientId, policyfundId) => {
    return window.ApiClient.delete(`advisor/clients/${clientId}/policy-funds/${policyfundId}`);
}

const defaults = {
    Create,
    Update,
    Delete,
};
export default defaults;
