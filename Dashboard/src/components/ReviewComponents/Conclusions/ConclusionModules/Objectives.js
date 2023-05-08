import React from 'react';
import { ModuleTypeObjectives } from 'State/ApiCommands/OrgResources/Reviews/ModuleTypes';
import Module from 'Components/Pages/Advisor/Reviews/Modules/Module';
import TabContent from 'Components/Library/TabContent/TabContent';

const Objectives = () => {
    return (
        <TabContent>
            <Module module={ModuleTypeObjectives} />
        </TabContent>
    );
}

export default Objectives;