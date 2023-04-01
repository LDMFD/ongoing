const Create = (model) => {
    return window.ApiClient.post(`advisor/models`, {
        ...model,
    });
}

const Update = (models) => {
    return window.ApiClient.put(`advisor/models/${models.Id}`, {
        ...models
    })
}

const Delete = (modelId, execute) => {
    return window.ApiClient.delete(`advisor/models/${modelId}?execute=${execute}`);
}

const defaults = {
    Create,
    Update,
    Delete,
};
export default defaults;
