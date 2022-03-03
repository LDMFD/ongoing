const Update = (clientId, reviewId, moduleName, module) => {
    return window.ApiClient.put(`advisor/clients/${clientId}/reviews/${reviewId}/module/${moduleName}`, {
        ...module
    })
}
const Delete = (clientId, reviewId, moduleName, field) => {
    return window.ApiClient.delete(`advisor/clients/${clientId}/reviews/${reviewId}/module/${moduleName}/field/${field}`, {
        ...module
    })
}
const defaults = {
    Update,
    Delete,
};
export default defaults;
