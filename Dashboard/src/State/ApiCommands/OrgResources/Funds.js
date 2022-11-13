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

const Delete = (fundId) => {
    return window.ApiClient.delete(`advisor/funds/${fundId}`)
}

const defaults = {
    Create,
    Update,
    Delete,
};
export default defaults;
