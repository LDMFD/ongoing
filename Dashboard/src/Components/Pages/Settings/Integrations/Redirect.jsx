import React, { useCallback, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { APPLY } from "State/Reducer";
import { Api } from 'State';
import { Context } from 'State';
import PageTitle from 'Components/Library/PageTitle/PageTitle';

const Redirect = () => {
    let history = useHistory();

    const [ , dispatch] = useContext(Context);

    const getToken = useCallback(async () => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        const state = params.get('state');

        let res = await Api.Integrations.Plannr.GetAccessToken(code, state);

        dispatch({
            type: APPLY,
            payload: res.data,
        });

        history.push(`/settings/integrations/plannr/choose-account`);
    }, [ dispatch, history ]);

    useEffect(() => {
        getToken();
    }, [ getToken ]);
    
    return (
        <div>
            <PageTitle title='Redirecting... | Amplifa' />
            <p>Connection in progress...</p>
        </div>
    );
}

export default Redirect;
