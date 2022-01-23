import {
    SET_FUNDS
} from "State/Reducer";

const Create = (funds) => {
    return window.ApiClient.post(`/funds`, {
        ...funds,
    });
}

const Read = (dispatch) => {
    return window.ApiClient.get(`/funds`).then(res => {
        dispatch({
            type: SET_FUNDS,
            payload: res.data,
        });
    });
}

const Update = (funds) => {
    return window.ApiClient.put(`/funds/${funds.Id}`, {
        ...funds
    })
}

const Delete = (fundsId) => {
    return window.ApiClient.delete(`/funds/${fundsId}`)
}

const exports = {
    Create,
    Read,
    Update,
    Delete,
};
export default exports;
