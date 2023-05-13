import TabContent from 'Components/Library/TabContent/TabContent';
import Module from 'Components/Pages/Advisor/Reviews/Modules/Module';
import { ModuleTypeGoals } from 'State/ApiCommands/OrgResources/Reviews/ModuleTypes';
import React from 'react';

const Goals = () => {
    return (
        <TabContent>
            <Module module={ModuleTypeGoals} />
        </TabContent>
    );
}

export default Goals;
