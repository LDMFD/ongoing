import {
    SET_POLICY_PROVIDERS
} from "State/Reducer";

const Create = (policyProvider) => {
    return window.ApiClient.post(`advisor/policy-providers`, {
        ...policyProvider,
    });
}

const Read = (dispatch) => {
    return window.ApiClient.get("advisor/policy-providers").then(res => {
        dispatch({
            type: SET_POLICY_PROVIDERS,
            payload: res.data,
        });
    });
}

const Update = (policyProvider) => {
    return window.ApiClient.put(`advisor/policy-providers/${policyProvider.Id}`, {
        ...policyProvider
    })
}

const Delete = (policyProviderId) => {
    return window.ApiClient.delete(`advisor/policy-providers/${policyProviderId}`)
}

const defaults = {
    Create,
    Read,
    Update,
    Delete,
};
export default defaults;
