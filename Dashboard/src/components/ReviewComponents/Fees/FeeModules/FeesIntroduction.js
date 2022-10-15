import React from 'react';
import { ModuleTypeFees } from 'State/ApiCommands/OrgResources/Reviews/ModuleTypes';
import Module from 'Components/Pages/Advisor/Reviews/Modules/Module';

const FeesIntroduction = () => {
    return (
        <>
            <br />
            <Module module={ModuleTypeFees} />
        </>
    );
}

export default FeesIntroduction;
