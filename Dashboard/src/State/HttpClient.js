import {
    SET_CLIENTS,
} from './Reducer';

import Funds           from './HttpClientCommands/Global/Funds';
import Operators       from './HttpClientCommands/Global/Operators';
import PolicyTypes     from './HttpClientCommands/Global/PolicyTypes';
import PolicyProviders from './HttpClientCommands/Global/PolicyProviders';
import Models          from './HttpClientCommands/Global/Models';

const GetClients = (dispatch) => {
    return window.ApiClient.get("/clients").then(res => {
        dispatch({
            type: SET_CLIENTS,
            payload: res.data,
        });
    });
}

const exports = {
    GetClients,

    Funds,
    Models,
    Operators,
    PolicyProviders,
    PolicyTypes,
};
export default exports;
