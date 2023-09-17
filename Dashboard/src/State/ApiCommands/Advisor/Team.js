import {
    APPLY
} from "State/Reducer";

const Read = (dispatch) => {
    return window.ApiClient.get(`advisor/team`).then(res => {
        dispatch({
            type: APPLY,
            payload: res.data,
        });
    });
}

const defaults = {
    Read,
};
export default defaults;
