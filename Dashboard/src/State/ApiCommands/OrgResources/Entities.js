import { SET_ORG_RESOURCES } from "State/Reducer";

const Read = (dispatch) => {
    return window.ApiClient.get(`advisor/org-resources`).then(res => {
        dispatch({
            type: SET_ORG_RESOURCES,
            payload: res.data,
        });
    });
}

const defaults = {
    Read,
};
export default defaults;
