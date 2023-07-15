import React from 'react';
import { useForm } from 'react-hook-form';

import Dialog from 'Components/Library/Dialog/Dialog';
import { CheckboxControl } from 'Components/Library/FormControls/CheckboxControl';
import { SelectControl } from 'Components/Library/FormControls/SelectControl';
import { TextInput } from 'Components/Library/FormControls/TextInput';
import { Portfolio } from 'Types/ClientResources';
import { Model } from 'Types/OrgResources';
import { State } from 'Types/Types';
import { PercentageFormatter } from 'Utils/Strings';

interface PortfolioForm {
    Id: string,
    PolicyId: string,
    ModelId: string,
    Proportion: string
    IncludeInFee: boolean,
}

export const PortfolioDialog = (props: {
    state: State,
    portfolio: Portfolio,
    submitLabel: string,
    submitHandler: (policy: Portfolio) => void,
}) => {
    const { handleSubmit, control } = useForm<PortfolioForm>({
        defaultValues: {
            ...props.portfolio,
            Proportion: PercentageFormatter.format(props.portfolio.Proportion * 100),
        },
    });

    const onSubmit = (portfolio: PortfolioForm) => {
        props.submitHandler({
            ...portfolio,
            Proportion: parseFloat(portfolio.Proportion) / 100,
        });
    };

    let policies = props.state.Report.Policies.map(policy => {
        let provider = props.state.Resources.PolicyProviders.find(pp => pp.Id === policy.PolicyProviderId)!;
        let type = props.state.Resources.PolicyTypes.find(pt => pt.Id === policy.PolicyTypeId)!;
        return {
            Id: policy.Id,
            Name: `${policy.ExternalId} - ${provider.Name} ${type.Name}`,
        };
    });

    let models = props.state.Resources.Models.map((t: Model) => {
        let operator = props.state.Resources.Operators.find(o => o.Id === t.OperatorId)!;
        return {
            Id: t.Id,
            Name: `${operator.Name}: ${t.Name}`,
        };
    });

    return (
        <Dialog
            title       = {`${props.submitLabel} Portfolio`}
            intro       = 'Enter portfolio details:'
            submitLabel = {props.submitLabel}
            onSubmit    = {handleSubmit(onSubmit)}
            content = {
                <>
                    <SelectControl name='PolicyId' options={policies} label='Policy' control={control} required />
                    <SelectControl name='ModelId'  options={models}   label='Model'  control={control} required />

                    <TextInput name='Proportion' label='Proportion (%)' control={control} required type='numeric' />

                    <CheckboxControl name='IncludeInFee' label='Include in fee calculation?' control={control} />
                </>
            }
        />
    );
}

export default PortfolioDialog;
