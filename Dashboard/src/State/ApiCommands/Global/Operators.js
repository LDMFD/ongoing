import {
    SET_OPERATORS
} from "State/Reducer";

const Create = (operators) => {
    return window.ApiClient.post(`advisor/operators`, {
        ...operators,
    });
}

const Read = (dispatch) => {
    return window.ApiClient.get(`advisor/operators`).then(res => {
        dispatch({
            type: SET_OPERATORS,
            payload: res.data,
        });
    });
}

const Update = (operators) => {
    return window.ApiClient.put(`advisor/operators/${operators.Id}`, {
        ...operators
    })
}

const Delete = (operatorId) => {
    return window.ApiClient.delete(`advisor/operators/${operatorId}`)
}

const defaults = {
    Create,
    Read,
    Update,
    Delete,
};
export default defaults;
