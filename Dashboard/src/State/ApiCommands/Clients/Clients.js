import {
    SET_CLIENTS
} from "State/Reducer";

const Read = (dispatch) => {
    return window.ApiClient.get(`advisor/clients`).then(res => {
        dispatch({
            type: SET_CLIENTS,
            payload: res.data,
        });
    });
}

const defaults = {
    Read,
};
export default defaults;
