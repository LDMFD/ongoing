import {
    POPULATE_CLIENT, SET_MODULE_PRESETS, SET_OPERATORS
} from "State/Reducer";

const Read = (dispatch) => {
    return window.ApiClient.get(`client-space`).then(res => {
        dispatch({
            type: SET_OPERATORS,
            payload: {
                Operators: res.data.Operators,
            },
        });
        dispatch({
            type: SET_MODULE_PRESETS,
            payload: {
                ModulePresets: res.data.ModulePresets,
            },
        });
        dispatch({
            type: POPULATE_CLIENT,
            payload: {
                Client: res.data.Client,
            },
        });
    });
}

const defaults = {
    Read,
};
export default defaults;
