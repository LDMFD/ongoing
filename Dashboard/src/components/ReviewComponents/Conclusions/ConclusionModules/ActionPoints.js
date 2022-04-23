import React from 'react';
import { ModuleTypeActionPoints } from 'State/ApiCommands/Global/Reviews/ModuleTypes';
import ModuleWrapper from 'Components/Pages/Advisor/Reviews/Modules/ModuleWrapper';

const ActionPoints = () => {
    return (
        <>
            <br />
            <ModuleWrapper module={ModuleTypeActionPoints} />
        </>
    );
}

export default ActionPoints;
