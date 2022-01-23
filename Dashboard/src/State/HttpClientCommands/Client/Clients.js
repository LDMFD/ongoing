import {
    SET_CLIENTS
} from "State/Reducer";

const Create = (clients) => {
    return window.ApiClient.post(`/clients`, {
        ...clients,
    });
}

const Read = (dispatch) => {
    return window.ApiClient.get(`/clients`).then(res => {
        dispatch({
            type: SET_CLIENTS,
            payload: res.data,
        });
    });
}

const Update = (client) => {
    return window.ApiClient.put(`/clients/${client.Id}`, {
        ...client
    })
}

const Delete = (clientId) => {
    return window.ApiClient.delete(`/clients/${clientId}`)
}

const defaults = {
    Create,
    Read,
    Update,
    Delete,
};
export default defaults;
