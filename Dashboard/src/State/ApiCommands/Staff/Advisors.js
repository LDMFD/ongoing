import {
    APPLY
} from "State/Reducer";

const Create = (advisor) => {
    return window.ApiClient.post(`staff`, {
        ...advisor,
    });
}

const Read = (dispatch) => {
    return window.ApiClient.get(`staff`).then(res => {
        dispatch({
            type: APPLY,
            payload: res.data,
        });
    });
}

const Update = (advisor) => {
    return window.ApiClient.put(`staff/${advisor.Id}`, {
        ...advisor
    })
}

const Delete = (advisorId, execute) => {
    return window.ApiClient.delete(`staff/${advisorId}?execute=${execute}`)
}

const defaults = {
    Create,
    Read,
    Update,
    Delete,
};
export default defaults;
