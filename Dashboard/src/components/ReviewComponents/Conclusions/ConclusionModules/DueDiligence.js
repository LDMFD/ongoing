import React from 'react';
import { ModuleTypeDueDiligence } from 'State/ApiCommands/OrgResources/Reviews/ModuleTypes';
import Module from 'Components/Pages/Advisor/Reviews/Modules/Module';

const DueDiligence = () => {
    return (
        <>
            <br />
            <Module module={ModuleTypeDueDiligence} />
        </>
    );
}

export default DueDiligence;
