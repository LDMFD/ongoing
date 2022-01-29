import {
    POPULATE_CLIENT
} from "State/Reducer";

const Create = (client) => {
    return window.ApiClient.post(`advisor/clients`, {
        ...client,
    });
}

const Read = (dispatch, clientId) => {
    return window.ApiClient.get(`advisor/clients/${clientId}`).then(res => {
        dispatch({
            type: POPULATE_CLIENT,
            payload: res.data,
        });
    });
}

const Update = (client) => {
    return window.ApiClient.put(`advisor/clients/${client.Id}`, {
        ...client
    })
}

const Delete = (clientId) => {
    return window.ApiClient.delete(`advisor/clients/${clientId}`)
}

const defaults = {
    Create,
    Read,
    Update,
    Delete,
};
export default defaults;
