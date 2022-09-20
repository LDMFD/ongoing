import { SET_ORGANISATIONS } from "State/Reducer";

const Create = (org) => {
    return window.ApiClient.post(`admin/organisations`, {
        ...org,
    });
}

const Read = (dispatch) => {
    return window.ApiClient.get(`admin`).then(res => {
        dispatch({
            type: SET_ORGANISATIONS,
            payload: res.data,
        });
    });
}

const Update = (org) => {
    return window.ApiClient.put(`admin/organisations/${org.Id}`, {
        ...org,
    })
}

const defaults = {
    Create,
    Read,
    Update,
};
export default defaults;
