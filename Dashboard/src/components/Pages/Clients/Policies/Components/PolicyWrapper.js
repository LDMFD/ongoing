import React, { useEffect, useContext, useCallback, useState } from 'react';

import { Context } from 'Store'
import { SET_POLICY_TYPES, SET_POLICY_PROVIDERS } from 'Reducer';

const PolicyWrapper = ({ children }) => {
    const [ , dispatch ] = useContext(Context);

    let [ loaded, setLoaded ] = useState(false);

    const getPolicyTypes = useCallback(() => {
        return window.ApiClient.get("/policy-types").then(res => {
            dispatch({
                type: SET_POLICY_TYPES,
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

    const getPolicyData = useCallback(async () => {
        await getPolicyTypes();
        await getPolicyProviders();
        setLoaded(true);
    }, [ getPolicyTypes, getPolicyProviders ]);

    useEffect(() => {
        getPolicyData();
    }, [ getPolicyData ]);

    return loaded ? <>{children}</> : null;
}

export default PolicyWrapper;
