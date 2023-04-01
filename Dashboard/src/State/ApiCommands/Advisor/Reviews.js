const Update = (clientId, review) => {
    return window.ApiClient.put(`advisor/clients/${clientId}/reviews/${review.Id}`, {
        ...review
    })
}

const Delete = (clientId, reviewId) => {
    return window.ApiClient.delete(`advisor/clients/${clientId}/reviews/${reviewId}`);
}

const Publish = (clientId, reviewId) => {
    return window.ApiClient.post(`advisor/clients/${clientId}/reviews/${reviewId}/publish`);
}

const defaults = {
    Update,
    Delete,
    Publish,
};
export default defaults;
