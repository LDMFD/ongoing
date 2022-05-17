import React from 'react';
import { ModuleTypeGoals } from 'State/ApiCommands/Global/Reviews/ModuleTypes';
import ModuleWrapper from 'Components/Pages/Advisor/Reviews/Modules/ModuleWrapper';

const Goals = () => {
    return (
        <>
            <br />
            <ModuleWrapper module={ModuleTypeGoals} />
        </>
    );
}

export default Goals;
