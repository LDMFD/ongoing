import React from 'react';
import { ModuleTypeDueDiligence } from 'State/ApiCommands/OrgResources/Reviews/ModuleTypes';
import Module from 'Components/Pages/Advisor/Reviews/Modules/Module';
import TabContent from 'Components/Library/TabContent/TabContent';

const DueDiligence = () => {
    return (
        <TabContent>
            <Module module={ModuleTypeDueDiligence} />
        </TabContent>
    );
}

export default DueDiligence;
