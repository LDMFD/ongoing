export const LOGIN              = 'LOGIN';
export const LOGOUT             = 'LOGOUT';

export const SET_CLIENTS        = 'SET_CLIENTS';
export const POPULATE_CLIENT    = 'POPULATE_CLIENT';

export const SET_OPERATORS      = 'SET_OPERATORS';

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

        // Operators

        case SET_OPERATORS:
            return {
                ...state,
                operators: action.payload.Operators,
            }

            default:
            return state;
    }
};

export default Reducer;
