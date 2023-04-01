export const APPLY                        = 'APPLY';
export const LOGIN                        = 'LOGIN';
export const LOGOUT                       = 'LOGOUT';
export const POPULATE_CLIENT              = 'POPULATE_CLIENT';
export const POPULATE_CLIENT_SPACE        = 'POPULATE_CLIENT_SPACE';
export const SET_CLIENTS                  = 'SET_CLIENTS';
export const SET_ORG_RESOURCES            = 'SET_ORG_RESOURCES';
export const SET_ORGANISATIONS            = 'SET_ORGANISATIONS';

// TODO merge most of these.

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

        case SET_ORG_RESOURCES:
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
            let {
                Metadata,
                Reviews,
                Report,
                Draft } = action.payload;
            return {
                ...state,
                Metadata,
                Reviews,
                Report,
                Draft,
            };
        }

        case POPULATE_CLIENT_SPACE: {
            let { Metadata, Reviews } = action.payload;

            return {
                ...state,
                Metadata,
                Reviews,
            };
        }

        case SET_ORGANISATIONS: {
            return {
                ...state,
                ...action.payload,
            }
        }

        case APPLY: {
            return {
                ...state,
                ...action.payload,
            }
        }

        default:
            return state;
    }
};

export default Reducer;
