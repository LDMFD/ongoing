import {
    SET_CLIENTS,
    SET_FUNDS,
    SET_MODELS,
    SET_OPERATORS,
} from './Reducer';

import PolicyTypes     from './HttpClientCommands/Global/PolicyTypes';
import PolicyProviders from './HttpClientCommands/Global/PolicyProviders';

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

const exports = {
    GetClients,
    GetFunds,
    GetModels,
    GetOperators,
 
    PolicyProviders,
    PolicyTypes,
};
export default exports;
