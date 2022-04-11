import React, { useContext } from 'react';

import ModuleWrapper from 'Components/Pages/Advisor/Reviews/Modules/ModuleWrapper';
import { ModuleTypeConclusions } from 'State/ApiCommands/Global/Reviews/ModuleTypes';
import { Context } from 'State';

const Conclusions = () => {
    const [state,  ] = useContext(Context);
    let client = state.ClientContext;

    return (
        <div>
            <ModuleWrapper client = {client}
                           module = {ModuleTypeConclusions} />
        </div>
    );
}
export default Conclusions;
