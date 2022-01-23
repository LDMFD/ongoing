export const LOGIN                  = 'LOGIN';
export const LOGOUT                 = 'LOGOUT';
export const SET_CLIENTS            = 'SET_CLIENTS';
export const POPULATE_CLIENT        = 'POPULATE_CLIENT';
export const SET_OPERATORS          = 'SET_OPERATORS';
export const SET_POLICY_TYPES       = 'SET_POLICY_TYPES';
export const SET_POLICY_PROVIDERS   = 'SET_POLICY_PROVIDERS';
export const SET_MODELS             = 'SET_MODELS';
export const SET_FUNDS              = 'SET_FUNDS';

const Reducer = (state, action) => {
    switch (action.type) {
        // User session

        case LOGIN:
            return {
                ...state,
                ...action.payload,
            }

        case LOGOUT:
            return {
                ...state,
                Auth: null,
            }

        // Funds

        case SET_FUNDS:
            return {
                ...state,
                Funds: action.payload.Funds,
            }

        case SET_OPERATORS:
            return {
                ...state,
                Operators: action.payload.Operators,
            }

        case SET_POLICY_TYPES:
            return {
                ...state,
                PolicyTypes: action.payload.PolicyTypes,
        }

        case SET_POLICY_PROVIDERS:
            return {
                ...state,
                PolicyProviders: action.payload.PolicyProviders,
            }

        // Clients

        case SET_CLIENTS:
            return {
                ...state,
                Clients: action.payload.Clients,
            }

        case POPULATE_CLIENT:
            let client = action.payload.Client;

            // Server returns nil for empty arrays
            if (!client.Policies) { client.Policies = []; }
            if (!client.PolicyFunds) { client.PolicyFunds = []; }
            if (!client.Portfolios) { client.Portfolios= []; }

            let fn = (p, q) => p.Id - q.Id;

            client.Policies.sort(fn);
            client.PolicyFunds.sort(fn);
            client.Portfolios.sort(fn);

            return {
                ...state,
                Clients: state.Clients.map(c => (
                    c.Id === client.Id ? {
                        ...client
                    } : c
                ))
            }

        case SET_MODELS:
            return {
                ...state,
                Models: action.payload.Models || [],
            }
        
        default:
            return state;
    }
};

export default Reducer;
