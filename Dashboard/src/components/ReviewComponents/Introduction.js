import React from 'react';

import TabContent from 'Components/Library/TabContent/TabContent';
import Module from 'Components/Pages/Advisor/Reviews/Modules/Module';
import { ModuleTypeIntroduction } from 'State/ApiCommands/OrgResources/Reviews/ModuleTypes';
import { FromCanonical } from 'Utils/DateTime';
import { FormatCurrency } from 'Utils/Strings';
import { GetMeta, GetReport } from './GetReport';
import Panel from 'Components/Library/Panel/Panel';

const Introduction = () => {
    let report = GetReport();
    
    let totalStarting = report.Policies.map(p => p.StartValue).reduce((p, q) => p + q, 0);
    let totalEnding   = report.Policies.map(p => p.EndValue).reduce((p, q) => p + q, 0);

    let meta = GetMeta();

    let startDate = FromCanonical(meta.StartDate)?.toLocaleDateString('en-GB');
    let endDate =   FromCanonical(meta.EndDate)?.toLocaleDateString('en-GB');

    return (
        <TabContent>
            <Module module = {ModuleTypeIntroduction} />

            <Panel>
                <p>This review covers the period from {startDate} to {endDate}.</p>

                <p>
                    Total start value: {FormatCurrency(totalStarting)}<br />
                    Total end value: {FormatCurrency(totalEnding)}
                </p>
            </Panel>
            
        </TabContent>
    );
}
export default Introduction;
