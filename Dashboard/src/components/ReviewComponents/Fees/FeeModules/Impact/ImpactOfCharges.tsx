import { Paper } from '@mui/material';
import { useContext } from 'react';
import { useForm } from 'react-hook-form';

import TabContent from 'Components/Library/TabContent/TabContent';
import Module from 'Components/Pages/Advisor/Reviews/Modules/Module';
import { GetReport } from 'Components/ReviewComponents/GetReport';
import { Context } from 'State';
import { ModuleTypeFeesImpact } from 'State/ApiCommands/OrgResources/Reviews/ModuleTypes';
import { CalculatePlatformModel } from '../../Model/FeeModel';
import PersistenceControls from './ControlsContainer';
import { ImpactForm } from './Form';
import ImpactGraph from './ImpactGraph';
import ImpactModel, { Limits } from './ImpactModel';

const ImpactOfGrowthChart = () => {
    const [ state ]: any = useContext(Context);

    let report = GetReport();
    let options = report.ClientOptions.Options;

    let defaultValues = {
        InvestmentGrowthRate: Limits.InvestmentGrowthRate.default,
        CashGrowthRate:       Limits.CashGrowthRate.default,
        Inflation:            Limits.Inflation.default,

        IncludeInflation: true,
        IncludeFees: true,
        IncludeAdvice: true,
    };

    defaultValues = {
        ...defaultValues,
        ...options,
    };

    const { control, handleSubmit, setValue, watch } = useForm<ImpactForm>({
        defaultValues,
    });

    let input: ImpactForm = {
        InvestmentGrowthRate: watch("InvestmentGrowthRate", defaultValues.InvestmentGrowthRate),
        CashGrowthRate:       watch("CashGrowthRate",       defaultValues.CashGrowthRate),
        Inflation:            watch("Inflation",            defaultValues.Inflation),

        IncludeInflation:     watch("IncludeInflation",     defaultValues.IncludeInflation),
        IncludeAdvice:        watch("IncludeAdvice",        defaultValues.IncludeAdvice),
        IncludeFees:          watch("IncludeFees",          defaultValues.IncludeFees),
    };
    input.IncludeAdvice = input.IncludeAdvice && input.IncludeFees;

    let view = CalculatePlatformModel(report, state);

    let maxdata = ImpactModel(view, report, input, true);
    let maxY = Math.max(...maxdata.map((r: any) => r.total));

    let data = ImpactModel(view, report, input, false);

    return (
        <TabContent>
            <Module module={ModuleTypeFeesImpact} client={null} />

            <Paper
                variant="outlined"
                sx={{
                    marginTop: '1rem',
                    padding: '1rem',
            }}>
                <PersistenceControls
                    options      = {options}
                    control      = {control}
                    input        = {input}
                    handleSubmit = {handleSubmit}
                    setValue     = {setValue}
                />

                <ImpactGraph
                    control  = {control}
                    data     = {data}
                    policies = {report.Policies}
                    maxY     = {maxY}
                    growth   = {input.InvestmentGrowthRate}
                />
                <div className='impactChart-xAxisLabel'>Year</div>
            </Paper>
        </TabContent>
    );
}

export default ImpactOfGrowthChart;
