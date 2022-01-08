import React, { useEffect, useContext, useCallback, useState } from 'react';

import { Context } from 'Store'
import { SET_PORTFOLIOS, SET_OPERATORS } from 'Reducer';

const PortfolioWrapper = ({ children }) => {
    const [ , dispatch ] = useContext(Context);

    let [ loaded, setLoaded ] = useState(false);

    const getPortfolios = useCallback(() => {
        return window.ApiClient.get("/portfolios").then(res => {
            dispatch({
                type: SET_PORTFOLIOS,
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

    const getDependencies = useCallback(async () => {
        await getPortfolios();
        await getOperators();
        setLoaded(true);
    }, [ getPortfolios, getOperators ]);

    useEffect(() => {
        getDependencies();
    }, [ getDependencies ]);

    return loaded ? <>{children}</> : null;
}

export default PortfolioWrapper;
