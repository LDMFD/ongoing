const Update = (clientId, reviewId, moduleName, module) => {
    return window.ApiClient.put(`advisor/clients/${clientId}/reviews/${reviewId}/module/${moduleName}`, {
        ...module
    })
}
const Delete = (clientId, reviewId, moduleName) => {
    return window.ApiClient.delete(`advisor/clients/${clientId}/reviews/${reviewId}/module/${moduleName}`, {
        ...module
    })
}
const defaults = {
    Update,
    Delete,
};
export default defaults;
