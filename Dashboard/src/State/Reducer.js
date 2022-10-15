export const APPLY                        = 'APPLY';
export const LOGIN                        = 'LOGIN';
export const LOGOUT                       = 'LOGOUT';
export const POPULATE_CLIENT              = 'POPULATE_CLIENT';
export const POPULATE_CLIENT_SPACE        = 'POPULATE_CLIENT_SPACE';
export const SET_CLIENTS                  = 'SET_CLIENTS';
export const SET_RISKASSESSMENT_TEMPLATES = 'SET_RISKASSESSMENT_TEMPLATES';
export const SET_ORG_RESOURCES            = 'SET_ORG_RESOURCES';
export const PROVIDER_CHARGE_REORDER      = 'PROVIDER_CHARGE_REORDER';
export const SET_ORGANISATIONS            = 'SET_ORGANISATIONS';

// TODO figure out how to make this scale - can begin by merging a lot of these.

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

        case PROVIDER_CHARGE_REORDER:
            let { providerId, from, to } = { ...action.payload };
            
            let charges = state.Resources.ProviderCharges
                .filter(pc => pc.ProviderId === providerId)
                .sort((a, b) => (
                    a.Sequence > b.Sequence ? 1 : ((a.Sequence < b.Sequence) ? -1 : 0)
                ));
            
            const [item] = charges.splice(from, 1);
            charges.splice(to, 0, item);
            
            let seq = 0;
            charges = charges.map(c => (
                {
                    ...c,
                    Sequence: seq++,
                }
            ));

            return {
                ...state,
                Entities: {
                    ...state.Resources,
                    ProviderCharges: charges,
                },
            };

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
            console.log(action.payload)
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
