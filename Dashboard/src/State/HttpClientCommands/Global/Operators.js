import {
    SET_OPERATORS
} from "State/Reducer";

const Create = (operators) => {
    return window.ApiClient.post(`/operators`, {
        ...operators,
    });
}

const Read = (dispatch) => {
    return window.ApiClient.get(`/operators`).then(res => {
        dispatch({
            type: SET_OPERATORS,
            payload: res.data,
        });
    });
}

const Update = (operators) => {
    return window.ApiClient.put(`/operators/${operators.Id}`, {
        ...operators
    })
}

const Delete = (operatorId) => {
    return window.ApiClient.delete(`/operators/${operatorId}`)
}

const exports = {
    Create,
    Read,
    Update,
    Delete,
};
export default exports;
