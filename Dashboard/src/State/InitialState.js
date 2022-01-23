import React, { useEffect, useContext, useCallback, useState } from 'react';

import Client from './HttpClient';

import { Context } from 'State/StateProvider'

const InitialState = ({ children }) => {
    const [ , dispatch ] = useContext(Context);

    let [ loaded, setLoaded ] = useState(false);

    const getClients         = useCallback(() => { return Client.GetClients(dispatch); },         [ dispatch ]);
    const getFunds           = useCallback(() => { return Client.GetFunds(dispatch); },           [ dispatch ]);
    const getOperators       = useCallback(() => { return Client.GetOperators(dispatch); },       [ dispatch ]);
    const getPolicyProviders = useCallback(() => { return Client.PolicyProviders.Read(dispatch); }, [ dispatch ]);
    const getPolicyTypes     = useCallback(() => { return Client.PolicyTypes.Read(dispatch); },   [ dispatch ]);
    const getModels          = useCallback(() => { return Client.GetModels(dispatch); },          [ dispatch ]);
    
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
