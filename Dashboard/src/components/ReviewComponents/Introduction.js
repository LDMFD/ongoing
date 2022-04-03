import React from 'react';

import ModuleWrapper from 'components/Pages/Clients/Reviews/Modules/ModuleWrapper';
import { ModuleTypeIntroduction } from 'State/ApiCommands/Global/Reviews/ModuleTypes';
import { CurrencyFormatter } from 'Utils/Strings';
import { GetReport } from './GetReport';

const Introduction = () => {
    let report = GetReport();

    let totalStarting = report.Policies.map(p => p.StartValue).reduce((p, q) => p + q, 0);
    let totalEnding   = report.Policies.map(p => p.EndValue).reduce((p, q) => p + q, 0);

    return (
        <div>
            <ModuleWrapper module = {ModuleTypeIntroduction} />

            <p>
                Total start value: {CurrencyFormatter.format(totalStarting)}<br />
                Total end value: {CurrencyFormatter.format(totalEnding)}
            </p>
        </div>
    );
}
export default Introduction;
