import React from 'react';
import { ModuleTypeFactFind } from 'State/ApiCommands/Global/Reviews/ModuleTypes';
import ModuleWrapper from 'Components/Pages/Advisor/Reviews/Modules/ModuleWrapper';

const FactFind = () => {
    return (
        <>
            <ModuleWrapper module={ModuleTypeFactFind} />
        </>
    );
}

export default FactFind;
