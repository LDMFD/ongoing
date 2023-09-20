import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';

import { Context,  } from 'State'
import { ClientModule } from 'Components/Pages/ClientSpace/Modules/ClientModule';
import { AdvisorModule } from './AdvisorModule';
import PageTitle from 'Components/Library/PageTitle/PageTitle';
import { ModuleTypeSelectSpec } from 'State/ApiCommands/OrgResources/Reviews/ModuleTypes';

const Module = ({ client, module }) => {
    const [state, ] = useContext(Context);
    const { reviewId } = useParams();

    let type = ModuleTypeSelectSpec.find(t => t.id === module);

    return (
        <>
            <PageTitle title={`Review - ${type.label} | Amplifa`} />

            {(state.Session.Role === 'client' || reviewId) ? (
                <ClientModule client={client} module={module} />
            ) : (
                <AdvisorModule module={module} />
            )}
        </>
    );
}

export default Module;
