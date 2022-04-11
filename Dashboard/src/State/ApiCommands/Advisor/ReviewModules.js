const Update = (clientId, moduleName, module) => {
    return window.ApiClient.put(`advisor/clients/${clientId}/modules/${moduleName}`, {
        ...module
    })
}
const Delete = (clientId, moduleName, field) => {
    return window.ApiClient.delete(`advisor/clients/${clientId}/modules/${moduleName}/field/${field}`, {
        ...module
    })
}
const defaults = {
    Update,
    Delete,
};
export default defaults;
