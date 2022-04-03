import { SET_GLOBAL_ENTITIES } from "State/Reducer";

const Read = (dispatch) => {
    return window.ApiClient.get(`advisor/global`).then(res => {
        dispatch({
            type: SET_GLOBAL_ENTITIES,
            payload: res.data,
        });
    });
}

const defaults = {
    Read,
};
export default defaults;
