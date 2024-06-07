import { useContext, useEffect, useCallback } from 'react';

import { Api, Context } from 'State';
import PageTitle from 'Components/Library/PageTitle/PageTitle';
import { PlannrClient } from 'Types/Integrations';

const PlannrClientList = () => {
    // @ts-ignore
    const [ state, dispatch ] = useContext(Context);

    const getClients = useCallback(async () => {
        await Api.Integrations.Plannr.GetClients(dispatch);
    }, [ dispatch ]);

    useEffect(() => {
        getClients();
    }, [ getClients ]);

    return (
        <div>
            <PageTitle title='Plannr clients | Amplifa' />
            plannr clients

            {state.Integrations?.Plannr.Clients?.map((client: PlannrClient, index: string) => {
                return (
                    <div key={index}>
                        - {client.name} &lt;{client.email}&gt;
                    </div>
                );
            })}
        </div>
    );
}

export default PlannrClientList;
