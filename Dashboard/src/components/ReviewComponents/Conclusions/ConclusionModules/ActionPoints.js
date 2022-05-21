import React from 'react';
import { ModuleTypeActionPoints } from 'State/ApiCommands/Global/Reviews/ModuleTypes';
import Module from 'Components/Pages/Advisor/Reviews/Modules/Module';

const ActionPoints = () => {
    return (
        <>
            <br />
            <Module module={ModuleTypeActionPoints} />
        </>
    );
}

export default ActionPoints;
