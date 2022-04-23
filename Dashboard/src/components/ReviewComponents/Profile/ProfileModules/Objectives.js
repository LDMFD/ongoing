import React from 'react';
import { ModuleTypeObjectives } from 'State/ApiCommands/Global/Reviews/ModuleTypes';
import ModuleWrapper from 'Components/Pages/Advisor/Reviews/Modules/ModuleWrapper';

const Objectives = () => {
    return (
        <>
            <ModuleWrapper module={ModuleTypeObjectives} />
        </>
    );
}

export default Objectives;
