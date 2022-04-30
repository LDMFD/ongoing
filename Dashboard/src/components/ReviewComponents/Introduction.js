import React from 'react';

import Day from 'dayjs';
import utc from 'dayjs/plugin/utc';

import ModuleWrapper from 'Components/Pages/Advisor/Reviews/Modules/ModuleWrapper';
import { ModuleTypeIntroduction } from 'State/ApiCommands/Global/Reviews/ModuleTypes';
import { CurrencyFormatter } from 'Utils/Strings';
import { GetMeta, GetReport } from './GetReport';

const Introduction = () => {
    Day.extend(utc);

    let report = GetReport();
    
    let totalStarting = report.Policies.map(p => p.StartValue).reduce((p, q) => p + q, 0);
    let totalEnding   = report.Policies.map(p => p.EndValue).reduce((p, q) => p + q, 0);

    let meta = GetMeta();

    let startDate = Day(meta.StartDate).utc(false).format('DD-MM-YYYY');
    let endDate =   Day(meta.EndDate).utc(false).format('DD-MM-YYYY');

    return (
        <div>
            <ModuleWrapper module = {ModuleTypeIntroduction} />

            <p>This review covers the period from {startDate} to {endDate}.</p>

            <p>
                Total start value: {CurrencyFormatter.format(totalStarting)}<br />
                Total end value: {CurrencyFormatter.format(totalEnding)}
            </p>
        </div>
    );
}
export default Introduction;
