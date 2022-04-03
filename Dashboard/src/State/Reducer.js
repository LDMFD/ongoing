export const LOGIN                        = 'LOGIN';
export const LOGOUT                       = 'LOGOUT';
export const POPULATE_CLIENT              = 'POPULATE_CLIENT';
export const POPULATE_CLIENT_SPACE        = 'POPULATE_CLIENT_SPACE';
export const SET_CLIENTS                  = 'SET_CLIENTS';
export const SET_RISKASSESSMENT_TEMPLATES = 'SET_RISKASSESSMENT_TEMPLATES';
export const SET_GLOBAL_ENTITIES          = 'SET_GLOBAL_ENTITIES';

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

        case SET_GLOBAL_ENTITIES:
            return {
                ...state,
                ...action.payload,
            }

        case SET_CLIENTS:
            let { Clients } = action.payload;
            return {
                ...state,
                Clients,
            }

        case POPULATE_CLIENT: {
            let { ClientContext, Report, Reviews } = action.payload;
            return {
                ...state,
                ClientContext,
                Reviews,
                Report,
            };
        }

        case POPULATE_CLIENT_SPACE: {
            let { ClientContext, Reviews } = action.payload;

            return {
                ...state,
                ClientContext,
                Reviews,
            };
        }

        default:
            return state;
    }
};

export default Reducer;
