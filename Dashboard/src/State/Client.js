import {
    SET_CLIENTS,
    SET_FUNDS,
    SET_MODELS,
    SET_OPERATORS,
    SET_POLICY_PROVIDERS,
    SET_POLICY_TYPES,
} from './Reducer';

const GetClients = (dispatch) => {
    return window.ApiClient.get("/clients").then(res => {
        dispatch({
            type: SET_CLIENTS,
            payload: res.data,
        });
    });
}

const GetFunds = (dispatch) => {
    return window.ApiClient.get("/funds").then(res => {
        dispatch({
            type: SET_FUNDS,
            payload: res.data,
        });
    });
}

const GetModels = (dispatch) => {
    return window.ApiClient.get("/models").then(res => {
        dispatch({
            type: SET_MODELS,
            payload: res.data,
        });
    });
}

const GetOperators = (dispatch) => {
    return window.ApiClient.get("/operators").then(res => {
        dispatch({
            type: SET_OPERATORS,
            payload: res.data,
        });
    });

}

const GetPolicyProviders = (dispatch) => {
    window.ApiClient.get("/policy-providers").then(res => {
        dispatch({
            type: SET_POLICY_PROVIDERS,
            payload: res.data,
        });
    });
}

const UpdatePolicyProvider = (policyProvider) => {
    window.ApiClient.put(`/policy-providers/${policyProvider.Id}`, {
        ...policyProvider
    })
}

const GetPolicyTypes = (dispatch) => {
    return window.ApiClient.get("/policy-types").then(res => {
        dispatch({
            type: SET_POLICY_TYPES,
            payload: res.data,
        });
    });

}

const exports = {
    GetClients,
 
    GetFunds,
 
    GetModels,
 
    GetOperators,
 
    GetPolicyProviders,
    UpdatePolicyProvider,

    GetPolicyTypes,
};
export default exports;
