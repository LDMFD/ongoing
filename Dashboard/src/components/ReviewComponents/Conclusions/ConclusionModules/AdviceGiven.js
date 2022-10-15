import React from 'react';
import { ModuleTypeAdviceGiven } from 'State/ApiCommands/OrgResources/Reviews/ModuleTypes';
import Module from 'Components/Pages/Advisor/Reviews/Modules/Module';

const AdviceGiven = () => {
    return (
        <>
            <br />
            <Module module={ModuleTypeAdviceGiven} />
        </>
    );
}

export default AdviceGiven;
