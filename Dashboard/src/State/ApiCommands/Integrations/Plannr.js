import { APPLY } from "State/Reducer";

const GetAuthorizationUrl = () => {
    return window.ApiClient.get(`integrations/plannr/authz-url`);
}

// Exchange authorization code for access token
const GetAccessToken = (code, state) => {
    return window.ApiClient.get(`integrations/plannr/access-token?code=${code}&state=${state}`);
}

const CreateSession = (accountId, state) => {
    return window.ApiClient.post(`integrations/plannr/session?state=${state}`, {
        accountId: accountId,
    });
}

const GetClients = (dispatch) => {
    return window.ApiClient.get(`integrations/plannr/clients`).then(res => {
        dispatch({
            type: APPLY,
            payload: res.data,
        });
    });
}

const defaults = {
    GetAuthorizationUrl,
    GetAccessToken,
    GetClients,
    CreateSession,
};
export default defaults;
