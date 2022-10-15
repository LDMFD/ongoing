import React from 'react';
import { ModuleTypeOngoingSuitability } from 'State/ApiCommands/OrgResources/Reviews/ModuleTypes';
import Module from 'Components/Pages/Advisor/Reviews/Modules/Module';

const OngoingSuitability = () => {
    return (
        <>
            <br />
            <Module module={ModuleTypeOngoingSuitability} />
        </>
    );
}

export default OngoingSuitability;
