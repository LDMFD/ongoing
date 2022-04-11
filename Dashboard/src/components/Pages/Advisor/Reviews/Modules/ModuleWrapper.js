import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';

import { Context,  } from 'State'
import { Module } from 'Components/Pages/ClientSpace/Modules/Module';
import { ModuleEditor } from './ModuleEditor';

const ModuleWrapper = ({ client, module }) => {
    const [state,  ] = useContext(Context);
    const { reviewId } = useParams();

    if (state.Auth.UserType === 'client' || reviewId) {
        return (
            <Module client={client} module={module} />
        );
    } else {
        return (
            <ModuleEditor client={client} module={module} />
        );
    }
}

export default ModuleWrapper;
