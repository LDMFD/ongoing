const Create = (clientId, policyfund) => {
    return window.ApiClient.post(`/clients/${clientId}/policyfunds`, {
        ...policyfund,
    });
}

const Update = (client) => {
    return window.ApiClient.put(`/clients/${client.Id}`, {
        ...client
    })
}

const Delete = (clientId, policyfundId) => {
    return window.ApiClient.delete(`/clients/${clientId}/policy-funds/${policyfundId}`);
}

const defaults = {
    Create,
    Update,
    Delete,
};
export default defaults;
