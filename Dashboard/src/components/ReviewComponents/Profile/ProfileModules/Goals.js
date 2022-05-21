import React from 'react';
import { ModuleTypeGoals } from 'State/ApiCommands/Global/Reviews/ModuleTypes';
import Module from 'Components/Pages/Advisor/Reviews/Modules/Module';

const Goals = () => {
    return (
        <>
            <Module module={ModuleTypeGoals} />
        </>
    );
}

export default Goals;
