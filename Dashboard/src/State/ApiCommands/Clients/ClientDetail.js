import {
    POPULATE_CLIENT
} from "State/Reducer";

const Read = (dispatch, clientId) => {
    return window.ApiClient.get(`/clients/${clientId}`).then(res => {
        dispatch({
            type: POPULATE_CLIENT,
            payload: res.data,
        });
    });
}

const defaults = {
    Read,
};
export default defaults;
