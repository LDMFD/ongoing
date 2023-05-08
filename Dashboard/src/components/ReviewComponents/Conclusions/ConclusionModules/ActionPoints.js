import React from 'react';
import { ModuleTypeActionPoints } from 'State/ApiCommands/OrgResources/Reviews/ModuleTypes';
import Module from 'Components/Pages/Advisor/Reviews/Modules/Module';
import TabContent from 'Components/Library/TabContent/TabContent';

const ActionPoints = () => {
    return (
        <TabContent>
            <Module module={ModuleTypeActionPoints} />
        </TabContent>
    );
}

export default ActionPoints;
