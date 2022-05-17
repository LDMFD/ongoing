const Create = (clientId, factFind) => {
    return window.ApiClient.post(`advisor/clients/${clientId}/fact-finds`, {
        ...factFind,
    });
}

const Update = (clientId, factFind) => {
    return window.ApiClient.put(`advisor/clients/${clientId}/fact-finds/${factFind.Id}`, {
        ...factFind
    })
}

const Delete = (clientId, factFindId) => {
    return window.ApiClient.delete(`advisor/clients/${clientId}/fact-finds/${factFindId}`);
}

const defaults = {
    Create,
    Update,
    Delete,
};
export default defaults;
