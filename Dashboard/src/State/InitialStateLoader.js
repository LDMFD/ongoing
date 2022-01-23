import React, { useEffect, useContext, useCallback, useState } from 'react';

import {
    SET_CLIENTS,
    SET_FUNDS,
    SET_MODELS,
    SET_OPERATORS,
    SET_POLICY_PROVIDERS,
    SET_POLICY_TYPES,
} from 'State/Reducer';
import { Context } from 'State/StateProvider'

const InitialStateLoader = ({ children }) => {
    const [ , dispatch ] = useContext(Context);

    let [ loaded, setLoaded ] = useState(false);

    const getClients = useCallback(() => {
        return window.ApiClient.get("/clients").then(res => {
            dispatch({
                type: SET_CLIENTS,
                payload: res.data,
            });
        });
    }, [ dispatch ]);

    const getFunds = useCallback(() => {
        return window.ApiClient.get("/funds").then(res => {
            dispatch({
                type: SET_FUNDS,
                payload: res.data,
            });
        });
    }, [ dispatch ]);

    const getOperators = useCallback(() => {
        return window.ApiClient.get("/operators").then(res => {
            dispatch({
                type: SET_OPERATORS,
                payload: res.data,
            });
        });
    }, [ dispatch ]);

    const getPolicyProviders = useCallback(() => {
        return window.ApiClient.get("/policy-providers").then(res => {
            dispatch({
                type: SET_POLICY_PROVIDERS,
                payload: res.data,
            });
        });
    }, [ dispatch ]);

    const getPolicyTypes = useCallback(() => {
        return window.ApiClient.get("/policy-types").then(res => {
            dispatch({
                type: SET_POLICY_TYPES,
                payload: res.data,
            });
        });
    }, [ dispatch ]);

    const getModels = useCallback(() => {
        return window.ApiClient.get("/models").then(res => {
            dispatch({
                type: SET_MODELS,
                payload: res.data,
            });
        });
    }, [ dispatch ]);

    const getDependencies = useCallback(async () => {
        await getFunds();
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

export default InitialStateLoader;
