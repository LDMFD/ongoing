import React, { useContext,  } from 'react';

import { Context,  } from 'State'
import { Module } from 'components/Pages/ClientSpace/Modules/Module';
import { ModuleEditor } from './ModuleEditor';

const ModuleWrapper = ({ client, module }) => {
    const [state,  ] = useContext(Context);

    if (state.Auth.UserType === 'client') {
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
