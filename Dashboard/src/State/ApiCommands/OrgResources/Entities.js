import { SET_ORG_RESOURCES } from "State/Reducer";

const Read = (dispatch) => {
    return window.ApiClient.get(`Advisor/OrgResources`).then(res => {
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
