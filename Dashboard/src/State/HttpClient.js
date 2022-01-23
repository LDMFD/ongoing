import {
    SET_CLIENTS,
    SET_FUNDS,
    SET_MODELS,
} from './Reducer';

import PolicyTypes     from './HttpClientCommands/Global/PolicyTypes';
import PolicyProviders from './HttpClientCommands/Global/PolicyProviders';
import Operators       from './HttpClientCommands/Global/Operators';

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

const exports = {
    GetClients,
    GetFunds,
    GetModels,
 
    Operators,
    PolicyProviders,
    PolicyTypes,
};
export default exports;
