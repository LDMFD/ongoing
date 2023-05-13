import React from 'react';
import { ModuleTypeAdviceGiven } from 'State/ApiCommands/OrgResources/Reviews/ModuleTypes';
import Module from 'Components/Pages/Advisor/Reviews/Modules/Module';
import TabContent from 'Components/Library/TabContent/TabContent';

const AdviceGiven = () => {
    return (
        <TabContent>
            <Module module={ModuleTypeAdviceGiven} />
        </TabContent>
    );
}

export default AdviceGiven;
