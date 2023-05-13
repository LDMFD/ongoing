import React from 'react';
import { ModuleTypeOngoingSuitability } from 'State/ApiCommands/OrgResources/Reviews/ModuleTypes';
import Module from 'Components/Pages/Advisor/Reviews/Modules/Module';
import TabContent from 'Components/Library/TabContent/TabContent';

const OngoingSuitability = () => {
    return (
        <TabContent>
            <Module module={ModuleTypeOngoingSuitability} />
        </TabContent>
    );
}

export default OngoingSuitability;
