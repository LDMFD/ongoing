import {
    SET_MODELS
} from "State/Reducer";

const Create = (models) => {
    return window.ApiClient.post(`advisor/models`, {
        ...models,
    });
}

const Read = (dispatch) => {
    return window.ApiClient.get(`advisor/models`).then(res => {
        dispatch({
            type: SET_MODELS,
            payload: res.data,
        });
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
    Read,
    Update,
    Delete,
};
export default defaults;
