import React from 'react';
import { ModuleTypeObjectives } from 'State/ApiCommands/OrgResources/Reviews/ModuleTypes';
import Module from 'Components/Pages/Advisor/Reviews/Modules/Module';

const Objectives = () => {
    return (
        <>
            <br />
            <Module module={ModuleTypeObjectives} />
        </>
    );
}

export default Objectives;