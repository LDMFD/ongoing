import React, { useEffect, useContext, useCallback, useState } from 'react';

import Api from './Api';

import { Context } from 'State/StateProvider'

const InitialState = ({ children }) => {
    const [ , dispatch ] = useContext(Context);

    let [ loaded, setLoaded ] = useState(false);

    const getClients         = useCallback(() => { return Api.Clients.Clients.Read(dispatch); },         [ dispatch ]);
    const getFunds           = useCallback(() => { return Api.Global.Funds.Read(dispatch); },           [ dispatch ]);
    const getOperators       = useCallback(() => { return Api.Global.Operators.Read(dispatch); },       [ dispatch ]);
    const getPolicyProviders = useCallback(() => { return Api.Global.PolicyProviders.Read(dispatch); }, [ dispatch ]);
    const getPolicyTypes     = useCallback(() => { return Api.Global.PolicyTypes.Read(dispatch); },     [ dispatch ]);
    const getModels          = useCallback(() => { return Api.Global.Models.Read(dispatch); },          [ dispatch ]);
    
    const getDependencies = useCallback(async () => {
        await getFunds();  // TODO parallelize
        await getPolicyProviders();
        await getPolicyTypes();

        await getOperators();
        await getModels();

        await getClients();

        setLoaded(true);
    }, [
        getFunds,
        getPolicyProviders,
        getPolicyTypes,
        
        getOperators,
        getModels,

        getClients,
    ]);

    useEffect(() => {
        getDependencies();
    }, [ getDependencies ]);

    return loaded ? (
        <>
            {children}
        </>
    ) : null;
}

export default InitialState;
