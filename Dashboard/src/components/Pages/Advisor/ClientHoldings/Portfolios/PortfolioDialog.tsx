import React from 'react';
import { useForm } from 'react-hook-form';

import { SelectControl } from 'Components/Library/FormControls/SelectControl';
import { TextInput } from 'Components/Library/FormControls/TextInput';
import { CheckboxControl } from 'Components/Library/FormControls/CheckboxControl';

import Dialog from 'Components/Library/Dialog/Dialog';
import { State } from 'Types/Types';
import { Model } from 'Types/OrgResources';

interface PortfolioForm {
    PolicyId: string,
    ModelId: string,
    Proportion: number
    IncludeInFee: boolean,
}

export const PortfolioDialog = (props: {
    state: State,
    portfolio: PortfolioForm,
    submitLabel: string,
    submitHandler: (policy: PortfolioForm) => void,
}) => {
    const { handleSubmit, control } = useForm<PortfolioForm>({
        defaultValues: {
            ...props.portfolio,
            Proportion: props.portfolio.Proportion * 100,
        },
    });

    const onSubmit = (portfolio: PortfolioForm) => {
        props.submitHandler({
            ...portfolio,
            Proportion: parseFloat((portfolio.Proportion / 100) as unknown as string),
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
