import React, { useContext  } from 'react';
import { ModuleTypeFees } from 'State/ApiCommands/Global/Reviews/ModuleTypes';
import ModuleWrapper from 'components/Pages/Clients/Reviews/Modules/ModuleWrapper';
import { Context } from 'State';

const FeesIntroduction = () => {
    const [state, ] = useContext(Context);
    let client = state.ClientContext;

    return (
        <>
            <br />
            <ModuleWrapper client={client}
                           module={ModuleTypeFees} />
        </>
    );
}

export default FeesIntroduction;
