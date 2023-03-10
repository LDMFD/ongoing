import { SliderControl } from 'Components/Library/FormControls/SliderControl';
import { CheckboxControl } from 'Components/Library/FormControls/CheckboxControl';
import { Limits } from './ImpactModel';

export const CheckboxControls = (props: {
    control: any,
    includeFees: boolean,
}) => {
    return (
        <div className='chart-controls'>
            <CheckboxControl
                name    = 'IncludeFees'
                label   = 'Include fees'
                control = {props.control}
            />
            <CheckboxControl
                name     = 'IncludeAdvice'
                label    = 'Include IFA fees'
                control  = {props.control}
                disabled = {!props.includeFees}
                override = {!props.includeFees}
                value    = {false}
            />
            <CheckboxControl
                name    = 'IncludeInflation'
                label   = 'Inflation adjusted'
                control = {props.control}
            />
        </div>
    )
};

export const ChartControls = (props: {
    control: any,
    inflation: number,
    includeInflation: boolean,
}) => {
    return (
        <div className='chart-controls'>
            <SliderControl
                name    = 'InvestmentGrowthRate'
                label   = 'Investment growth rate'
                min     = {Limits.InvestmentGrowthRate.min}
                max     = {Limits.InvestmentGrowthRate.max}
                step    = {Limits.InvestmentGrowthRate.step}
                control = {props.control}
            />
            <SliderControl
                name    = 'CashGrowthRate'
                label   = 'Cash growth rate %'
                min     = {Limits.CashGrowthRate.min}
                max     = {Limits.CashGrowthRate.max}
                step    = {Limits.CashGrowthRate.step}
                control = {props.control}
            />
            
            <span style={{ zIndex: 10000000, position: 'relative', }}>
                <SliderControl
                    disabled = {!props.includeInflation}
                    name     = 'Inflation'
                    label    = 'Inflation %'
                    min      = {Limits.Inflation.min}
                    max      = {Limits.Inflation.max}
                    step     = {Limits.Inflation.step}
                    control  = {props.control}
                    marks    = {props.includeInflation ? true : [{
                        value: props.inflation,
                        label: (
                            <span style={{ background: 'white' }}>
                                Inflation preset to {props.inflation}% when enabled
                            </span>
                        ),
                    }]}
                />
            </span>
        </div>
    )
};

