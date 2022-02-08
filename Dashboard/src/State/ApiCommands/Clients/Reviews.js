const Create = (clientId) => {
    return window.ApiClient.post(`advisor/clients/${clientId}/reviews`);
}

const Update = (clientId, review) => {
    return window.ApiClient.put(`advisor/clients/${clientId}/reviews/${review.Id}`, {
        ...review
    })
}

const Delete = (clientId, reviewId) => {
    return window.ApiClient.delete(`advisor/clients/${clientId}/reviews/${reviewId}`);
}

const defaults = {
    Create,
    Update,
    Delete,
};
export default defaults;
