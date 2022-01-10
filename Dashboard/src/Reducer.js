export const LOGIN                  = 'LOGIN';
export const LOGOUT                 = 'LOGOUT';
export const SET_CLIENTS            = 'SET_CLIENTS';
export const POPULATE_CLIENT        = 'POPULATE_CLIENT';
export const SET_OPERATORS          = 'SET_OPERATORS';
export const SET_POLICY_TYPES       = 'SET_POLICY_TYPES';
export const SET_POLICY_PROVIDERS   = 'SET_POLICY_PROVIDERS';
export const SET_PORTFOLIOS         = 'SET_PORTFOLIOS';

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
            return {
                ...state,
                clients: state.clients.map(c => (
                    c.Id === action.payload.Client.Id ? {
                        ...action.payload.Client
                    } : c
                ))
            }

        case SET_PORTFOLIOS:
            return {
                ...state,
                portfolios: action.payload.Portfolios || [],
            }
        
        default:
            return state;
    }
};

export default Reducer;
