import React from 'react';
import { ModuleTypeDueDiligence } from 'State/ApiCommands/Global/Reviews/ModuleTypes';
import ModuleWrapper from 'Components/Pages/Advisor/Reviews/Modules/ModuleWrapper';

const DueDiligence = () => {
    return (
        <>
            <br />
            <ModuleWrapper module={ModuleTypeDueDiligence} />
        </>
    );
}

export default DueDiligence;
