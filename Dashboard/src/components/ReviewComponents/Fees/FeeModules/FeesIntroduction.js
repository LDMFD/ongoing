import React from 'react';
import { ModuleTypeFees } from 'State/ApiCommands/Global/Reviews/ModuleTypes';
import ModuleWrapper from 'Components/Pages/Advisor/Reviews/Modules/ModuleWrapper';

const FeesIntroduction = () => {
    return (
        <>
            <br />
            <ModuleWrapper module={ModuleTypeFees} />
        </>
    );
}

export default FeesIntroduction;
