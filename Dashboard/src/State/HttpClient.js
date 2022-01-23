import {
    SET_CLIENTS,
    SET_MODELS,
} from './Reducer';

import Funds           from './HttpClientCommands/Global/Funds';
import Operators       from './HttpClientCommands/Global/Operators';
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
    GetModels,
 
    Funds,
    Operators,
    PolicyProviders,
    PolicyTypes,
};
export default exports;
