import {
    SET_POLICY_TYPES
} from "State/Reducer";

const Create = (policyType) => {
    return window.ApiClient.post(`/policy-types`, {
        ...policyType,
    });
}

const Read = (dispatch) => {
    return window.ApiClient.get("/policy-types").then(res => {
        dispatch({
            type: SET_POLICY_TYPES,
            payload: res.data,
        });
    });

}

const Update = (policyType) => {
    return window.ApiClient.put(`/policy-types/${policyType.Id}`, {
        ...policyType,
    });
}

const Delete = (policyTypeId) => {
    return window.ApiClient.delete(`/policy-types/${policyTypeId}`)
}

const defaults = {
    Create,
    Read,
    Update,
    Delete,
};
export default defaults;
