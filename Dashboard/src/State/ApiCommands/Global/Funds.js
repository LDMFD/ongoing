import {
    SET_FUNDS
} from "State/Reducer";

const Create = (funds) => {
    return window.ApiClient.post(`advisor/funds`, {
        ...funds,
    });
}

const Read = (dispatch) => {
    return window.ApiClient.get(`advisor/funds`).then(res => {
        dispatch({
            type: SET_FUNDS,
            payload: res.data,
        });
    });
}

const Update = (funds) => {
    return window.ApiClient.put(`advisor/funds/${funds.Id}`, {
        ...funds
    })
}

const Delete = (fundId) => {
    return window.ApiClient.delete(`advisor/funds/${fundId}`)
}

const defaults = {
    Create,
    Read,
    Update,
    Delete,
};
export default defaults;
