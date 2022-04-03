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

const Delete = (modelId) => {
    return window.ApiClient.delete(`advisor/models/${modelId}`)
}

const defaults = {
    Create,
    Update,
    Delete,
};
export default defaults;
