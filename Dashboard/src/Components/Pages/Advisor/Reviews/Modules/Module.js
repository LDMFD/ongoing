import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';

import { Context,  } from 'State'
import { ClientModule } from 'Components/Pages/ClientSpace/Modules/ClientModule';
import { AdvisorModule } from './AdvisorModule';

const Module = ({ client, module }) => {
    const [state,  ] = useContext(Context);
    const { reviewId } = useParams();

    if (state.Session.Role === 'client' || reviewId) {
        return (
            <ClientModule client={client} module={module} />
        );
    } else {
        return (
            <AdvisorModule module={module} />
        );
    }
}

export default Module;
