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
                auth: null,
            }

        // Funds

        case SET_FUNDS:
            return {
                ...state,
                funds: action.payload.Funds,
            }

        case SET_OPERATORS:
            return {
                ...state,
                operators: action.payload.Operators,
            }

        case SET_POLICY_TYPES:
            return {
                ...state,
                policyTypes: action.payload.PolicyTypes,
        }

        case SET_POLICY_PROVIDERS:
            return {
                ...state,
                policyProviders: action.payload.PolicyProviders,
            }

        // Clients

        case SET_CLIENTS:
            return {
                ...state,
                clients: action.payload.Clients,
            }

        case POPULATE_CLIENT:
            let fn = (p, q) => p.Id - q.Id;
            action.payload.Client.Policies.sort(fn);
            action.payload.Client.PolicyFunds.sort(fn);
            action.payload.Client.Portfolios.sort(fn);
            return {
                ...state,
                clients: state.Clients.map(c => (
                    c.Id === action.payload.Client.Id ? {
                        ...action.payload.Client
                    } : c
                ))
            }

        case SET_MODELS:
            return {
                ...state,
                models: action.payload.Models || [],
            }
        
        default:
            return state;
    }
};

export default Reducer;
