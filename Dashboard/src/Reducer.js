export const SET_CLIENTS        = 'SET_CLIENTS';
export const POPULATE_CLIENT    = 'POPULATE_CLIENT';

const Reducer = (state, action) => {
    switch (action.type) {
        case 'USER_LOGGED_IN':
            return {
                ...state,
                loggedIn: action.payload.loggedIn,
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
