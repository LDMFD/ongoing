import {
    POPULATE_CLIENT_SPACE,
} from "State/Reducer";

const Read = (dispatch) => {
    return window.ApiClient.get(`client-space`).then(res => {
        dispatch({
            type: POPULATE_CLIENT_SPACE,
            payload: res.data,
        });
    });
}

const defaults = {
    Read,
};
export default defaults;
