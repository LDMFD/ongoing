const Create = (funds) => {
    return window.ApiClient.post(`advisor/funds`, {
        ...funds,
    });
}

const Update = (fund) => {
    return window.ApiClient.put(`advisor/funds/${fund.Id}`, {
        ...fund
    })
}

const Delete = (fundId, execute) => {
    return window.ApiClient.delete(`advisor/funds/${fundId}?execute=${execute}`)
}

const defaults = {
    Create,
    Update,
    Delete,
};
export default defaults;
