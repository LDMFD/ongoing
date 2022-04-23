import React from 'react';
import { ModuleTypeOngoingSuitability } from 'State/ApiCommands/Global/Reviews/ModuleTypes';
import ModuleWrapper from 'Components/Pages/Advisor/Reviews/Modules/ModuleWrapper';

const OngoingSuitability = () => {
    return (
        <>
            <br />
            <ModuleWrapper module={ModuleTypeOngoingSuitability} />
        </>
    );
}

export default OngoingSuitability;
