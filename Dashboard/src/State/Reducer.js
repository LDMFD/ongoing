export const LOGIN                   = 'LOGIN';
export const LOGOUT                  = 'LOGOUT';
export const POPULATE_CLIENT         = 'POPULATE_CLIENT';
export const SET_CLIENTS             = 'SET_CLIENTS';
export const SET_RISKASSESSMENT_TEMPLATES = 'SET_RISKASSESSMENT_TEMPLATES';
export const SET_FUNDS               = 'SET_FUNDS';
export const SET_MODELS              = 'SET_MODELS';
export const SET_MODULE_PRESETS      = 'SET_MODULE_PRESETS';
export const SET_OPERATORS           = 'SET_OPERATORS';
export const SET_POLICY_PROVIDERS    = 'SET_POLICY_PROVIDERS';
export const SET_POLICY_TYPES        = 'SET_POLICY_TYPES';

// The various "|| []" in this file are due to the server returning nil for empty arrays.

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

        // Global

        case SET_FUNDS:
            return {
                ...state,
                Funds: action.payload.Funds || [],
            }

        case SET_OPERATORS:
            return {
                ...state,
                Operators: action.payload.Operators || [],
            }

        case SET_POLICY_TYPES:
            return {
                ...state,
                PolicyTypes: action.payload.PolicyTypes || [],
            }

        case SET_POLICY_PROVIDERS:
            return {
                ...state,
                PolicyProviders: action.payload.PolicyProviders || [],
            }

        case SET_RISKASSESSMENT_TEMPLATES:
            return {
                ...state,
                RiskAssessments: action.payload.RiskAssessments || [],
            }

        case SET_MODULE_PRESETS:
            return {
                ...state,
                ModulePresets: action.payload.ModulePresets || [],
            }
        
        case SET_MODELS:
            return {
                ...state,
                Models: action.payload.Models || [],
            }
        
        // Clients

        case SET_CLIENTS:
            return {
                ...state,
                Clients: action.payload.Clients || [],
            }

        case POPULATE_CLIENT:
            let client = action.payload.Client;

            client.Policies    ||= [];
            client.PolicyFunds ||= [];
            client.Portfolios  ||= [];
            client.Reviews     ||= [];

            let fn = (p, q) => p.Id - q.Id;

            client.Policies.sort(fn);
            client.PolicyFunds.sort(fn);
            client.Portfolios.sort(fn);
            client.Reviews.sort(fn);

            return {
                ...state,
                Clients: state.Clients.map(c => (
                    c.Id === client.Id ? {
                        ...client
                    } : c
                ))
            }

        default:
            return state;
    }
};

export default Reducer;
