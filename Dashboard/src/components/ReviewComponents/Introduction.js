import React from 'react';

import Module from 'Components/Pages/Advisor/Reviews/Modules/Module';
import { ModuleTypeIntroduction } from 'State/ApiCommands/Global/Reviews/ModuleTypes';
import { CurrencyFormatter } from 'Utils/Strings';
import { GetMeta, GetReport } from './GetReport';
import { FromCanonical } from 'Utils/DateTime';

const Introduction = () => {
    let report = GetReport();
    
    let totalStarting = report.Policies.map(p => p.StartValue).reduce((p, q) => p + q, 0);
    let totalEnding   = report.Policies.map(p => p.EndValue).reduce((p, q) => p + q, 0);

    let meta = GetMeta();

    let startDate = FromCanonical(meta.StartDate)?.toLocaleDateString('en-GB');
    let endDate =   FromCanonical(meta.EndDate)?.toLocaleDateString('en-GB');

    return (
        <div>
            <Module module = {ModuleTypeIntroduction} />

            <p>This review covers the period from {startDate} to {endDate}.</p>

            <p>
                Total start value: {CurrencyFormatter.format(totalStarting)}<br />
                Total end value: {CurrencyFormatter.format(totalEnding)}
            </p>
        </div>
    );
}
export default Introduction;
