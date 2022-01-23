import {
    SET_MODELS
} from "State/Reducer";

const Create = (models) => {
    return window.ApiClient.post(`/models`, {
        ...models,
    });
}

const Read = (dispatch) => {
    return window.ApiClient.get(`/models`).then(res => {
        dispatch({
            type: SET_MODELS,
            payload: res.data,
        });
    });
}

const Update = (models) => {
    return window.ApiClient.put(`/models/${models.Id}`, {
        ...models
    })
}

const Delete = (modelId) => {
    return window.ApiClient.delete(`/models/${modelId}`)
}

const defaults = {
    Create,
    Read,
    Update,
    Delete,
};
export default defaults;
