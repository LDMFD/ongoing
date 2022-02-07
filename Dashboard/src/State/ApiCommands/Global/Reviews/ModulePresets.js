import {
    SET_MODULE_PRESETS
} from "State/Reducer";

const Create = (modulePreset) => {
    return window.ApiClient.post(`advisor/reviews/module-presets`, {
        ...modulePreset,
    });
}

const Read = (dispatch) => {
    return window.ApiClient.get(`advisor/reviews/module-presets`).then(res => {
        dispatch({
            type: SET_MODULE_PRESETS,
            payload: res.data,
        });
    });
}

const Update = (modulePreset) => {
    return window.ApiClient.put(`advisor/reviews/module-presets/${modulePreset.Id}`, {
        ...modulePreset
    })
}

const Delete = (modulePresetId) => {
    return window.ApiClient.delete(`advisor/reviews/module-presets/${modulePresetId}`)
}

const defaults = {
    Create,
    Read,
    Update,
    Delete,
};
export default defaults;
