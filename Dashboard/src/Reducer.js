export const LOGIN              = 'LOGIN';
export const LOGOUT             = 'LOGOUT';
export const USER_LOGGED_IN     = 'USER_LOGGED_IN';
export const SET_CLIENTS        = 'SET_CLIENTS';
export const POPULATE_CLIENT    = 'POPULATE_CLIENT';

const Reducer = (state, action) => {
    switch (action.type) {
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

            default:
            return state;
    }
};

export default Reducer;
