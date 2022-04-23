import React from 'react';
import { ModuleTypeAdviceGiven } from 'State/ApiCommands/Global/Reviews/ModuleTypes';
import ModuleWrapper from 'Components/Pages/Advisor/Reviews/Modules/ModuleWrapper';

const AdviceGiven = () => {
    return (
        <>
            <br />
            <ModuleWrapper module={ModuleTypeAdviceGiven} />
        </>
    );
}

export default AdviceGiven;
