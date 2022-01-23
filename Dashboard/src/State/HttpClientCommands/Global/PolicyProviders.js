import {
    SET_POLICY_PROVIDERS
} from "State/Reducer";

const Create = (policyProvider) => {
    return window.ApiClient.post(`/policy-providers`, {
        ...policyProvider,
    });
}

const Read = (dispatch) => {
    return window.ApiClient.get("/policy-providers").then(res => {
        dispatch({
            type: SET_POLICY_PROVIDERS,
            payload: res.data,
        });
    });
}

const Update = (policyProvider) => {
    return window.ApiClient.put(`/policy-providers/${policyProvider.Id}`, {
        ...policyProvider
    })
}

const Delete = (policyProviderId) => {
    return window.ApiClient.delete(`/policy-providers/${policyProviderId}`)
}

const exports = {
    Create,
    Read,
    Update,
    Delete,
};
export default exports;
