import React, {createContext, useReducer } from "react";

import Reducer from './Reducer'

const initialState = {
    Auth:               null, // or { token, name, photoURL }
    Clients:            [],
    Funds:              [],
    Operators:          [],
    Models:             [],
    PolicyTypes:        [],
    PolicyProviders:    [],
    DiligenceTemplates: [],
    ModulePresets:      [],
};
  
const StateProvider = ({children}) => {
    const [state, dispatch] = useReducer(Reducer, initialState);
    return (
        <Context.Provider value={[state, dispatch]}>
            {children}
        </Context.Provider>
    )
};

export const Context = createContext(initialState);
export default StateProvider;
