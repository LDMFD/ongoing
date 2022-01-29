import React, { useEffect, useContext, useCallback, useState } from 'react';

import { Context } from 'State/StateProvider'
import { SET_MODELS, SET_OPERATORS } from 'State/Reducer';

const ModelWrapper = ({ children }) => {
    const [ , dispatch ] = useContext(Context);

    let [ loaded, setLoaded ] = useState(false);

    const getModels = useCallback(() => {
        return window.ApiClient.get("advisor/models").then(res => {
            dispatch({
                type: SET_MODELS,
                payload: res.data,
            });
        });
    }, [ dispatch ]);

    const getOperators = useCallback(() => {
        return window.ApiClient.get("advisor/operators").then(res => {
            dispatch({
                type: SET_OPERATORS,
                payload: res.data,
            });
        });
    }, [ dispatch ]);

    const getDependencies = useCallback(async () => {
        await getModels();
        await getOperators();
        setLoaded(true);
    }, [ getModels, getOperators ]);

    useEffect(() => {
        getDependencies();
    }, [ getDependencies ]);

    return loaded ? <>{children}</> : null;
}

export default ModelWrapper;
